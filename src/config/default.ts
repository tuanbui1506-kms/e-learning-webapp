export const dbConfig = {
    mysql:{
        host:"localhost",
        port: 3306,
        user: "root",
        password: "root",
        database: "quanlykhoahoc",
        waitForConnections: true,
        connectionLimit: 50,
        queueLimit: 0
   },
}

export const paginate = {
    limit:6
}
