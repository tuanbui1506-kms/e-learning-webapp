import * as db from '../utils/db';
import Category from './classes/Category';
import SubCategory from './classes/SubCategory';

const categoryModel = {
  async all():Promise<Category[]> {
    const sql = 'select * from categories';
    const [rows, fields] = await db.load(sql);
    let categories: Category[] = [];
    rows.forEach((row) => {
      categories.push(Category.transform(row));
    });
    return categories;
  },

  async allCategories() {
    const sql = `
      select cat.*
      from categories cat join subcategories sc on cat.CategoryID = sc.CategoryID left join courses c on sc.SubCategoryID = c.SubCategoryID
      GROUP BY cat.Name
    `;
    const [rows, fields] = await db.load(sql);
    return rows.length == 0 ? null : Category.transform(rows[0]);

  },

  async allSubCategories() {
    const sql = `
      select sc.*, count(c.CoursesID) as ProductCount
      from subcategories sc left join courses c on sc.SubCategoryID = c.SubCategoryID
      group by sc.SubCategoryID, sc.Name
    `;
    const [rows, fields] = await db.load(sql);
    return rows.length == 0 ? null : SubCategory.transform(rows[0]);

  },

  async singleSubCatName(subCatID:number) {
    const sql = `select Name from subcategories where SubCategoryID = ${subCatID}`;
    const [rows, fields] = await db.load(sql);
    if (rows.length === 0)
      return null;

    return rows[0];
  },


  async single(id: number):Promise<Category|null> {
    const sql = `select * from categories where CategoryID = ${id}`;
    const [rows, fields] = await db.load(sql);
    return rows.length == 0 ? null : Category.transform(rows[0]);

  },

  async add(category: Category):Promise<Category|null> {
    const [result, fields] = await db.add(category, 'categories');
    // console.log(result);
    return result.length == 0 ? null : Category.transform(result[0]);

  },

  async del(id: number):Promise<Category|null> {
    const condition = {
      CatID: id
    };
    const [result, fields] = await db.del(condition, 'categories');
    return result.length == 0 ? null : Category.transform(result[0]);

  },

  async patch(entity: Category):Promise<Category|null> {
    const condition = {
      CatID: entity.id
    };
    //delete (entity.CatID);

    const [result, fields] = await db.patch(entity, condition, 'categories');
    return result.length == 0 ? null : Category.transform(result[0]);

  }
};

export default categoryModel;