import { RowDataPacket } from 'mysql2';
import Teacher from './classes/Teacher';
import * as db from '../utils/db';
const ADMIN_PROPERTIES = {
    permission: 3,
}
const TEACHER_PROPERTIES = {
    table_name: "teachers",
    permission: 2,
    pk: "TeaID"
};

const teacherModel = {
    TEACHER_PROPERTIES,
    ADMIN_PROPERTIES,
    async all(): Promise<Teacher[] | null> {
        const sql = 'select * from teachers';
        const [rows, fields] = await db.load(sql);
        if (rows.length == 0) return null
        let teachers: Teacher[] = [];
        rows.forEach(row => {
            teachers.push(Teacher.transform(row))
        })
        return teachers;
    },

    async single(id: number): Promise<Teacher | null> {
        const sql = `select * from users where id = ${id}`;
        const [rows, fields] = await db.load(sql);
        return rows.length == 0 ? null : Teacher.transform(rows[0]);
    },

    async singleFromUID(UID: string): Promise<Teacher | null> {
        const sql = `select * from ${TEACHER_PROPERTIES.table_name} where UID = '${UID}'`;
        const [rows, fields] = await db.load(sql);
        return rows.length == 0 ? null : Teacher.transform(rows[0]);
    },

    async add(teacher: Teacher): Promise<Teacher | null> {
        const [result, fields] = await db.add(teacher, 'teachers');
        return result.length == 0 ? null : Teacher.transform(result[0]);
    },

    // async countNumber() {
    //     const sql = `select count(*) as total from teachers`;
    //     const [rows, fields] = await db.load(sql);

    //     return rows[0].total;

    // },
    async largest_ID():Promise<number> {
        const [result, fields] = await db.largest_ID(TEACHER_PROPERTIES.pk, TEACHER_PROPERTIES.table_name);

        return result[0].largestID;
    }

};
export default teacherModel;
