import { RowDataPacket } from "mysql2";

class Video {
    id:number
    name: string;
    constructor(id:number,name:string) {
        this.id = id;
        this.name = name;
    }
    static transform(row:RowDataPacket):Video{
        return new Video(row['VideoId'],row['Name']);
    }
} 
export default Video;