import { RowDataPacket } from "mysql2";

class SubCategory{
    id: number;
    name: string;
    courses?: [];
    constructor(id:number,name:string){
        this.id = id;
        this.name = name;
    }
    static transform(row: RowDataPacket): SubCategory {
        let subCategory: SubCategory = {
            id:row["SubCategoryID"],
            name:row['Name']
        };
        return subCategory;
    }
}
export default SubCategory;