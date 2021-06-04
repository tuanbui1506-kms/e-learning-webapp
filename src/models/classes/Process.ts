import { RowDataPacket } from "mysql2";
import courseModel from "../course.model";
import videoModel from "../video.model";
import Student from "./Student";
import Video from "./Video";

export default class Process{
    id:number;
    video:Video | null;
    constructor(id:number,video:Video | null){
        this.id = id;
        this.video = video;
    }
    static async transform(row:RowDataPacket){
        return new Process(
            row['ProcessID'],
            await videoModel.single(row['VideoID']),
        )
    }
}