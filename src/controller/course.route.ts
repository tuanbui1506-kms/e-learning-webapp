import express from 'express'
import categoryModel from '../models/category.model';
import subcategoryModel from '../models/subcategory.model';
import teacherModel from '../models/teacher.model';
const router = express.Router();
import url from 'url';
import courseModel from '../models/course.model';
import * as userModel from '../models/user.model';
import { truncate } from 'fs';
import studentModel from '../models/student.model';
// import processModel from '../models/process.model';
// import { paginate } from './../config/default.json';
import multer from 'multer';
import Course from '../models/classes/Course';
// import { route } from './account.route';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './design/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + req.params.CourseID + ".jpg");
    }
});
const upload = multer({ dest: './design/images', storage: storage });




router.get('/create/1', function (req, res, next) {
    res.render('vwCourses/create_1', {
        layout: false,
    })
})
//Lay quyen student: studentModel.STUDENT_PROPERTIES.permission
//teacher: teacherModel.TEACHER_PROPERTIES.permission
router.post('/create/1', function (req, res, next) {
    res.redirect(url.format({
        pathname: '/course/create/2/',
        query: {
            courseName: req.body.courseName
        }
    }));
})
router.get('/create/2', async function (req, res, next) {
    const courseName = req.query.courseName;
    const allCategories = await categoryModel.all();
    res.render('vwCourses/create_2', {
        layout: false,
        courseName,
        allCategories,
    })
})

router.post('/create/2', function (req, res, next) {
    console.log(req.body);
    res.redirect(url.format({
        pathname: '/course/create/3/',
        query: {
            courseName: req.body.courseName,
            categoryID: req.body.categoryID
        }
    }));
})

router.get('/create/3', async function (req, res, next) {
    const courseName = req.query.courseName as string;
    const categoryID = req.query.categoryID as string || 0;
    const allSubCategories = await subcategoryModel.all(categoryID as number);
    res.render('vwCourses/create_3', {
        layout: false,
        courseName,
        categoryID,
        allSubCategories
    })
})

router.post('/create/3', async function (req, res, next) {

    console.log(res.locals.authUser);
//     const course = new Course (
//         name: req.body.courseName,
//         SubCategoryID: req.body.subcategoryID,
//         TeaID: res.locals.authUser.TeaID
//     )
//     const result = await courseModel.addCourse(course);
//     // console.log(result);
//     res.redirect(`/course/edit/${result.insertId}`);
})


// router.get('/edit/:courseID', async function (req, res, next) {
//     const detailcourse = await courseModel.single(req.params.courseID);
//     const cateandsub = await courseModel.getCategoryAndSub(detailcourse.CoursesID);
//     const allSection = await courseModel.getAllSection(req.params.courseID);
//     const course = {
//         CategoryID: cateandsub.CategoryID,
//         SubCategoriesID: cateandsub.SubCategoryID,
//         courseName: detailcourse.Name,
//         courseID: detailcourse.CoursesID,
//         tinyDes: detailcourse.TinyDes,
//         fullDes: detailcourse.FullDes,
//         Price: detailcourse.Price,
//         IsFinished: detailcourse.IsFinished === 1,
//         LastUpdate: detailcourse.LastUpdate,
//         allSection: []
//     }
//     for (var i = 0; i < allSection.length; i++) {
//         let section = {
//             CourseSectionID: allSection[i].CourseSectionID,
//             courseID: detailcourse.CoursesID,
//             Name: allSection[i].Name,
//             allVideo: []
//         };
//         let allVideo = await courseModel.getAllVideofSection(allSection[i].CourseSectionID);
//         for (var j = 0; j < allVideo.length; j++) {
//             let video = {
//                 link: await courseModel.getLinkVideo(req.params.courseID, allSection[i].CourseSectionID, allVideo[j].VideoId),
//                 videoname: allVideo[j].Name,
//                 videoid: allVideo[j].VideoId,
//                 courseID: detailcourse.CoursesID,
//                 CourseSectionID: allSection[i].CourseSectionID,
//             }

