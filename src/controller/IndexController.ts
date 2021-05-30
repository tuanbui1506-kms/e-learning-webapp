import fs from "fs";
import Course from "../models/classes/Course";
import courseModel from '../models/course.model';

const controller = {
    async getTopProduct():Promise<Course[][]> {

        let productsArray = await courseModel.getNewCourses();

        let topProduct = [];
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 4; j++) {
                row.push(productsArray[i * 4 + j]);
            }
            topProduct.push(row);
        }
        return topProduct;
    },
    async getBestViewCourse(): Promise<Course[][]>  {
        let productsArray = await courseModel.getBestView();

        let topProduct = [];
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 4; j++) {
                row.push(productsArray[i * 4 + j]);
            }
            topProduct.push(row);
        }
        return topProduct;
    },
    async getHighlightCourse(): Promise<Course[]>  {
        let productsArray = await courseModel.getHighlightCourse();
        return productsArray;
    },
    async getHighlightCategories(): Promise<Course[]>  {
        let productsArray = await courseModel.getBestRegisterWeek();
        return productsArray;
    }
};
export default controller;