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
import pro from '../models/process.model';
// import { paginate } from './../config/default.json';
import multer from 'multer';
import Course from '../models/classes/Course';
import Video from '../models/classes/Video';
import CourseSection from '../models/classes/CoursesSection';
import SubCategory from '../models/classes/SubCategory';
import processModel from '../models/process.model';
import Process from '../models/classes/Process';
import Category from '../models/classes/Category';
import subCategoryModel from '../models/subcategory.model';
import videoModel from '../models/video.model';
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

    const course = new Course(-1, req.body['courseName'], "", "", 0, false, "", "", 0, 0, 0);
    const subcategoryID = req.body.subcategoryID;
    const teaID = res.locals.authUser.TeaID;
    course.id = await courseModel.addCourse(course, subcategoryID, teaID);
    res.redirect(`/course/edit/${course.id}`);
})


router.get('/edit/:courseID', async function (req, res, next) {
    const courseID = +req.params['courseID'];
    const detailCourse = await courseModel.single(courseID);
    if (detailCourse !== null && detailCourse.id !== undefined) {
        const [subcategoryID, categoryID] = await courseModel.getCategoryAndSub(detailCourse.id);
        const allSection = await courseModel.getAllSection(courseID);

        for (var i = 0; i < allSection.length; i++) {
            let section = new CourseSection(
                allSection[i].id,
                allSection[i].name,
                0
            );


            let allVideo = await courseModel.getAllVideoSection(allSection[i].id || -1);
            for (var j = 0; j < allVideo?.length; j++) {
                let video = new Video(allVideo[j].id, allVideo[j].name,);
                video.linkVideo = await courseModel.getLinkVideo(courseID, section.id, video.id);
                video.setLink(await courseModel.getLinkVideo(courseID, allSection[i].id || -1, allVideo[j].id));
                section.videos.push(video);
            }
            detailCourse.courseSection.push(section);
        }


        const categories = await categoryModel.all();
        for (var i = 0; i < categories.length; i++) {
            categories[i].subCategories = [];
            //categories[i].iscurrentCategory = ();
            const subcategories = await subcategoryModel.all(categories[i].id);
            subcategories?.forEach((subcategory) => {
                categories[i].subCategories.push(
                    new SubCategory(
                        subcategory.id,
                        subcategory.name
                    )
                )
            })
        }
        console.log(categories[0].subCategories);

        console.log(detailCourse)
        return res.render('vwCourses/edit', {
            Course: detailCourse,
            Categories: categories
        });

    };
})


router.post('/edit/:courseID/addvideo/', async function (req, res, next) {
    const courseID = Number(req.params.courseID);
    const courseSectionID = Number(req.body.CourseSectionID);
    const video = new Video(
        -1,
        req.body.newvideoname
    )

    await courseModel.addVideo(courseID, courseSectionID, video);

    res.redirect("/");
});


router.post('/edit/:courseID/addsection/', async function (req, res, next) {
    const courseSection = new CourseSection(
        -1,
        req.body.newsectionname,
        0
    )
    await courseModel.addSection(Number(req.params.courseID), courseSection);

    res.redirect("/");
});


router.post('/edit/:CourseID/updatevideo/:CourseSectionID/:VideoID', async function (req, res, next) {
    const link = req.body.videolink;
    const courseID = Number(req.params.CourseID);
    const courseSectionID = Number(req.params.CourseSectionID);
    const videoID = Number(req.params.VideoID);

    const video = new Video(
        videoID,
        req.body.videotitle,
        //    req.params.CourseSectionID
    )

    if (courseID != NaN && videoID != NaN) {
        try {
            courseModel.setLinkVideo(courseID, courseSectionID, videoID, link);
            await courseModel.updateVideo(video);
        } catch (error) {
            console.log("Error");
        }
    }


    res.redirect("/");
});

