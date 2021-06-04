import { RowDataPacket } from "mysql2";

class Teacher{
    teaID?: number;
    name: string;
    dob: string;
    email: string;
    gender: number;
    UID: string;
    constructor(teaID: number, name: string, dob: string, email: string, gender: number, UID: string) {
        this.teaID = teaID;
        this.name = name;
        this.dob = dob;
        this.email = email;
        this.gender = gender;
        this.UID = UID;
    }
    static transform(row: RowDataPacket): Teacher {
        let teacher: Teacher = {
            teaID: row['TeaID'],
            name: row['teaName'],
            dob: row['dob'],
            email: row['email'],
            gender: row['gender'],
            UID: row['UID']
        };
        return teacher;
    }
} 
export default Teacher;