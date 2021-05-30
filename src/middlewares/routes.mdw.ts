import express from "express"
import homeRoute from "../controller/home.route";
import accountRoute from '../controller/account.route'
import courseRoute from '../controller/course.route'
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
router.use("/account",accountRoute);
// router.use("/course",);

router.use('/course/', courseRoute); //dùng để sửa đổi course cho admin
// router.use('/search/', require('./../controllers/search.route'));
// router.use('/courses/', require('../controllers/courses-fe.route')); //lấy từng course để show ra
// router.use('/cart/', auth, require('../controllers/cart.route')); //handle cart
// router.use('/user/', auth, require('./../controllers/user.route'));
// router.use('/admin/', require('./../controllers/admin.route'));
// router.get('/err', function(req, res) {
//     throw new Error('Error!');
// });

// router.use((req, res) => { //render khi ko tìm thấy địa chỉ yêu cầu
//     res.render('404', {
//         layout: false
//     });
// });

export default router;