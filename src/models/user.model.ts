import { FieldPacket, RowDataPacket } from 'mysql2';
import User from './classes/User';
import * as db from '../utils/db'

const USER_PROPERTIES = {
    table_name: "users",
    pk: "ID"
};


export async function all(): Promise<User[] | null> {
    const sql = `select * from ${USER_PROPERTIES.table_name}`;
    const [rows, fields] = await db.load(sql);
    let users: User[] = [];
    rows.forEach((row) => {
        users.push(User.transform(row));
    });
    return users;
};

export async function single(id: number): Promise<User | null> {
    const sql = `select * from ${USER_PROPERTIES.table_name} where id = ${id}`;
    const [rows, fields] = await db.load(sql);

    return rows.length == 0 ? null : User.transform(rows[0]);
};

export async function add(user: string) {
    const [result, fields] = await db.add(user, 'users');
    // console.log(result);
    return result;
};

// async function countNumber() {
//     const [result, fields] = await db.count('users');

//     return result[0].total;
// };
export async function singleByUserName(username: string): Promise<User | null> {
    const sql = `select * from users where username = '${username}'`;
    const [rows, fields] = await db.load(sql);
    return rows.length == 0 ? null : User.transform(rows[0]);

};
export async function getUserByUserName(username: string):Promise<User | null> {
    const sql = `SELECT *
    FROM (SELECT * FROM students) as A 
    INNER JOIN 
                (SELECT ID, UID as UID1, username, password, permission FROM users WHERE username = '${username}') as B
    ON A.UID = B.UID1`;
    const [rows, fields] = await db.load(sql);
    return rows.length == 0 ? null : User.transform(rows[0]);

};

export async function getUserByEmail(email: string):Promise<User | null> {
    const sql = `select *
        from users u join students s on u.UID = s.UID
        where s.email = '${email}'`;
    const [rows, fields] = await db.load(sql);
    return rows.length == 0 ? null : User.transform(rows[0]);

};

export async function updateNameStudent(username: string, name: string):Promise<void> {
    const sql = `UPDATE students
        SET name = '${name}'
        WHERE UID = (SELECT UID FROM users WHERE username = '${username}')`
    await db.load(sql);
};
export async function updateNameTeacher(username: string, name: string):Promise<void> {
    const sql = `UPDATE teachers
        SET name = '${name}'
        WHERE UID = (SELECT UID FROM users WHERE username = '${username}')`
    await db.load(sql);
};
export async function updateEmailStudent(username: string, email: string):Promise<void> {
    const sql = `UPDATE students
        SET email = '${email}'
        WHERE UID = (SELECT UID FROM users WHERE username = '${username}')`
    await db.load(sql);
};
export async function updateEmailTeacher(username: string, email: string):Promise<void> {
    const sql = `UPDATE teachers
        SET email = '${email}'
        WHERE UID = (SELECT UID FROM users WHERE username = '${username}')`
    await db.load(sql);
};
export async function updatePassWord(username: string, pass: string):Promise<void> {
    const sql = `UPDATE users
        SET password = '${pass}'
        WHERE username = '${username}'`
    await db.load(sql);
};
// export async function getInforCate() {
//     const sql = `SELECT COUNT(*) as SLKH, SUM(AccessNumber) AS SLTC, subName, SID 
//         FROM (SELECT * FROM (SELECT SubCategoryID as SID, subcategories.Name as subName FROM subcategories) as B INNER JOIN courses ON B.SID = courses.SubCategoryID) as A
//         GROUP BY SID`
//     const [row, fields] = await db.load(sql) as RowDataPacket[];
//     if (row.length === 0) {
//         return null;
//     }
//     return row[0];
// }
