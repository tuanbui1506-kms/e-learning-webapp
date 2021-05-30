import { RowDataPacket } from "mysql2";

class Category{
    id: number;
    name: string;
    subCategories?: [];
    constructor(id:number,name:string){
        this.id = id;
        this.name = name;
    }
    static transform(row: RowDataPacket): Category {
        let category: Category = {
            id:row["CategoryID"],
            name:row['Name']
        };
        return category;
    }
} 
export default Category;