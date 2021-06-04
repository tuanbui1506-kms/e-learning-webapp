import express from 'express';
import categoryModel from '../models/category.model';
import courseModel from '../models/course.model';
import subcategoryModel from '../models/subcategory.model';
import { paginate } from './../config/default';

const router = express.Router();


router.get('/list', async (req, res, next) => { //handle pagination gửi từ byList
    const search_text = req.query.searchText + "";           //lỗi do nó ko đọc dc cái searchText á H            
    // console.log(req.body.searchText);
    //pagination
    let page = Number(req.query.page) || 1; //lấy giá trị page require
    if (page < 1) page = 1;

    // await courseModel.createFullText();                                     //tạo full text search
    // await subcategoryModel.createFullText();                            

    const search_part = search_text.split(" "); //tách từng từ

    const search_sql = search_part.join(', '); //gộp lại cách nhau bởi dấu phẩy

    const course_total = await courseModel.searchFullText(search_sql); //chứa list các course hợp lệ
    // const subCat_total = await subcategoryModel.searchFullText(search_sql); //chứa list các course hợp lệ
    // const c_total = [];                             //chứa các course hợp lệ
    // for (i = 0; i < (course_total.length + subCat_total.length); i++) {
    //     if (i < course_total.length) { //add course_total vào c_total
    //         c_total.push(course_total[i]);
    //     } else {
    //         let flag = false;
    //         for (j = 0; j < course_total.length; j++) { //duyệt qua từng phần tử trong course_total
    //             if (course_total[j].CoursesID === subCat_total[i - course_total.length].CoursesID) { //kiểm tra nếu trùng ID
    //                 flag = true;
    //                 break;
    //             }
    //         }
    //         if (flag === false)
    //             c_total.push(subCat_total[i - j - 1]);
    //     }
    // }

    // res.redirect(req.headers.referer);

    // const total = courseModel.getNumberOfList(c_total); //lấy số lg course trong c_total
    // let nPages = Math.floor(total / paginate.limit); //số lg page
    // if (total % paginate.limit > 0) nPages++;

    // //console.log(page_numbers);

    // const offset = (page - 1) * paginate.limit;
    // const page_numbers = [];
    // for (i = 1; i <= nPages; i++) {
    //     page_numbers.push({
    //         value: i,
    //         isCurrentPage: i === +page
    //     });
    // }

    // let listCourse = [];
    // for (var i = 0; i < total - (page - 1) * offset; i++) {
    //     if ((page - 1) * offset < total) {

    //         listCourse.push(c_total[(page - 1) * offset + i]);
    //     }
    // }
    //console.log(course);
    res.render('vwSearch/byList', {
        // course: listCourse,
        // page_numbers,
        // empty: listCourse.length === 0,
        // // subCatName: subCatName
        // search_text,
        // total
    });
})


router.post('/list', async function (req, res) {  //handle search form gửi từ bs4
    const search_text = req.body.searchText + "";
    let page = req.query?.page || 1; //lấy giá trị page require
    if (page < 1) page = 1;

    // const keysearch = search_text;

    // //pagination

    await courseModel.createFullText();                                     //tạo full text search
    await subcategoryModel.createFullText();

    const search_part = search_text.split(" "); //tách từng từ
    const search_sql = search_part.join(', '); //gộp lại cách nhau bởi dấu phẩy

    const course_total = await courseModel.searchFullText(search_sql); //chứa list các course hợp lệ
   
    res.render('vwSearch/byList', {
        course: course_total,
    });
})


export default router;