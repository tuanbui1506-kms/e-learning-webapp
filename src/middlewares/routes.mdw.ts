import express from "express";
import homeRoute from "../controller/home.route";
import accountRoute from '../controller/account.route';
import courseRoute from '../controller/course.route';
import courseFeRoute from '../controller/courses-fe';
import searchRoute from '../controller/search.route';
import userRoute from '../controller/user.route';
import cartRoute from '../controller/cart.route'
import adminRoute from '../controller/admin.route'

import auth from './auth.mdw'

const router = express.Router();

router.get('/about', function (req, res) {
    res.render('about');
})

router.get('/pricing', function (req, res) {
    res.render('pricing');
})

router.get('/contact', function (req, res) {
    res.render('contact');
})

router.get('/teacher', function (req, res) {
    res.render('teacher');
})
router.get('/blog', function (req, res) {
    res.render('blog');
})

router.use("/", homeRoute);
router.use("/account", accountRoute);
// router.use("/course",);

router.use('/course/', courseRoute); //dùng để sửa đổi course cho admin
router.use('/search/', searchRoute);
router.use('/courses/', courseFeRoute); //lấy từng course để show ra
router.use('/cart/', auth, cartRoute); //handle cart
router.use('/user/', auth, userRoute);
router.use('/admin/', adminRoute);
// router.get('/err', function(req, res) {
//     throw new Error('Error!');
// });

router.use((req, res) => { //render khi ko tìm thấy địa chỉ yêu cầu
    res.render('404', {
        layout: false
    });
});

export default router;