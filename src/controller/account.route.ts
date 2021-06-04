import express, { NextFunction } from 'express';
import { FieldPacket, RowDataPacket } from 'mysql2';
import bcryptjs from 'bcryptjs'
import *  as userModel from '../models/user.model';
import teacherModel from '../models/teacher.model';
import studentModel from '../models/student.model';
import moment from 'moment'
import * as SessionData from '../models/classes/express-session-SessionData';
import User from '../models/classes/User';
import Student from '../models/classes/Student';
import Teacher from '../models/classes/Teacher';
import nodemailer from "nodemailer"; //gửi mail




const router = express.Router();

// send email server

let emailAndOtp: {
    [email: string]: number
}; // Temporary save email and their otp here      //save dictionary với key là email, value là otp

emailAndOtp = {};
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
        user: "buitaductuan@gmail.com",
        pass: "gangnamsai1506",
    },
});

router.get('/login', (req: express.Request, res: express.Response) => {
    res.render("vwAccounts/login.hbs", {
        layout: false
    })
});


router.post('/login', async (req: express.Request, res: express.Response, next: NextFunction) => {
    let usernameInput: string;
    let passwordInput: string;
    usernameInput = req.body.username;
    passwordInput = req.body.password;
    const user = await userModel.singleByUserName(usernameInput);
    if (user === null) {
        console.log("'Invalid username'");
        
        return res.render('vwAccounts/login', {
            layout: false,
            err_message: 'Invalid username'
        });
    }
    const ret = bcryptjs.compareSync(passwordInput, user.password);
    if (ret === false) {
        console.log("'Invalid pass'");

        return res.render('vwAccounts/login', {
            layout: false,
            err_message: 'Invalid password'
        });
    }
    let userDetail;
    if (user.permission === 3) {
        return res.redirect('/admin');
    }
    if (user.block === 1) {
        return res.redirect('/');
    }
    if (user.permission === teacherModel.TEACHER_PROPERTIES.permission) {
        const teacher = await teacherModel.singleFromUID(user.UID);
        if (teacher != null) {
            userDetail = {
                username: user.username,
                Name: teacher?.name,
                ID: teacher.UID,
                StuID: undefined,
                TeaID: teacher?.teaID,
                permission: teacherModel.TEACHER_PROPERTIES.permission
            }
        }

        //console.log(userDetail);

    }
    if (user.permission === studentModel.STUDENT_PROPERTIES.permission) {
        const student = await studentModel.singleFromUID(user.UID);
        if (student != null) {
            userDetail = {
                username: user.username,
                Name: student?.name,
                ID: student.UID,
                StuID: student?.stuID,
                TeaID: undefined,
                permission: studentModel.STUDENT_PROPERTIES.permission
            };
        }
    }
    //TODO:fix this line 
    //console.log(userDetail)
    req.session.auth = true;
    req.session.authUser = userDetail;
    req.session.save(err => {
        const url = '/';
        res.redirect(url)
    });
})



router.get('/register', async function (req, res, next) {
    res.render('vwAccounts/register', {
        layout: false
    });
})

router.post('/register', async function (req, res, next) {
    const hashedPass = bcryptjs.hashSync(req.body.password, 12);
    const dob = await moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

    let gender;
    let permission;
    let user_Detail;
    let UID = "";

    if (req.body.gender === "Male") gender = 1;
    else if (req.body.gender === "Female") gender = 2;
    else gender = 3;
    if (req.body.userType === 'STUDENT') {
        permission = studentModel.STUDENT_PROPERTIES.permission;
        UID = `St${await studentModel.largest_ID() + 1}`;

        user_Detail = new Student(-1, req.body.fullname, dob, req.body.email, gender, UID);
        await studentModel.add(user_Detail);


    } else if (req.body.userType === 'TEACHER') {
        permission = teacherModel.TEACHER_PROPERTIES.permission;
        UID = `Tea${await teacherModel.largest_ID() + 1}`;
        //console.log(UID);
        user_Detail = new Teacher(-1, req.body.fullname, dob, req.body.email, gender, UID);
        await teacherModel.add(user_Detail);
    }


    const user = new User(undefined, req.body.username, hashedPass, permission, UID, 0);
    await userModel.add(user);
    res.redirect('/account/login');
})

