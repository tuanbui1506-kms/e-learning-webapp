import categoryModel from "../models/category.model";
import express, { NextFunction } from 'express';
import Cart from "../models/classes/Cart";
//import cartModel from '../models/cart.model';

export default function (app: express.Express) {
    app.use((req: express.Request, res: express.Response, next: NextFunction) => {
        if (typeof (req.session.auth) === 'undefined') {
            req.session.auth = false;
        }

        if (req.session.auth != false && req.session.cart == undefined) {
            req.session.cart = new Cart;
            console.log(req.session.cart);

        }

        res.locals.auth = req.session.auth;
        if (req.session.authUser)
            res.locals.authUser = req.session.authUser;
        //console.log(req.session.authUser);
        // res.locals.cartSummary = cartModel.getNumberOfItems(req.session.cart);
        next();
    });
    app.use(async function (req, res, next) {
        res.locals.subcategories = await categoryModel.allSubCategories();
        res.locals.categories = await categoryModel.allCategories();
        console.log(res.locals);
        next();
    });
}