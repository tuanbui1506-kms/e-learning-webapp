import mysql, { RowDataPacket } from 'mysql2';
import { dbConfig } from '../config/default'
const mysql_opts = dbConfig.mysql;

const pool = mysql.createPool(mysql_opts);
const promisePool = pool.promise();

export interface User {
    id: number,
    username: string,
    password: string,
    permission: string,
    UID: string,
    block: number

}

export async function load(sql: string) {
    return promisePool.query<RowDataPacket[]>(sql)
};

export async function add(entity: any, table_name: string) {
    const sql = `insert into ${table_name} set ?`;
    return promisePool.query<RowDataPacket[]>(sql, entity);
};

export async function del(condition: any, table_name: string) {
    const sql = `delete from ${table_name} where ?`;
    return promisePool.query<RowDataPacket[]>(sql, condition);
};

export async function patch(new_data:any, condition:any, table_name:string) {
    const sql = `update ${table_name} set ? where ?`;
    return promisePool.query<RowDataPacket[]>(sql, [new_data, condition]);
};


    // largest_ID(idName, table_name) {
    //     const sql = `	select max(${idName}) as largestID from ${table_name}`;
    //     return promisePool.query(sql);

    // },