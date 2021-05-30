const fs = require("fs");
const courseModel = require('./course.model');

// let products = JSON.parse(
//   fs.readFileSync("./data/products.json", {
//     encoding: "utf8",
//   })
// );

var controller = {};

controller.getTopProduct = async() => {

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
};
controller.getBestViewCourse = async() => {

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
};
controller.getHighlightCourse = async() => {
    let productsArray = await courseModel.getHighlightCourse();
    return productsArray;
};
controller.getHighlightCategories = async() => {
    let productsArray = await courseModel.getBestRegisterWeek();
    return productsArray;
};
module.exports = controller;