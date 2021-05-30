const db = require('../utils/db');

module.exports = {
  async all() {
    const sql = 'select * from categories';
    const [rows, fields] = await db.load(sql);
    return rows;
  },
  async addProcess(process) {
    const [result, fields] = await db.add(process, "process");
    return result;
  },
  async getProcess(courseID, userID) {
    const sql = `Select * from process where CourseID = ${courseID} and UserID = '${userID}'`;
    const [row, fields] = await db.load(sql);
    if(row.length === 0) return null;
    return row[0].VideoID;
  },
  async saveProcess(process, CurVideoId) {
    const condition = {
      ProcessID: process.ProcessID,
    }
    const newprocess = {
      VideoID: CurVideoId
    }
    console.log(condition);
    const [result, fields] = await db.patch(newprocess, condition, 'process');
    console.log(result);
  },
  async getFirstVideo(CourseID) {
    const sql = `select  video.VideoId
    from courses 
    join coursesection 
    on courses.CoursesID = coursesection.CourseID
    join video 
    on video.CourseSectionID = coursesection.CourseSectionID  
    where courses.CoursesID = ${CourseID } limit 1`;
    const [row, fields] = await db.load(sql);
    if(row.length === 0) 
      return null;
    return row[0].VideoId;
  },
  

};