//             section.allVideo.push(video);
//         }
//         course.allSection.push(section);
//     }


//     const categories = await categoryModel.all();
//     for (var i = 0; i < categories.length; i++) {
//         categories[i].subcategories = [];
//         categories[i].iscurrentCategory = (categories.CategoryID === course.CategoryID);
//         const subcategories = await subcategoryModel.all(categories[i].CategoryID);
//         for (var subcategory of subcategories) {
//             categories[i].subcategories.push({
//                 subcategory: subcategory,
//                 isCurrentSubcategory: subcategory.SubCategoryID === course.SubCategoriesID
//             });
//         }
//     }
//     // console.log(course)
//     return res.render('vwCourses/edit', {
//         Course: course,
//         Categories: categories
//     });
// })


// router.post('/edit/:courseID/addvideo/', async function (req, res, next) {
//     const courseID = req.params.courseID
//     const video = {
//         CourseSectionID: req.body.CourseSectionID,
//         Name: req.body.newvideoname
//     }
//     await courseModel.addVideo(courseID, video);

//     res.redirect(req.headers.referer);
// });


// router.post('/edit/:courseID/addsection/', async function (req, res, next) {
//     const coursesection = {
//         CourseID: req.params.courseID,
//         Name: req.body.newsectionname
//     }
//     await courseModel.addSection(coursesection);

//     res.redirect(req.headers.referer);
// });


// router.post('/edit/:CourseID/updatevideo/:CourseSectionID/:VideoID', async function (req, res, next) {
//     const video = {
//         Name: req.body.videotitle,
//         CourseSectionID: req.params.CourseSectionID
//     }
//     const link = req.body.videolink;

//     courseModel.setLinkVideo(req.params.CourseID, req.params.CourseSectionID, req.params.VideoID, link);

//     await courseModel.updateVideo(video, req.params.VideoID);

//     res.redirect(req.headers.referer);
// });

// router.post('/edit/:CourseID/basic', async function (req, res, next) {
//     // console.log(req.body);
//     const CourseID = req.params.CourseID;
//     let IsFinished = 0;
//     if (req.body.IsFinished === 'on') IsFinished = 1
//     const course = {
//         Name: req.body.CourseName,
//         SubCategoryID: req.body.SubCategoryID,
//         TinyDes: req.body.TinyDes,
//         FullDes: req.body.FullDes,
//         Price: parseFloat(req.body.Price),
//         IsFinished: IsFinished,
//     }
//     // console.log(course);

//     courseModel.updateCourse(course, CourseID)
//     res.redirect(req.headers.referer);
// });

// router.post('/edit/:CourseID/uploadImg', upload.single("course"), function (req, res, next) {

//     console.log(req.file);
//     res.redirect(req.headers.referer);
// });

// router.get('/', async function (req, res, next) { //chuyển đến trang chứa toàn bộ các courses
//     const list = await courseModel.all();
//     res.render('vwCourses/index', {
//         products: list,
//         empty: list.length === 0
//     });
// })

// router.get('/storage', async function (req, res, next) { //chuyển đến trang chứa toàn bộ các courses
//     const list = await courseModel.all();
//     res.render('vwCourses/paidCourse', {});
// })

// router.get('/storage/paidCourse', async function (req, res, next) { //chuyển đến trang chứa toàn bộ các courses
//     if(req.session.auth === false){
//         return res.redirect("/")
//     }
//     const list = await courseModel.getPaidCourse(req.session.authUser.ID, 0);

//     res.render('vwCourses/paidCourse', {
//         course: list
//     });
// })
// router.get('/storage/wishlist', async function (req, res, next) { //chuyển đến trang chứa toàn bộ các courses
//     const list = await courseModel.getAllWish(req.session.authUser.ID);
//     res.render('vwCourses/wishlist', {
//         course: list
//     });
// })



