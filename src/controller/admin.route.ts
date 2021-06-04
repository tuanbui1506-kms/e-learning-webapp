// TODO: check invalid username
import express from 'express';
import bcryptjs from 'bcryptjs';
import moment from 'moment';
import * as userModel from '../models/user.model';
import studentModel from '../models/student.model';
import teacherModel from '../models/teacher.model';
import * as adminModel from '../models/admin.model';
import auth from '../middlewares/auth.mdw';
import { getLogger } from 'nodemailer/lib/shared';
const router = express.Router();
import nodemailer from "nodemailer"; //gửi mail
import CourseSection from '../models/classes/CoursesSection';
import courseModel from '../models/course.model';



router.get('/', async function (req, res) {
    res.render('vwAdmin/index', {
        layout: false,
    });
})

router.get('/category', async function (req, res) {
    var dataCategory = await adminModel.getCategory();
    console.log(dataCategory[0].CountCourse);
    res.render('vwAdmin/category', {
        dataCategory: dataCategory,
        layout: false
    });

})
router.get('/chart', async function (req, res) {
    res.render('vwAdmin/charts', {
        layout: false,
    });
})
router.get('/course', async function (req, res) {
    var courses = await courseModel.all();
    courses.forEach(async (course) => {
        course.courseSection = await courseModel.getAllSection(course.id) || [];
    });
    // res.send(matrixData[0][0]);
    res.render('vwAdmin/course', {
        courses: courses,
        layout: false
    });
})

router.get('/student', async function(req, res) {
    let dataStudent = await studentModel.all();

    res.render('vwAdmin/student', {
        dataStudent: dataStudent,
        layout: false
    });
})
router.get('/teacher', async function (req, res) {
    var dataTeacher = await teacherModel.all();
    res.render('vwAdmin/teacher', {
        dataTeacher: dataTeacher,
        layout: false
    });
})
router.get('/student/delete/:id', async function (req, res) {
    // var newStudentData = await adminModel.deleteStudent(UID);
    var url = req.url.split("/");
    const UID = url[-1];
    try{
        await adminModel.delStudentInStudent(UID);
        await adminModel.delStudentInUsers(UID);
    }catch(err){
        console.log(err);
    }finally{
        res.redirect(req.headers.referer || "/");
    }
})
router.post('/student/edit/:id', async function (req, res) {
    var url = req.url.split("/");
    const UID = url[url.length - 1];
    const name = req.body.sname;
    const dob = req.body.sDOB;
    const gender = req.body.sGender;
    let gt = 0;
    if (gender == "Male") {
        gt = 1;
    } else if (gender == "Female") {
        gt = 0;
    }
    try {
        await adminModel.editStudent(UID, name, dob, gt);
    } catch (err) {
        console.log(err);
    } finally {
        res.redirect(req.headers.referer || "/");

    }
})
router.get('/student/block/:id', async function (req, res) {
    // var newStudentData = await adminModel.deleteStudent(UID);
    var url = req.url.split("/");
    const UID = url[url.length - 1];
    try {
        await adminModel.blockStudent(UID, 1);
    } catch (err) {
        console.log(err);
    } finally {
        res.redirect(req.headers.referer || "/");
    }
})
router.get('/teacher/delete/:id', async function (req, res) {
    // var newStudentData = await adminModel.deleteStudent(UID);
    var url = req.url.split("/");
    const UID = url[url.length - 1];
    try {
        await adminModel.delTeacherInUsers(UID);
        await adminModel.delTeacherInTeacher(UID);
    } catch (err) {
        console.log(err);
    }
    finally {
        res.redirect(req.headers.referer || "/");
    }

})
router.post('/teacher/edit/:id', async function (req, res) {
    var url = req.url.split("/");
    const UID = url[url.length - 1];
    const name = req.body.sname;
    const dob = req.body.sDOB;
    const gender = req.body.sGender;
    let gt = 0;
    if (gender == "Male") {
        gt = 1;
    } else if (gender == "Female") {
        gt = 0;
    }
    await adminModel.editTeacher(UID, name, dob, gt);
    res.redirect('/admin/teacher');
})
router.get('/teacher/block/:id', async function (req, res) {
    // var newStudentData = await adminModel.deleteStudent(UID);
    var url = req.url.split("/");
    const UID = url[url.length - 1];
    await adminModel.blockTeacher(UID, 1);
    res.redirect(req.headers.referer || "/");

})
router.get('/course/delete/:id', async function (req, res) {
    // var newStudentData = await adminModel.deleteStudent(UID);
    var url = req.url.split("/");
    const CoursesID = url[url.length - 1];
    try {
        if (+CoursesID) {
            await adminModel.delCourseInSection(+CoursesID);
            await adminModel.delCourseInCourse(+CoursesID);
        }
    } catch (err) {
        console.log(err);
    } finally {
        res.redirect(req.headers.referer || "/");
    }

})
router.get('/course/block/:id', async function (req, res) {
    // var newStudentData = await adminModel.deleteStudent(UID);
    var url = req.url.split("/");
    const CoursesID = url[url.length - 1];
    try {
        if (+CoursesID)
            await adminModel.blockCourse(+CoursesID, 1);
    } catch (err) {
        console.log(err);
    } finally {
        res.redirect(req.headers.referer || "/");
    }
    router.post('/category/edit/:id', async function (req, res) {
        var url = req.url.split("/");
        const SubCategoryID = url[url.length - 1];
        const namecate = req.body.namecate;
        const namescate = req.body.namescate;
        try {
            if (+SubCategoryID) {
                await adminModel.editSubCategory(+SubCategoryID, namescate);
                await adminModel.editCategory(1, namecate);
            }
        } catch (err) {
            console.log(err);
        } finally {
            res.redirect('/admin/category');
        }

    })
})
export default router