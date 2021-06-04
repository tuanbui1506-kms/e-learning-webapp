import { RowDataPacket } from "mysql2";
import Student from "./Student";

class Feedback{
    id:number;
    content:string;
    rating:number;
    student?:Student
    constructor(id:number,context:string,rating:number){
        this.id = id;
        this.content = context;
        this.rating = rating;
    } 
    static transform = (row:RowDataPacket):Feedback =>{
        return new Feedback(
            row['FeedbackID'],
            row['Content'],
            row['Rating']
        )
    }
}
export default Feedback;