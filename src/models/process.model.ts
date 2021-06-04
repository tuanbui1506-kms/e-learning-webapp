import * as db from '../utils/db';
import Process from './classes/Process';
import Video from './classes/Video';
import { single } from './user.model';
import videoModel from './video.model';

const processModel = {
  async all() {
    const sql = 'select * from categories';
    const [rows, fields] = await db.load(sql);
    return rows;
  },
  async addProcess(process:number) {
    const [result, fields] = await db.add(process, "process");
    return result;
  },
  async getProcess(courseID:number, userID:string) {
    const sql = `Select * from process where CourseID = ${courseID} and UserID = '${userID}'`;
    const [row, fields] = await db.load(sql);
    if(row.length === 0) return null;

    let process: Process ;
    process = await Process.transform(row[0])

    if(+row[0]['VideoID']){
      const video = await videoModel.single(+row[0]['VideoID']);
      process.video = video;
    }
    return process;
  },

  // async saveProcess(process:Process, CurVideoId:number) {
  //   const condition = {
  //     ProcessID: process.id,
  //   }
  //   const processEntity = {
  //     VideoID: CurVideoId
  //   }
  //   console.log(condition);
  //   const [result, fields] = await db.patch(newprocess, condition, 'process');
  //   console.log(result);
  // },
  async getFirstVideo(courseID:number) {
    const sql = `select  video.VideoId
    from courses 
    join coursesection 
    on courses.CoursesID = coursesection.CourseID
    join video 
    on video.CourseSectionID = coursesection.CourseSectionID  
    where courses.CoursesID = ${courseID } limit 1`;
    const [row, fields] = await db.load(sql);
    let video =  row.length == 0 ? null : Video.transform(row[0]);
    if(video != null){
      video = await videoModel.single(video.id);
    }
    return video;
  },
  // async getVideo(videoID:number){

  // }  

};

export default processModel;