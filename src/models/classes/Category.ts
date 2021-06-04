import { RowDataPacket } from "mysql2";
import subCategoryModel from "../subcategory.model";
import SubCategory from "./SubCategory";

class Category{
    id: number;
    name: string;
    subCategories: SubCategory[];
    constructor(id:number,name:string){
        this.id = id;
        this.name = name;
        this.subCategories = [];
    }
    static transform(row: RowDataPacket): Category {
        let category: Category = {
            id:row["CategoryID"],
            name:row['Name'],
            subCategories:[],
        };
        return category;
    }
} 
export default Category;