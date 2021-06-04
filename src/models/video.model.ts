import * as db from "../utils/db";
import fs from 'fs';
import Video from "./classes/Video";
import processModel from "./process.model";

const videoModel = {
    async single(videoID: number) {
        const sql = `select * from video where VideoID = ${videoID}`;
        const [rows, fields] = await db.load(sql);
        let video =  rows.length == 0 ? null : Video.transform(rows[0]);
        if(video != null)
            video.linkVideo = await this.getLinkVideoByID(video.id)
        return video;
    },

    async getLinkVideo(courseID: number, CourseSectionID: number, VideoID: number): Promise<Buffer | null> {
        const path = `video/${courseID}/${CourseSectionID}/${VideoID}.txt`;
        try {
            if (fs.existsSync(path)) {
                //file exists
                const link = fs.readFileSync(path)
                return link;
            }
        } catch (err) {
            console.error(err)
        }
        return null;
    },
    async getLinkVideoByID(videoID: number): Promise<Buffer | null> {
        const sql = `select *
        from coursesection 
        join video on video.CourseSectionID = coursesection.CourseSectionID
        where video.VideoId = ${videoID}`
        const [rows, fields] = await db.load(sql);
        const courseID = +rows[0]['CourseID'];
        const courseSectionID = +rows[0]['CourseSectionID'];
        const path = `video/${courseID}/${courseSectionID}/${videoID}.txt`;
        try {
            if (fs.existsSync(path)) {
                //file exists
                const link = fs.readFileSync(path)
                return link;
            }
        } catch (err) {
            console.error(err)
        }
        return null;
    },


    async checkVideoExist(courseID: number, videoID: Number) {
        const sql = `select *
        from coursesection 
        join video on video.CourseSectionID = coursesection.CourseSectionID
        where coursesection.CourseID = ${courseID} and video.VideoId = ${videoID}`
        const [rows, fields] = await db.load(sql);
        return rows.length > 0;
    },

    async getInProcessVideo(courseID: number, videoID: number, UID: string | undefined) {
        let curVideo: Video | null = null;
        if (videoID != NaN && await this.checkVideoExist(courseID, videoID)) {

            curVideo = await videoModel.single(videoID);
            if (curVideo != null)
                curVideo.linkVideo = await videoModel.getLinkVideoByID(videoID);
        }
        else {
            if (UID != undefined) {
                const process = await processModel.getProcess(courseID, UID);
                if (process != null)
                    curVideo = process.video;
                else{
                    curVideo = (await processModel.getFirstVideo(courseID));
                }

            } else {
                curVideo = (await processModel.getFirstVideo(courseID));
            }
        }
        console.log(curVideo);

        return curVideo;
    }

}

export default videoModel;