// router.get('/learn/:CourseID', async function (req, res, next) {      //chuyển đến trang để học
//     let curVideoID;
//     if (req.session.authUser !== null) {
//         curVideoID = await processModel.getProcess(req.params.CourseID, req.session.authUser.ID);
//         if (curVideoID === null) {
//             curVideoID = await processModel.getFirstVideo(req.params.CourseID);
//         }
//     }
//     else {
//         curVideoID = await processModel.getFirstVideo(req.params.CourseID);
//     }
//     res.redirect(`/course/learn/${req.params.CourseID}/${curVideoID}`);
// })


// router.get('/learn/:CourseID/:VideoID', async function (req, res, next) {           //chuyển đến trang để học
//     const detailcourse = await courseModel.single(req.params.CourseID);
//     const cateandsub = await courseModel.getCategoryAndSub(detailcourse.CoursesID);
//     const allSection = await courseModel.getAllSection(req.params.CourseID);

//     const categoryname = await courseModel.getCategeryName(cateandsub.CategoryID)
//     const subcategoryname = await courseModel.getSubCategeryName(cateandsub.SubCategoryID)
//     const teacher = (await courseModel.getTeacher(req.params.CourseID));

//     let curVideoLink = "";
//     const course = {
//         CategoryID: cateandsub.CategoryID,
//         Categoryname: categoryname,
//         SubCategoriesID: cateandsub.SubCategoryID,
//         Subcategoryname: subcategoryname,
//         courseName: detailcourse.Name,
//         courseID: detailcourse.CoursesID,
//         tinyDes: detailcourse.TinyDes,
//         fullDes: detailcourse.FullDes,
//         Price: detailcourse.Price,
//         IsFinished: detailcourse.IsFinished === 1,
//         LastUpdate: detailcourse.LastUpdate.toString(),
//         teacher: teacher,
//         teacherName: teacher.name,
//         allSection: []
//     }
//     // save to proces
//     const CurVideoId = req.params.VideoID;
//     if (req.session.auth !== false) {
//         let process = await processModel.getProcess(course.courseID, req.session.authUser.ID);
//         if (process === null) {
//             process = {
//                 UserID: req.session.authUser.ID,
//                 CourseID: course.courseID,
//                 VideoID: CurVideoId,
//             }
//             processModel.addProcess(process);
//         }
//         else {
//             processModel.saveProcess(process, CurVideoId);
//         }

//     }

//     // console.log(process)

//     for (var i = 0; i < allSection.length; i++) {
//         let section = {
//             CourseSectionID: allSection[i].CourseSectionID,
//             courseID: detailcourse.CoursesID,
//             Name: allSection[i].Name,
//             allVideo: []
//         };
//         let allVideo = await courseModel.getAllVideofSection(allSection[i].CourseSectionID);
//         for (var j = 0; j < allVideo.length; j++) {
//             let video = {
//                 link: await courseModel.getLinkVideo(req.params.CourseID, allSection[i].CourseSectionID, allVideo[j].VideoId),
//                 videoIndex: j + 1,
//                 videoname: allVideo[j].Name,
//                 videoid: allVideo[j].VideoId,
//                 courseID: detailcourse.CoursesID,
//                 CourseSectionID: allSection[i].CourseSectionID,
//             }

//             if (video.videoid == req.params.VideoID) {
//                 curVideoLink = video.link;
//             }
//             section.allVideo.push(video);
//         }
//         course.allSection.push(section);
//     }



//     res.render('vwCourses/learn', {
//         Course: course,
//         CurVideo: curVideoLink
//     });
// })

// router.get('/storage/myCourse', async function (req, res, next) { //chuyển đến trang chứa toàn bộ các courses
//     const list = await courseModel.getAllMyCourse(req.session.authUser.TeaID);
//     res.render('vwCourses/mycourse', {
//         course: list
//     });
// })
export default router;