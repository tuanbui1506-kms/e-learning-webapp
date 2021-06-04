import { RowDataPacket } from "mysql2";

class Student{
    stuID: number;
    name: string;
    dob: string;
    email: string;
    gender: number;
    UID: string;
    constructor(stuID: number, name: string, dob: string, email: string, gender: number, UID: string) {
        this.stuID = stuID;
        this.name = name;
        this.dob = dob;
        this.email = email;
        this.gender = gender;
        this.UID = UID;
    }
    static transform(row: RowDataPacket): Student {
        let student: Student = {
            stuID: row['StuID'],
            name: row['name'],
            dob: row['dob'],
            email: row['email'],
            gender: row['gender'],
            UID: row['UID']
        };
        return student;
    }
} 
export default Student;