import { RowDataPacket } from "mysql2";
import SubCategory from "./SubCategory";
import Teacher from "./Teacher";

class Course {
    id: number;
    name: string;
    tinyDes?: string;
    fullDes?: string;
    price: number;
    isFinished: boolean;
    lastUpdate: string;
    dateCreated: string;
    teacher?: Teacher;
    subCategory?: SubCategory;
    accessNum?: number;
    nRegister?: number;
    sale?: number;
    constructor(id: number, name: string, tinyDes: string, fullDes: string, price: number, isFinished: boolean, lastUpdated: string, dateCreated: string, accessNum: number, nRegister: number, sale: number) {
        this.id = id;
        this.name = name;
        this.tinyDes = tinyDes;
        this.fullDes = fullDes;
        this.price = price;
        this.isFinished = isFinished;
        this.lastUpdate = lastUpdated;
        this.dateCreated = dateCreated;
        this.accessNum = accessNum;
        this.nRegister = nRegister;
        this.sale = sale;
    };
    static transform(row: RowDataPacket): Course {
        return new Course(
            row['CourseID'],
            row['name'],
            row['TinyDes'],
            row['FullDes'],
            row['Price'],
            row['IsFinished'],
            row['LastUpdate'],
            row['DateCreated'],
            row['accessNum'],
            row['nRegister'],
            row['sale'],
        )
    }
}
export default Course;