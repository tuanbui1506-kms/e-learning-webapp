import express, { NextFunction } from 'express';
import { FieldPacket, RowDataPacket } from 'mysql2';
import bcryptjs from 'bcryptjs'
import *  as userModel from '../models/user.model';
import  teacherModel from '../models/teacher.model';
import  studentModel from '../models/student.model';
import * as SessionData  from '../models/classes/express-session-SessionData';
import User from '../models/classes/User';



const router = express.Router();

router.get('/login', (req: express.Request, res: express.Response) => {
    res.render("../views/vwAccounts/login.hbs"); 
});


router.post('/login', async (req: express.Request, res: express.Response, next: NextFunction) => {
    let usernameInput: string;
    let passwordInput: string;
    usernameInput = req.body.username;
    passwordInput = req.body.password;
    const user = await userModel.singleByUserName(usernameInput);
    if (user === null) {
        return res.render('vwAccounts/login', {
            layout: false,
            err_message: 'Invalid username'
        });
    }
    const ret = bcryptjs.compareSync(passwordInput, user.password);
    if (ret === false) {
        return res.render('vwAccounts/login', {
            layout: false,
            err_message: 'Invalid password'
        });
    }
    let userDetail;
    if(user.permission === 3){
        return res.redirect('/admin');
    } 
    if(user.block === 1){
        return res.redirect('/');
    }
    if (user.permission === teacherModel.TEACHER_PROPERTIES.permission) {
        const teacher = await teacherModel.singleFromUID(user.UID);
        userDetail = {
            username: user.username,
            Name: teacher?.name,
            ID: teacher?.UID,
            StuID: undefined,
            TeaID: teacher?.teaID,
            permission: teacherModel.TEACHER_PROPERTIES.permission
        }
        //console.log(userDetail);

    }
    if (user.permission === studentModel.STUDENT_PROPERTIES.permission) {
        const student = await studentModel.singleFromUID(user.UID);
        //console.log(student)
        userDetail = {
            username: user.username,
            Name: student?.name,
            ID: student?.UID,
            StuID: student?.stuID,
            TeaID: undefined,
            permission: studentModel.STUDENT_PROPERTIES.permission
        };
        //console.log(userDetail);
        
    }
    //TODO:fix this line 
    //console.log(userDetail)
    req.session.auth = true;
    req.session.authUser = userDetail;
    console.log(req.session.authUser);
    req.session.save(err => {
        const url = '/';
        res.redirect(url)
    });
})



export default router;