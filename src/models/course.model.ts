import * as db from '../utils/db';
import fs from 'fs';
import { patch } from '../utils/db';
import Course from './classes/Course';
import { paginate } from '../config/default'
import Video from './classes/Video';
import Teacher from './classes/Teacher';
import CourseSection from './classes/CoursesSection';
import User from './classes/User';
import Feedback from './classes/Feedback';
import studentModel from './student.model';



const courseModel = {
    async all(): Promise<Course[]> {
        const sql = 'select * from courses';
        const [rows, fields] = await db.load(sql);
        let courses: Course[] = [];
        rows.forEach((row) => {
            courses.push(Course.transform(row));
        });
        return courses;
    },

    async countBySubCat(subCatId: number): Promise<number> {
        const sql = `select count(*) as total from courses where SubCategoryID=${subCatId}`;
        const [rows, fields] = await db.load(sql);
        return rows[0]['total'];
    },
    async count1(): Promise<number> {
        const sql = `select count(*) as total from courses`;
        const [rows, fields] = await db.load(sql);
        return rows[0]['total'];
    },
    async pageByCat(subCatId: number, offset: number): Promise<Course[]> {
        const sql = `select courses.CoursesID, 
        courses.Name,
        courses.TinyDes, 
        courses.FullDes,
        courses.Price,
        courses.IsFinished,
        courses.LastUpdate, 
        courses.DateCreated,
        courses.AccessNumber, 
        courses.nRegister,
        courses.sale
        from courses  join subcategories 
        on  courses.SubCategoryID = subcategories.SubCategoryID
        and subcategories.SubCategoryID=${subCatId} limit ${paginate.limit} offset ${offset}`;
        const [rows, fields] = await db.load(sql);
        let courses: Course[] = [];
        rows.forEach((row) => {
            courses.push(Course.transform(row));
        });
        return courses;
    },

    async single(courseID: number): Promise<Course | null> {
        const sql = `select * from courses where CoursesID = ${courseID}`;
        const [rows, fields] = await db.load(sql);
        return rows.length == 0 ? null : Course.transform(rows[0]);

    },
    async increAccessNumber(value: number, courseID: number): Promise<void> {
        const sql = `UPDATE courses SET AccessNumber = ${value} WHERE CoursesID = ${courseID}`;
        console.log(sql);
        await db.load(sql);
    },
    async getCategoryAndSub(CourseID: number): Promise<[number, number]> {
        const sql = `select subcategories.SubCategoryID,categories.CategoryID from courses join subcategories on courses.SubCategoryID =  subcategories.SubCategoryID 
      join categories on subcategories.CategoryID =  categories.CategoryID where courses.CoursesID = ${CourseID}`;
        const [rows, field] = await db.load(sql);
        return [+rows[0]['SubCategoryID'], +rows[0]['CategoryID']];
    },

    async getAllSection(courseID: number): Promise<CourseSection[]> {
        const sql = `select * from coursesection where CourseID = ${courseID}`
        const [rows, fields] = await db.load(sql);
        let courseSection: CourseSection[] = [];
        rows.forEach((row) => {
            courseSection.push(CourseSection.transform(row));
        });
        return courseSection;
    },

    async getAllVideoSection(CourseSectionID: number): Promise<Video[]> {
        if (CourseSectionID <= 0) return [];
        const sql = `select * from video where CourseSectionID = ${CourseSectionID}`
        const [rows, fields] = await db.load(sql);
        let videos: Video[] = [];
        rows.forEach((row) => {
            videos.push(Video.transform(row));
        });
        return videos;
    },

    //TODO: the fuck
    async getLinkVideo(courseID: number, CourseSectionID: number, VideoID: number): Promise<Buffer | null> {
        const path = `video/${courseID}/${CourseSectionID}/${VideoID}.txt`;
        try {
            if (fs.existsSync(path)) {
                //file exists
                const link = fs.readFileSync(path)
                return link;
            }
        } catch (err) {
            console.error(err)
        }
        return null;
    },

    async addCourse(course: Course, subcategoryID: number, teaID: number): Promise<number> {
        const courseEntity = {
            Name: course.name,
            TinyDes: course.tinyDes,
            FullDes: course.fullDes,
            Price: course.price,
            IsFinished: course.isFinished,
            TeaID: teaID,
            SubCategoryID: subcategoryID,
            AccessNumber: course.accessNum,
            nRegister: course.nRegister,
            Sale: course.sale

        }
        const [rows, field] = await db.add1(courseEntity, 'courses');

        return rows.insertId;
    },

    async addVideo(courseID: number, courseSectionID: number, video: Video) {
        const videoEntity = {
            VideoId: null,
            CourseSectionID: courseSectionID,
            Name: video.name
        }
        try {
            const [result, field] = await db.add1(videoEntity, 'video');

            fs.appendFile(`video/${courseID}/${videoEntity.CourseSectionID}/${result.insertId}.txt`, '', function (err) {
                if (err) throw err;
            });
            return result;
        } catch (error) {

            console.log(error);

        }
    },

    async addSection(courseID: number, courseSection: CourseSection) {
        const courseSectionEntity = {

            CourseID: courseID,
            Name: courseSection.name,
            IsPreview: courseSection.isPreview
        }
        console.log(courseSectionEntity);

        const [result, field] = await db.add1(courseSectionEntity, 'coursesection');
        const dir = `video/${courseID}/${result.insertId}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        return result;
    },

    async setLinkVideo(courseID: number, CourseSectionID: number, VideoID: number, link: string): Promise<void> {
        const path = `video/${courseID}/${CourseSectionID}/${VideoID}.txt`;
        fs.writeFile(path, link, function (err) {
            if (err) throw err;
        });
    },

    async updateVideo(video: Video): Promise<void> {
        const videoEntity = {
            Name: video.name
        }
        const condition = {
            VideoID: video.id
        };
        const [result, field] = await db.patch(videoEntity, condition, 'video');
    },

    async updateCourse(course: Course, CourseID: number): Promise<void> {
        const courseEntity = {
            Name: course.name,
            TinyDes: course.tinyDes,
            FullDes: course.fullDes,
            Price: course.price,
            IsFinished: course.isFinished,
        }
        const condition = {
            CoursesID: CourseID
        }
        await db.patch(courseEntity, condition, 'courses');
    },
    // async updateSection(CourseSection, CourseSectionID) {
    //     const condition = {
    //         CourseSectionID: CourseSectionID
    //     }
    //     await db.patch(CourseSection, condition, 'coursesection');
    // },
    async getNewCourses(): Promise<Course[]> {
        const sql = 'SELECT * FROM `courses` ORDER BY DateCreated DESC LIMIT 12';
        const [rows, fields] = await db.load(sql);
        let courses: Course[] = [];
        rows.forEach((row) => {
            courses.push(Course.transform(row));
        });
        return courses;
    },
    async getBestView(): Promise<Course[]> {
        const sql = 'SELECT * FROM `courses` ORDER BY AccessNumber DESC LIMIT 12';
        const [rows, fields] = await db.load(sql);
        let courses: Course[] = [];
        rows.forEach((row) => {
            courses.push(Course.transform(row));
        });
        return courses;
    },
    async getHighlightCourse(): Promise<Course[]> {
        const sql = 'SELECT * FROM (SELECT * FROM courses WHERE WEEK(courses.DateCreated) = WEEK(CURDATE())) AS A ORDER BY nRegister DESC LIMIT 4';
        const [rows, fields] = await db.load(sql);
        let courses: Course[] = [];
        rows.forEach((row) => {
            courses.push(Course.transform(row));
        });
        return courses;
    },
    async getBestRegisterWeek(): Promise<Course[]> {
        //const sql = 'SELECT * FROM (SELECT * FROM courses WHERE WEEK(courses.DateCreated) = WEEK(CURDATE())) AS A ORDER BY nRegister DESC LIMIT 4';
        const sql = 'SELECT SubCategoryID, Name, sum FROM (SELECT * FROM subcategories) AS TBA INNER JOIN (SELECT * FROM (SELECT SubCategoryID as sID, Sum(nRegister) as sum FROM (	SELECT * FROM (SELECT * FROM courses WHERE WEEK(courses.DateCreated) = WEEK(CURDATE())) AS A) AS D GROUP BY SubCategoryID) AS TB1 ORDER BY sum DESC) AS TBB ON TBA.SubCategoryID = TBB.sID ORDER BY sum DESC';
        const [rows, fields] = await db.load(sql);
        let courses: Course[] = [];
        rows.forEach((row) => {
            courses.push(Course.transform(row));
        });
        return courses;
    },
    async getTeacherOfCourse(course: Course) {
        const sql = `select teachers.TeaID, teachers.teaName,teachers.dob, teachers.email, teachers.gender, teachers.UID
        from courses left join teachers on courses.TeaID = teachers.TeaID
        where courses.CoursesID = ${course.id}`;
        const [rows, fields] = await db.load(sql);
        course.teacher = rows.length == 0 ? undefined : Teacher.transform(rows[0]);

    },
    // async createFullText() {
    //     const sql = 'ALTER TABLE courses ADD FULLTEXT(Name);'
    //     const [rows, fields] = await db.load(sql);
    //     return;
    // },
    // async searchFullText(search_sql) {
    //     const sql = `select courses.* 
    //     FROM courses left join subcategories ON courses.SubCategoryID = subcategories.SubCategoryID
    //     where
    //         MATCH (courses.Name) 
    //         AGAINST ('${search_sql}');`
    //     const [rows, fields] = await db.load(sql);
    //     return rows;
    // },
    // getNumberOfList(ListCourse) {
    //     let n = 0;
    //     for (const item of ListCourse) {
    //         n += 1;
    //     }
    //     return n;
    // },

    // async getCategeryName(CategoryID) {
    //     const sql = `select Name from categories where CategoryID = ${CategoryID}`
    //     const [result, fields] = await db.load(sql);
    //     return result[0].Name;
    // },
    // async getSubCategeryName(SubCategoryID) {
    //     const sql = `select Name from subcategories where SubCategoryID = ${SubCategoryID}`
    //     const [result, fields] = await db.load(sql);
    //     return result[0].Name;
    // },
    // async getPaidCourse(UserID, offset) {
    //     const sql = `select *
    //     from users join orders on orders.UID = users.UID
    //     join orderdetails on orders.OrderID = orderdetails.OrderID
    //     join courses on courses.CoursesID = orderdetails.CoursesID
    //     where users.UID = '${UserID}'`;
    //     const [result, fields] = await db.load(sql);
    //     return result;
    // },
    // async getCourseFeedback(CourseID) {
    //     const sql = `select *
    //     from courses
    //     join feedback on  feedback.CourseID = courses.CoursesID
    //     where courses.CoursesID = '${CourseID}'`;
    //     const [result, fields] = await db.load(sql);
    //     return result;
    // },
    async getCourseRating(courseID: number) {
        const sql = `SELECT AVG(feedback.Rating) as rating
        FROM courses
        join feedback on courses.CoursesID = feedback.CourseID
        where CoursesID = ${courseID}`;
        const [result, fields] = await db.load(sql);
        return Number(result[0].rating);
    },
    // async getCourseSale(CourseID) {
    //     const sql = `select *
    //     from courses
    //     join coupon on courses.CoursesID = coupon.CourseID
    //     where  courses.CoursesID = ${CourseID}`;
    //     const [result, fields] = await db.load(sql);
    //     if (result.length === 0) return null;
    //     return result[0].Sale;
    // },
    async addWishList(courseID: number, userID: string) {
        const wishlist = {
            UserID: userID,
            CourseID: courseID
        }
        const [result, fields] = await db.add(wishlist, 'watchlist');
        return result[0];
    },
    async removeWishList(courseID: number, UserID: string) {
        const sql = `delete from watchlist where UserID = '${UserID}'  and   CourseID = ${courseID}`;
        const [result, fields] = await db.load(sql);
        return result[0];
    },
    async checkWishList(CourseID: number, UserID: string) {
        const sql = `select * from watchlist where UserID = '${UserID}' and CourseID = ${CourseID}`
        const [result, fields] = await db.load(sql)
        return result.length > 0;
    },
    async checkPaid(CourseID: number, UserID: string) {
        const sql = `select * from orderdetails join orders on orderdetails.ID = orders.OrderID
         where UID = '${UserID}' and CoursesID = ${CourseID}`
        const [result, fields] = await db.load(sql)
        return result.length > 0;
    },
    async getTeacherInfo(UID: string) {
        const sql = `SELECT *  FROM teacherinfo  where TeaID = '${UID}'`;
        const [rows, fields] = await db.load(sql);
        if (rows.length === 0) return null;
        return String(rows[0]["Info"]);
    },
    async getTeacher(CourseID: number) {
        const sql = `SELECT *
        FROM teachers
        join courses on teachers.TeaID = courses.TeaID
        where courses.CoursesID = ${CourseID}`;
        const [rows, fields] = await db.load(sql);
        return rows.length == 0 ? undefined : Teacher.transform(rows[0]);
    },
    async addFeedback(feedback: Feedback, courseID: number, stuID: number) {
        const feedbackEntity = {
            StuID: stuID,
            CourseID: courseID,
            Content: feedback.content,
            Rating: feedback.rating
        }
        const [result, fields] = await db.add(feedbackEntity, 'feedback');
        return result[0];
    },
    async getAllFeedback(CourseID: number) {
        const sql = `select *
        from feedback
        join courses on feedback.CourseID = courses.CoursesID 
        where courses.CoursesID = ${CourseID}`
        const [rows, fields] = await db.load(sql);
        let feedbacks: Feedback[] = [];

        rows.forEach(async (row, index) => {
            feedbacks.push(Feedback.transform(row));
            feedbacks[index].student = await studentModel.single(row['StuID']);
        });
        return feedbacks;
    },
    // async checkPaid(CourseID, UserID) {
    //     const sql = `select * from orderdetails join orders on orderdetails.ID = orders.OrderID
    //      where UID = '${UserID}' and orderdetails.CoursesID = ${CourseID}`
    //     const [result, fields] = await db.load(sql)
    //     return result.length > 0;
    // },

    // async getAllWish(userID){
    //     const sql = `SELECT * FROM watchlist join courses on watchlist.CourseID = courses.CoursesID 
    //     join users on users.UID = watchlist.UserID
    //     where users.UID = '${userID}'`;
    //     const [rows, fields] = await db.load(sql);
    //     return rows;
    // },

    async getAllMyCourse(TeaID: number) {
        const sql = `select *
        from courses
        join teachers on courses.TeaID = teachers.TeaID
        where teachers.TeaID = ${TeaID}`;
        const [rows, fields] = await db.load(sql);
        let courses: Course[] = [];
        rows.forEach((row) => {
            const course = Course.transform(row);
            course.teacher = Teacher.transform(row);
            courses.push(course);
            
        });
        return courses;
    },
    async getRating() {
        let courseRating: {
            [CourseID: number]: number
        } = {};
        const sql = `select courses.CoursesID, sum(Rating)/count(feedback.CourseID) as rating
        from courses left join feedback on courses.CoursesID = feedback.CourseID
        group by courses.CoursesID`
        const [rows, fields] = await db.load(sql);
        rows.forEach((row) => {
            courseRating[Number(row["CoursesID"])] = (row["rating"] != null ? Math.round(row["rating"] * 10) / 10 : 0);
        });
        return courseRating;
    },

    async searchFullText(search_sql: string) {
        const sql = `select * 
        FROM courses left join teachers 
        on courses.TeaID = teachers.TeaID
        where
            MATCH (courses.Name) 
            AGAINST ('${search_sql}');`
        const [rows, fields] = await db.load(sql);
        let courses: Course[] = [];
        rows.forEach((row) => {
            const course = Course.transform(row);
            course.teacher = Teacher.transform(row);
            courses.push(course);
        });
        return courses;
    },
    async createFullText() {
        const sql = 'ALTER TABLE courses ADD FULLTEXT(Name);'
        const [rows, fields] = await db.load(sql);
        return;
    },
    async getAllWish(userID:string){
        const sql = `SELECT * FROM watchlist join courses on watchlist.CourseID = courses.CoursesID 
        join users on users.UID = watchlist.UserID
        where users.UID = '${userID}'`;
        const [rows, fields] = await db.load(sql);
        return rows;
    },
    async getPaidCourse(UserID:string, offset:number) {
        const sql = `select courses.*,teachers.*
        from users join orders on orders.UID = users.UID
        join orderdetails on orders.OrderID = orderdetails.OrderID
        join courses on courses.CoursesID = orderdetails.CoursesID
        join teachers on teachers.TeaID  = courses.TeaID
        where users.UID = '${UserID}'`;
        const [rows, fields] = await db.load(sql);
        let courses: Course[] = [];
        rows.forEach((row) => {
            const course = Course.transform(row);
            course.teacher = Teacher.transform(row);
            courses.push(course);
        });
        return courses;
    },
};

export default courseModel;