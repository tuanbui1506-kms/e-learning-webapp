import { RowDataPacket } from "mysql2";
import Video from "./Video";

export  default class CourseSection{
    id:number;
    //ourseId:number;
    name:string;
    isPreview:number;
    videos:Video [];
    constructor(id:number,name:string,isPreview:number){
        this.id = id;
        this.name = name;
        this.isPreview = isPreview;
        this.videos = [];
    }
    static transform = (row:RowDataPacket):CourseSection => {
        return new CourseSection(
            row['CourseSectionID'],
            row['Name'],
            row['IsPreview']);
    }
}