import * as db from '../utils/db';
import fs from 'fs';
import { patch } from '../utils/db';
import Course from './classes/Course';
import { paginate } from '../config/default'
import Video from './classes/VIdeo';
import Teacher from './classes/Teacher';



const courseModel = {
    async  all():Promise<Course[] | null> {
        const sql = 'select * from courses';
        const [rows, fields] = await db.load(sql);
        let courses: Course[] = [];
        rows.forEach((row) => {
            courses.push(Course.transform(row));
        });
        return courses;
    },

    async countBySubCat(subCatId:number):Promise<number> {
        const sql = `select count(*) as total from courses where SubCategoryID=${subCatId}`;
        const [rows, fields] = await db.load(sql);
        return rows[0]['total'];
    },
    async count1():Promise<number> {
        const sql = `select count(*) as total from courses`;
        const [rows, fields] = await db.load(sql);
        return rows[0]['total'];
    },
    async pageByCat(subCatId:number, offset:number):Promise<Course[]> {
        const sql = `SELECT *
        FROM (SELECT *
            FROM (				SELECT * 	
				FROM (SELECT * FROM courses) as CC 	  
				INNER JOIN
				(SELECT TeaID as tID, name as namegv FROM teachers) as DD
				ON CC.TeaID = DD.tID) as F
            LEFT JOIN
            (SELECT D.CourseID, ROUND(D.sum/D.count,1) as T, D.count
            FROM (SELECT *
            FROM (SELECT CourseID,Sum(Rating) as sum FROM feedback GROUP BY CourseID) AS A
            INNER JOIN
            (SELECT CourseID as cID,COUNT(Rating) as count FROM feedback GROUP BY CourseID) AS B
            ON A.CourseID = B.cID) as D
            GROUP BY D.CourseID) as E
            ON E.courseID = F.CoursesID) as K where SubCategoryID=${subCatId} limit ${paginate.limit} offset ${offset}`;
        const [rows, fields] = await db.load(sql);
        let courses: Course[] = [];
        rows.forEach((row) => {
            courses.push(Course.transform(row));
        });
        return courses;
    },

    async single(courseID:number):Promise<Course | null>{
        const sql = `select * from courses where CoursesID = ${courseID}`;
        const [rows, fields] = await db.load(sql);
        return rows.length == 0 ? null : Course.transform(rows[0]);

    },
    async increAccessNumber(value:number, courseID:number):Promise<void> {
        const sql = `UPDATE courses SET AccessNumber = ${value} WHERE CoursesID = ${courseID}`;
        console.log(sql);
        await db.load(sql);
    },
    async getCategoryAndSub(CourseID:number):Promise<Course | null> {
        const sql = `select subcategories.SubCategoryID,categories.CategoryID from courses join subcategories on courses.SubCategoryID =  subcategories.SubCategoryID 
      join categories on subcategories.CategoryID =  categories.CategoryID where courses.CoursesID = ${CourseID}`;
        const [rows, field] = await db.load(sql);
        return rows.length == 0 ? null : Course.transform(rows[0]);

    },

    async getAllSection(courseID:number):Promise<Course | null> {
        const sql = `select * from coursesection where CourseID = ${courseID}`
        const [rows, fields] = await db.load(sql);
        return rows.length == 0 ? null : Course.transform(rows[0]);
    },

    async getAllVideofSection(CourseSectionID:number):Promise<Course |null> {
        const sql = `select * from video where CourseSectionID = ${CourseSectionID}`
        const [rows, fields] = await db.load(sql);
        return rows.length == 0 ? null : Course.transform(rows[0]);
    },

    //TODO: the fuck
    async getLinkVideo(courseID:number, CourseSectionID:number, VideoID:number):Promise<Buffer | null> {
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

    async addCourse(courseEntity:Course) {
        const [rows, field] = await db.add(courseEntity, 'courses');
        const dir = `video/${rows[0]['insertId']}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        return rows.length == 0 ? null : Course.transform(rows[0]);
    },

    // async addVideo(courseID:number, videoEntity:Video) {
    //     const [result, field] = await db.add(videoEntity, 'video');
    //     fs.writeFile(`video/${courseID}/${videoEntity.CourseSectionID}/${result.insertId}.txt`, '', function(err) {
    //         if (err) throw err;
    //     });
    //     return result;
    // },

    // async addSection(sectionEntity) {
    //     const [result, field] = await db.add(sectionEntity, 'coursesection');
    //     const dir = `video/${sectionEntity.CourseID}/${result.insertId}`;
    //     if (!fs.existsSync(dir)) {
    //         fs.mkdirSync(dir);
    //     }
    //     return result;
    // },

    // async setLinkVideo(courseID:number, CourseSectionID:number, VideoID:number, link:string):Promise<void> {
    //     const path = `video/${courseID}/${CourseSectionID}/${VideoID}.txt`;
    //     fs.writeFile(path, link, function(err) {
    //         if (err) throw err;
    //     });
    // },

    // async updateVideo(videoEntity:Video, VideoID:number):Promise<void> {
    //     const condition = {
    //         VideoID: VideoID
    //     };
    //     const [result, field] = await db.patch(videoEntity, condition, 'video');
    // },

    // async updateCourse(Course:Course, CourseID:number):Promise<void> {
    //     const condition = {
    //         CoursesID: CourseID
    //     }
    //     await db.patch(Course, condition, 'courses');
    // },
    // async updateSection(CourseSection, CourseSectionID) {
    //     const condition = {
    //         CourseSectionID: CourseSectionID
    //     }
    //     await db.patch(CourseSection, condition, 'coursesection');
    // },
    async getNewCourses():Promise<Course[]> {
        const sql = 'SELECT * FROM `courses` ORDER BY DateCreated DESC LIMIT 12';
        const [rows, fields] = await db.load(sql);
        let courses: Course[] = [];
        rows.forEach((row) => {
            courses.push(Course.transform(row));
        });
        return courses;
    },
    async getBestView():Promise<Course[]> {
        const sql = 'SELECT * FROM `courses` ORDER BY AccessNumber DESC LIMIT 12';
        const [rows, fields] = await db.load(sql);
        let courses: Course[] = [];
        rows.forEach((row) => {
            courses.push(Course.transform(row));
        });
        return courses;
    },
    async getHighlightCourse():Promise<Course[]>{
        const sql = 'SELECT * FROM (SELECT * FROM courses WHERE WEEK(courses.DateCreated) = WEEK(CURDATE())) AS A ORDER BY nRegister DESC LIMIT 4';
        const [rows, fields] = await db.load(sql);
        let courses: Course[] = [];
        rows.forEach((row) => {
            courses.push(Course.transform(row));
        });
        return courses;
    },
    async getBestRegisterWeek():Promise<Course[]> {
        //const sql = 'SELECT * FROM (SELECT * FROM courses WHERE WEEK(courses.DateCreated) = WEEK(CURDATE())) AS A ORDER BY nRegister DESC LIMIT 4';
        const sql = 'SELECT SubCategoryID, Name, sum FROM (SELECT * FROM subcategories) AS TBA INNER JOIN (SELECT * FROM (SELECT SubCategoryID as sID, Sum(nRegister) as sum FROM (	SELECT * FROM (SELECT * FROM courses WHERE WEEK(courses.DateCreated) = WEEK(CURDATE())) AS A) AS D GROUP BY SubCategoryID) AS TB1 ORDER BY sum DESC) AS TBB ON TBA.SubCategoryID = TBB.sID ORDER BY sum DESC';
        const [rows, fields] = await db.load(sql);
        let courses: Course[] = [];
        rows.forEach((row) => {
            courses.push(Course.transform(row));
        });
        return courses;
    },
    async getTeacherOfCourse(CourseID:number) {
        const sql = `SELECT TB1.name
        FROM (SELECT * FROM teachers) TB1
                    INNER JOIN
                    (SELECT * FROM courses) TB2
                    ON TB1.TeaID = TB2.TeaID
        WHERE TB2.CoursesID = ${CourseID}`;
        const [rows, fields] = await db.load(sql);
        return rows.length == 0 ? null : Teacher.transform(rows[0]);

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
    // async getCourseRating(CourseID) {
    //     const sql = `SELECT AVG(feedback.Rating) as rating
    //     FROM courses
    //     join feedback on courses.CoursesID = feedback.CourseID
    //     where CoursesID = ${CourseID}`;
    //     const [result, fields] = await db.load(sql);
    //     return result[0].rating;
    // },
    // async getCourseSale(CourseID) {
    //     const sql = `select *
    //     from courses
    //     join coupon on courses.CoursesID = coupon.CourseID
    //     where  courses.CoursesID = ${CourseID}`;
    //     const [result, fields] = await db.load(sql);
    //     if (result.length === 0) return null;
    //     return result[0].Sale;
    // },
    // async addWishList(CourseID, UserID) {
    //     const wishlist = {
    //         UserID: UserID,
    //         CourseID: CourseID
    //     }
    //     const [result, fields] = await db.add(wishlist, 'watchlist');
    //     return result;
    // },
    // async removeWishList(CourseID, UserID) {
    //     const sql = `delete from watchlist where UserID = '${UserID}'  and   CourseID = ${CourseID}`;
    //     const [result, fields] = await db.load(sql);
    //     return result;
    // },
    // async checkWishList(CourseID, UserID) {
    //     const sql = `select * from watchlist where UserID = '${UserID}' and CourseID = ${CourseID}`
    //     const [result, fields] = await db.load(sql)
    //     return result.length > 0;
    // },
    // async checkPaid(CourseID, UserID) {
    //     const sql = `select * from orderdetails join orders on orderdetails.ID = orders.OrderID
    //      where UID = '${UserID}' and CourseID = ${CourseID}`
    //     const [result, fields] = await db.load(sql)
    //     return result.length > 0;
    // },
    // async getInstructionInfro(UID) {
    //     const sql = `SELECT *  FROM teacherinfo  where TeaID = '${UID}'`;
    //     const [rows, fields] = await db.load(sql);
    //     if(rows.length ===0) return null;
    //     return rows[0];
    // },
    // async getTeacher(CourseID) {
    //     const sql = `SELECT *
    //     FROM teachers
    //     join courses on teachers.TeaID = courses.TeaID
    //     where courses.CoursesID = ${CourseID}`;
    //     const [rows, fields] = await db.load(sql);
    //     return rows[0];
    // },
    // async addFeedback(StuID, Content, CourseID, Rating) {
    //     const feedback = {
    //         StuID: StuID,
    //         Content: Content,
    //         CourseID: CourseID,
    //         Rating: +Rating
    //     }
    //     const [result, fields] = await db.add(feedback, 'feedback');
    //     return result[0];
    // },
    // async getAllFeedback(CourseID) {
    //     const sql = `select *
    //     from feedback
    //     join courses on feedback.CourseID = courses.CoursesID 
    //     where courses.CoursesID = ${CourseID}`
    //     const [rows, fields] = await db.load(sql);
    //     return rows;
    // },
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

    async getAllMyCourse(TeaID:number){
        const sql = `select *
        from courses
        join teachers on courses.TeaID = teachers.TeaID
        where teachers.TeaID = ${TeaID}`;
        const [rows,fields] = await db.load(sql);
        let courses: Course[] = [];
        rows.forEach((row) => {
          courses.push(Course.transform(row));
        });
        return courses;
    }
};

export default courseModel;