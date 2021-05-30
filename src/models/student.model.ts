import { RowDataPacket } from 'mysql2';
import Student from './classes/Student';
import Teacher from './classes/Teacher';
import * as db from '../utils/db';
//import { singleFromUID } from './teacher.model';

const STUDENT_PROPERTIES = {
    table_name: "students",
    permission: 1,
    pk: "StuID"
};

const studentModel  = {
    STUDENT_PROPERTIES,
    async all():Promise<Student[]| null> {
        const sql = 'select * from students';
        const [rows, fields] = await db.load(sql);
        if (rows.length == 0) return null
        let student: Student[] = [];
        rows.forEach(row => {
            student.push(Student.transform(row))
        })
        return student;
    },

    async single(id:number):Promise<Student| null> {
        const sql = `select * from students where StuID = ${id}`;
        const [rows, fields] = await db.load(sql);
        return rows.length == 0 ? null : Student.transform(rows[0]);

    },
    async singleFromUID(UID:string):Promise<Student| null> {
        const sql = `select * from ${STUDENT_PROPERTIES.table_name} where UID = '${UID}'`;
        const [rows, fields] = await db.load(sql);
        return rows.length == 0 ? null : Student.transform(rows[0]);

    },
    async add(student: Student):Promise<Student| null> {
        const [result, fields] = await db.add(student, 'students');
        return result.length == 0 ? null : Student.transform(result[0]);
    },
};

export default studentModel;
