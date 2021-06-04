import { load } from '../utils/db';
export const ADMIN_PROPERTIES = {
    table_name: "admin",
    permission: 3,
    pk: "AdminID"
};


export async function all() {
    const sql = 'select * from admin';
    const [rows, fields] = await load(sql);
    return rows;
};
export async function getStudent() {
    const sql = `select * 
        from users  join students on users.UID = students.UID`
    const [rows, fields] = await load(sql);
    return rows;
};
export async function getTeacher() {
    const sql = `select * 
        from users  join teachers on users.UID = teachers.UID`
    const [rows, fields] = await load(sql);
    return rows;
};

export async function getCourse() {
    const sql = `SELECT *
        FROM (SELECT * 
        FROM (SELECT * FROM courses) as A
        INNER JOIN
        (SELECT SubCategoryID as SubID, Name as NameCategory FROM subcategories) as B
        ON A.SubCategoryID = B.SubID
        ) as C
        INNER JOIN
        (SELECT TeaID as TID, name as namegv FROM teachers) as D
        ON C.TeaID = D.TID`;
    const [rows, fields] = await load(sql);
    return rows;
};
export async function getSectionCourse(CourseID: number) {
    const sql = `SELECT * FROM coursesection WHERE CourseID = '${CourseID}'`;
    const [rows, fields] = await load(sql);
    return rows;
};
export async function delStudentInStudent(UID: string) {
    const sql = `DELETE FROM students WHERE UID = '${UID}'`
    const [result, fields] = await load(sql);
    return result;
};
export async function delStudentInUsers(UID: string) {
    const sql = `DELETE FROM users WHERE UID = '${UID}'`
    const [result, fields] = await load(sql);
    return result;
};
export async function blockStudent(UID: string, block: number) {
    const sql = `UPDATE users
        SET block = ${block}
        WHERE UID = '${UID}'`;
    const [result, fields] = await load(sql);
    return result;
};
export async function editStudent(UID: string, name: string, DOB: string, Gender: number) {
    const sql = `UPDATE students
        SET name = '${name}', dob = '${DOB}', gender = '${Gender}'
        WHERE UID = '${UID}'`;
    const [result, fields] = await load(sql);
    return result;
};
export async function delTeacherInTeacher(UID: string) {
    const sql = `DELETE FROM teachers WHERE UID = '${UID}'`
    const [result, fields] = await load(sql);
    return result;
};
export async function delTeacherInUsers(UID: string) {
    const sql = `DELETE FROM users WHERE UID = '${UID}'`
    const [result, fields] = await load(sql);
    return result;
};
export async function editTeacher(UID: string, name: string, DOB: string, Gender: number) {
    const sql = `UPDATE teachers
        SET name = '${name}', dob = '${DOB}', gender = '${Gender}'
        WHERE UID = '${UID}'`;
    const [result, fields] = await load(sql);
    return result;
};
export async function blockTeacher(UID: string, block: number) {
    const sql = `UPDATE users
        SET block = ${block}
        WHERE UID = '${UID}'`;
    const [result, fields] = await load(sql);
    return result;
};
export async function delCourseInSection(CoursesID: number) {
    const sql = `DELETE FROM coursesection WHERE CourseID = '${CoursesID}'`
    const [result, fields] = await load(sql);
    return result;
};
export async function delCourseInCourse(CoursesID: number) {
    const sql = `DELETE FROM courses WHERE CoursesID = '${CoursesID}'`
    const [result, fields] = await load(sql);
    return result;
};
export async function blockCourse(CoursesID: number, block: number) {
    const sql = `UPDATE courses
        SET block = ${block}
        WHERE CoursesID = '${CoursesID}'`;
    const [result, fields] = await load(sql);
    return result;
};
export async function getCategory() {
    const sql = `SELECT * 
        FROM (SELECT SubCategoryID, Name, CategoryID, COUNT(CoursesID) as CountCourse, ROUND(SUM(Price), 2) as Price, COUNT(IsFinished) as finish, SUM(AccessNumber) as Access, SUM(nRegister) as register
        FROM (SELECT *
        FROM (SELECT * FROM subcategories) as A
        INNER JOIN
        (SELECT CoursesID, Price, IsFinished, SubCategoryID as SID, AccessNumber, nRegister FROM courses) as B
        ON A.SubCategoryID = B.SID) as D
        GROUP BY SubCategoryID) as E
        INNER JOIN
        (SELECT CategoryID as CataID, Name as Namecate FROM categories) as F
        ON E.CategoryID = F.CataID`;
    const [result, fields] = await load(sql);
    return result;
};
export async function editCategory(CategoryID: number, namecate: string) {
    const sql = `UPDATE categories
        SET Name = '${namecate}'
        WHERE CategoryID = ${CategoryID}`;
    const [result, fields] = await load(sql);
    return result;
};
export async function editSubCategory(SubCategoryID: number, namescate: string) {
    const sql = `UPDATE subcategories
        SET Name = '${namescate}'
        WHERE SubCategoryID = ${SubCategoryID}`;
    const [result, fields] = await load(sql);
    return result;
}
