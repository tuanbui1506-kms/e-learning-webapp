import express from 'express';
import moment from 'moment';
import cartModel from '../models/cart.model';
import courseModel from '../models/course.model';
import orderModel from '../models/order.model';
// import orderModel from '../models/order.model';
// import detailModel from '../models/detail.model';
import processModel from '../models/process.model';

const router = express.Router();

router.get('/', async function (req, res) { //trang thanh toán
    res.render('vwCart/index', {
        items: req.session.cart,
        empty: req.session.cart?.courses.length === 0
    });
})

router.post('/add', async function (req, res) { //khi bấm nút + add trong courses/detail


    const course = await courseModel.single(req.body.id);
    if (req.session.cart && course) {
        req.session.cart.courses.push(course)
        res.redirect(`/courses/detail/${req.body.id}`);
    }
    res.redirect(`/err`);
})

router.post('/remove', async function (req, res) {
    if (req.session.cart !== undefined) {
        cartModel.remove(req.session.cart, +req.body.id);
        res.redirect(req.headers.referer || "/");
    }
})

router.post('/checkout', async function (req, res) {
    if (req.session.cart && req.session.authUser){
        if(orderModel.add(req.session.cart, req.session.authUser.ID || req.session.authUser.ID)){
            req.session.cart.courses.splice(0,req.session.cart.courses.length);
        }
    }
    res.redirect(req.headers.referer || "/");

})

export default router;




