// TODO: check invalid username
import express from 'express';
import bcryptjs from 'bcryptjs';
import moment from 'moment';
import * as userModel from '../models/user.model';
import studentModel from '../models/student.model';
import teacherModel from '../models/teacher.model';
const router = express.Router();
import courseModel from '../models/course.model';
import User from '../models/classes/User';
import Teacher from '../models/classes/Teacher';
import Student from '../models/classes/Student';


router.post('/profile/save/:username', async function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const cpassword = req.body.cpassword;
    const npassword = req.body.npassword;
    const cfpassword = req.body.cfpassword;
    const username = req.params.username;
    const user = await userModel.getUserByUserName(username);
    const userPass = await userModel.singleByUserName(username);

    if (user != null) {
        if (cpassword != '' && userPass != null) {
            const ret = bcryptjs.compareSync(cpassword, userPass.password);
            if (ret === false) {
                return res.render('vwAccounts/profile', {
                    err_message: 'Invalid password'
                });
            }
            const hashedPass = bcryptjs.hashSync(npassword, 12);
            await userModel.updatePassWord(username, hashedPass);
            res.redirect(`/user/profile/${username}`);
        }
        if (user.permission == 1) {
            if (name != '') {
                await userModel.updateNameStudent(username, name);
            }
            if (email != '') {
                await userModel.updateEmailStudent(username, email);
            }
            res.redirect(`/user/profile/${username}`);
        }
        if (user.permission == 2) {
            if (name != '') {
                await userModel.updateNameTeacher(username, name);
            }
            if (email != '') {
                await userModel.updateEmailTeacher(username, email);
            }
            res.redirect(`/user/profile/${username}`);

        }
    }

})

router.get('/profile/:username', async function (req, res) {
    let userDetail: {
        user: User | null,
        info: Teacher | Student | null
    } = {
        user: null,
        info: null
    }
    userDetail.user = await userModel.getUserByUserName(req.params.username);
    if (userDetail.user != null) {
        if (userDetail.user.permission == 1) {
            userDetail.info = await studentModel.singleFromUID(userDetail.user.UID);
        } else {
            userDetail.info = await teacherModel.singleFromUID(userDetail.user.UID);
        }
        res.render('vwAccounts/profile', {
            userDetail: userDetail,
            isTeacher: userDetail.user.permission == 2
        });
        return;
    }
    res.redirect("/err")
})



export default router;