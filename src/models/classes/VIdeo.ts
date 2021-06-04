import { RowDataPacket } from "mysql2";

class Video {
    id:number
    name: string;
    linkVideo:Buffer | null;
    constructor(id:number,name:string) {
        this.id = id;
        this.name = name;
        this.linkVideo = null;
    };
    static transform(row:RowDataPacket):Video{
        return new Video(row['VideoId'],row['Name']);
    };
    setLink(link:Buffer | null):void {this.linkVideo = link;};
} 
export default Video;