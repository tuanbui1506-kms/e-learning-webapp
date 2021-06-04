import express from 'express';
//import cartModel from '../models/cart.model';
import categoryModel from '../models/category.model';
import courseModel from '../models/course.model';
import studentModel from '../models/student.model';
import subcategoryModel from '../models/subcategory.model';
//import processModel from '../models/process.model';
import * as db from '../utils/db';
import { paginate } from '../config/default';
import subCategoryModel from '../models/subcategory.model';
import Course from '../models/classes/Course';
import CourseSection from '../models/classes/CoursesSection';
import Feedback from '../models/classes/Feedback';

const router = express.Router();


router.get('/bySubCat/:id', async function (req, res, next) { //dành cho khách
    const subCatId = +req.params.id;

    //pagination
    let page: number = Number(req.query.page) || 1; //lấy giá trị page require
    if (page < 1)
        page = 1;

    const total = await courseModel.countBySubCat(subCatId); //lấy số lg course
    let nPages = Math.floor(total / paginate.limit);
    if (total % paginate.limit > 0) nPages++;
    const page_numbers = []; //chứa những page có thể có
    for (let i = 1; i <= nPages; i++) {
        page_numbers.push({ //mỗi tp trong bảng có giá trị từng trang: value, isCurrentPage
            value: i,
            isCurrentPage: i === +page
        });
    }
    //console.log(page_numbers);
    const offset = (page - 1) * paginate.limit;
    var courses = await courseModel.pageByCat(subCatId, offset); //lấy course theo subCatID, offset
    let subCatName = await subCategoryModel.single(subCatId);
    let courseRating = await courseModel.getRating();
    courses.forEach((course) => {
        courseModel.getTeacherOfCourse(course);
    })
    console.log(courseRating);

    res.render('vwCourse-fe/byCat', {
        course: courses,
        courseRating,
        page_numbers,
        empty: courses.length === 0,
        subCatName: subCatName?.name
    });
})

router.get('/detail/:CourseID', async function (req, res) { //trang chứa detail của từng course
    const courseID = Number(req.params.CourseID);
    if (courseID !== NaN) {
        let detailCourse: Course | null;
        detailCourse = await courseModel.single(courseID);
        if (detailCourse != null) {
            const cateAndSub = await courseModel.getCategoryAndSub(detailCourse.id);
            const allSection = await courseModel.getAllSection(courseID);
            const rating = await courseModel.getCourseRating(courseID) || 2;
            const teacher = (await courseModel.getTeacher(courseID));
            detailCourse.teacher = teacher;
            if (teacher == null || teacher.UID === undefined) {
                res.redirect("/500");
                return;
            }
            let instructionInfo = (await courseModel.getTeacherInfo(teacher.UID));

            let isTeacherOfCourse = false;
            let wishlisted = false;
            let isPaid = null;
            //check if logged 
            if (req.session !== undefined && req.session.authUser !== undefined) {
                // check if is a student
                if (req.session.authUser.ID !== undefined) {
                    wishlisted = await courseModel.checkWishList(courseID, req.session.authUser.ID);
                    isPaid = await courseModel.checkPaid(courseID, req.session.authUser.ID);
                    console.log("CourseID" + courseID);
                    console.log("user" + req.session.authUser.ID);
                    console.log("IsPaid:" + isPaid);
                    
                } else {
                    isTeacherOfCourse = (req.session.authUser.ID === teacher.UID);
                }
            }

            const feedbacks = await courseModel.getAllFeedback(courseID);
            for (var i = 0; i < allSection.length; i++) {
                if (allSection[i].id !== undefined) {
                    let allVideo = await courseModel.getAllVideoSection(allSection[i].id);
                    allSection[i].videos = allVideo

                }
                detailCourse.courseSection.push(allSection[i]);
            }



            let isStudent = false;
            if (req.session.auth === true && req.session.authUser) {
                isStudent = (req.session.authUser.permission === studentModel.STUDENT_PROPERTIES.permission);
            }
            return res.render('vwCourse-fe/detail', {
                Course: detailCourse,
                isAuth: req.session.auth,
                feedbacks: feedbacks,
                isPaid: isPaid,
                isStudent: isStudent,
                isTeacherOfCourse: isTeacherOfCourse,
                wishlisted:wishlisted,
                instructionInfo: instructionInfo
            });
        }


    }

})

router.post("/detail/:CourseID/addwishlist", async function (req, res) {
    const CourseID = Number(req.params.CourseID);
    const UserID = req.session.authUser?.ID
    if (CourseID != NaN && UserID !== undefined) {
        console.log(CourseID, UserID);
        courseModel.addWishList(CourseID, UserID);
        res.redirect(`/courses/detail/${CourseID}`);
        return;
    }
    res.redirect('/500');
    return;
})

router.post("/detail/:CourseID/unwishlist", async function (req, res) {
    const CourseID = Number(req.params.CourseID);
    const UserID = req.session.authUser?.ID;
    if (CourseID != NaN && UserID != undefined) {
        courseModel.removeWishList(CourseID, UserID);
        res.redirect(`/courses/detail/${CourseID}`);
        return;
    }
    res.redirect('/500');
    return;
})

router.post("/detail/:CourseID/addfeedback", async function (req, res) {

    if (req.session.auth && req.session.authUser) {
        const stuID = Number(req.session.authUser.StuID);
        const courseID = Number(req.params.CourseID);

        if (stuID != NaN && courseID != NaN) {
            const content = req.body.feedback;
            const rating = +req.body.rate;
            const feedback = new Feedback(
                -1,
                content,
                rating
            )
            courseModel.addFeedback(feedback, courseID, stuID)
            console.log("Added successfully")
            res.redirect(`/courses/detail/${courseID}`);
        }

    }
})

export default router;