router.post('/edit/:CourseID/basic', async function (req, res, next) {
    // console.log(req.body);
    const courseID = Number(req.params.CourseID);
    if (courseID != NaN) {
        let IsFinished = false;
        if (req.body.IsFinished === 'on') IsFinished = true;
        const course = new Course(
            courseID,
            req.body.CourseName,
            req.body.TinyDes,
            req.body.FullDes,
            parseFloat(req.body.Price) || 0,
            IsFinished,
            "",
            "",
            -1,
            -1,
            -1,
        )
        console.log(course);

        courseModel.updateCourse(course, courseID)
        res.redirect("/");
    }
    // console.log(course);


});

router.post('/edit/:CourseID/uploadImg', upload.single("course"), function (req, res, next) {

    console.log(req.file);
    res.redirect(req.headers.referer || "/");
});

router.get('/', async function (req, res, next) { //chuyển đến trang chứa toàn bộ các courses
    const list = await courseModel.all();
    res.render('vwCourses/index', {
        products: list,
        empty: list.length === 0
    });
})

router.get('/storage', async function (req, res, next) { //chuyển đến trang chứa toàn bộ các courses
    const list = await courseModel.all();
    res.render('vwCourses/paidCourse', {});
})

router.get('/storage/paidCourse', async function (req, res, next) { //chuyển đến trang chứa toàn bộ các courses
    if(req.session.auth  &&req.session.authUser !== undefined){
        const list = await courseModel.getPaidCourse(req.session.authUser.ID, 0);
    
        res.render('vwCourses/paidCourse', {
            course: list
        });
    }else{
        res.redirect("/")
    }
})
router.get('/storage/wishlist', async function (req, res, next) { //chuyển đến trang chứa toàn bộ các courses
    if(req.session.authUser != undefined){
        const list = await courseModel.getAllWish(req.session.authUser.ID);
        res.render('vwCourses/wishlist', {
            course: list
        });
    }
})



router.get('/learn/:CourseID', async function (req, res, next) {      //chuyển đến trang để học
    let process: Process | null = null;
    let curVideo: Video | null = null;
    if (+req.params.CourseID) {
        if (req.session.authUser && req.session.authUser.ID) {
            process = await processModel.getProcess(+req.params.CourseID, req.session.authUser.ID);
            if (process === null) {
                curVideo = await processModel.getFirstVideo(+req.params.CourseID);
            }
        } else {
            curVideo = await processModel.getFirstVideo(+req.params.CourseID);
        }
        res.redirect(`/course/learn/${req.params.CourseID}/${process?.video?.id || curVideo?.id}`);

    } else {
        res.redirect(`/500`);

    }

}),


router.get('/learn/:CourseID/:VideoID', async function (req, res, next) {           //chuyển đến trang để học
    if (+req.params.CourseID != NaN) {
        const detailCourse = await courseModel.single(+req.params.CourseID);
        if (detailCourse != null) {
            // const [categoryID, subcategoryID] = await courseModel.getCategoryAndSub(detailCourse?.id);
            const allSection = await courseModel.getAllSection(+req.params.CourseID);
            detailCourse.courseSection = allSection;
            const teacher = (await courseModel.getTeacher(+req.params.CourseID));
            detailCourse.teacher = teacher;


            detailCourse.courseSection.forEach(async (eachCourseSection: CourseSection) => {
                const videos = await courseModel.getAllVideoSection(eachCourseSection.id);
                eachCourseSection.videos = videos;
            });

            console.log(+req.params.VideoID);
            
            let curVideo = await videoModel.getInProcessVideo(detailCourse.id,+req.params.VideoID,req.session.authUser?.ID);

            console.log(curVideo);
            
            res.render('vwCourses/learn', {
                Course: detailCourse,
                CurVideo: curVideo
            });
        }

    }
})



router.get('/storage/myCourse', async function (req, res, next) { //chuyển đến trang chứa toàn bộ các courses
    if(req.session.authUser &&req.session.authUser.TeaID){
        const list = await courseModel.getAllMyCourse(req.session.authUser.TeaID);
        res.render('vwCourses/mycourse', {
            course: list,
            empty:list.length == 0
        });
    }

})
export default router;