router.post('/otp', async function (req, res) { //nhận data từ file register.hbs
    let username = req.body.username;
    let email = req.body.email;
    const check_username = await userModel.getUserByUserName(username); //trả về null nếu ko có
    const check_email = await userModel.getUserByEmail(email)
    if (check_username !== null) { //nếu có r thì dk lại
        res.render('vwAccounts/register', {
            layout: false,
            msg: "Username existed"
        });
    } else if (check_email !== null) {
        res.render('vwAccounts/register', {
            layout: false,
            msg: "Email existed"
        });
    } else {
        let otp = parseInt((Math.random() * 1000000).toString()); //tạo otp random
        let email = req.body.email;

        // send mail with defined transport object
        var mailOptions = {
            to: req.body.email,
            subject: "Otp for registration is: ",
            html: "<h3>OTP for account verification is </h3>" +
                "<h1 style='font-weight:bold;'>" +
                otp +
                "</h1>", // html body
        };

        transporter.sendMail(mailOptions, (error, info) => { //gửi mail
            if (error) {
                return console.log(error);
            }
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            // OTP page will take email as a query statement for it POST methods
            emailAndOtp[email] = otp;
            console.log(emailAndOtp);
            res.render("vwAccounts/verify", { //xác minh
                msg: "An OTP has been sent to your email",
                Data: {
                    fullname: req.body.fullname,
                    username: req.body.username,
                    password: req.body.password,
                    confirm: req.body.confirm,
                    email: email,
                    dob: req.body.dob,
                    gender: req.body.gender,
                    userType: req.body.userType
                },
                layout: false
            });
        });
    }

})

router.post("/verify", async function (req, res) { //xác minh OTP
    let email = req.body.email; //lấy email để so sánh trong emailAndOtp
    let otp = emailAndOtp[email];
    // delete emailAndOtp[email]; 
    if (req.body.otp == otp) { //OTP đúng
        const hashedPass = bcryptjs.hashSync(req.body.password, 12);
        const dob = await moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

        let gender;
        let permission;
        let user_Detail;
        let UID = "";

        if (req.body.gender === "Male") gender = 1;
        else if (req.body.gender === "Female") gender = 2;
        else gender = 3;
        console.log("User type:" + req.body.userType);

        if (req.body.userType === 'STUDENT') {
            permission = studentModel.STUDENT_PROPERTIES.permission;
            UID = `St${await studentModel.largest_ID() + 1}`;

            user_Detail = new Student(-1, req.body.fullname, dob, req.body.email, gender, UID);
            await studentModel.add(user_Detail);


        } else if (req.body.userType === 'TEACHER') {
            permission = teacherModel.TEACHER_PROPERTIES.permission;
            UID = `Tea${await teacherModel.largest_ID() + 1}`;
            //console.log(UID);
            user_Detail = new Teacher(-1, req.body.fullname, dob, req.body.email, gender, UID);
            await teacherModel.add(user_Detail);
        }


        const user = new User(undefined, req.body.username, hashedPass, permission, UID, 0);
        await userModel.add(user);
        res.redirect('/account/login');

    } else { //OTP sai
        res.render("vwAccounts/verify", {
            msg: "Your OTP is incorrect, please try again",
            Data: {
                fullname: req.body.fullname,
                username: req.body.username,
                password: req.body.password,
                confirm: req.body.confirm,
                email: email,
                dob: req.body.dob,
                gender: req.body.gender,
                userType: req.body.userType
            },
            layout: false
        });
    }
});


router.post("/resend", function (req, res) { //giống send

    let email = req.body.email;
    let otp = emailAndOtp[email];

    var mailOptions = {
        to: email,
        subject: "Otp for registration is: ",
        html: "<h3>OTP for account verification is </h3>" +
            "<h1 style='font-weight:bold;'>" +
            otp +
            "</h1>", // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res.render("vwAccounts/verify", {
            msg: "OTP has been resent",
            Data: {
                fullname: req.body.fullname,
                username: req.body.username,
                password: req.body.password,
                confirm: req.body.confirm,
                email: email,
                dob: req.body.dob,
                gender: req.body.gender,
                userType: req.body.userType
            },
            layout: false
        });
    });
});

router.post('/logout', async function (req, res) {
    let url = req.headers.referer || '/';
    if (req.session.authUser === undefined) return;
    if (req.session.authUser.permission === teacherModel.TEACHER_PROPERTIES.permission) {
        url = '/';
    }
    req.session.auth = false;
    req.session.authUser = undefined;
    // req.session.retUrl = undefined;
    // req.session.cart = [];


    req.session.save((err) => {
        res.redirect(url);
    });
})



export default router;