import * as db from '../utils/db';
import Course from './classes/Course';
import SubCategory from './classes/SubCategory';
import Teacher from './classes/Teacher';

const subCategoryModel = {
    async all(categoryID: number): Promise<SubCategory[] | null> {

        const sql = `select * from subcategories where categoryID = ${categoryID}`;
        const [rows, fields] = await db.load(sql);
        let categories: SubCategory[] = [];
        rows.forEach((row) => {
            categories.push(SubCategory.transform(row));
        });
        return categories;

    },
    async createFullText(){
        const sql = 'ALTER TABLE subcategories ADD FULLTEXT(Name);'
        const [rows, fields] = await db.load(sql);
        return;

    },
    async searchFullText(search_sql: string): Promise<SubCategory | null> {
        const sql = `select H.* 
        FROM (SELECT * FROM (SELECT *
        FROM (SELECT *
            FROM (				SELECT * 	
				FROM (SELECT * FROM courses) as CC 	  
				INNER JOIN
				(SELECT TeaID as tID, teaName as namegv FROM teachers) as DD
				ON CC.TeaID = DD.tID) as F
            LEFT JOIN
            (SELECT D.CourseID, ROUND(D.sum/D.count,1) as T, D.count
            FROM (SELECT *
            FROM (SELECT CourseID,Sum(Rating) as sum FROM feedback GROUP BY CourseID) AS A
            INNER JOIN
            (SELECT CourseID as cID,COUNT(Rating) as count FROM feedback GROUP BY CourseID) AS B
            ON A.CourseID = B.cID) as D
            GROUP BY D.CourseID) as E
            ON E.courseID = F.CoursesID) as K) AS I INNER JOIN (SELECT SubCategoryID as caID, subcategories.Name as NameSubcategories FROM subcategories) as J ON I.SubCategoryID = J.caID) AS H
        where
            MATCH (H.Name) 
            AGAINST ('${search_sql}');`
        const [rows, fields] = await db.load(sql);
        console.log(rows[0]);
        return rows.length == 0 ? null : SubCategory.transform(rows[0]);

    },
    async filterByRatting(): Promise<SubCategory | null> {
        const sql = `select H.* 
      FROM (SELECT * FROM (SELECT *
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
          ON E.courseID = F.CoursesID) as K) AS I INNER JOIN (SELECT SubCategoryID as caID, subcategories.Name as NameSubcategories FROM subcategories) as J ON I.SubCategoryID = J.caID) AS H
          ORDER BY T DESC`
        const [rows, fields] = await db.load(sql);
        return rows.length == 0 ? null : SubCategory.transform(rows[0]);

    },
    async single(subCatID: number): Promise<SubCategory | null> {
        const sql = `select Name from subcategories where SubCategoryID = ${subCatID}`;
        const [rows, fields] = await db.load(sql);
        return rows.length == 0 ? null : SubCategory.transform(rows[0]);

    },
    async filterByPrice() {
        const sql = `select *
        from courses join teachers
        on courses.TeaID = teachers.TeaID`
        const [rows, fields] = await db.load(sql);
        const course =  rows.length == 0 ? null : Course.transform(rows[0]);
        if(course != null)
            course.teacher = Teacher.transform(rows[0]);
        return course;
    }
}
export default subCategoryModel;