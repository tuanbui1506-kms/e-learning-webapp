import categoryModel from "../models/category.model";
import express, { NextFunction } from 'express';
//import cartModel from '../models/cart.model';

export default function(app:express.Express) {
    app.use((req:express.Request, res:express.Response, next:NextFunction) => {
        if (typeof(req.session.auth) === 'undefined') {
            req.session.auth = false;
        }

        // if (req.session.auth === false) {
        //     req.session.cart = [];
        //   }

        res.locals.auth = req.session.auth;
        res.locals.authUser = req.session.authUser;
        console.log(req.session.authUser);
        // res.locals.cartSummary = cartModel.getNumberOfItems(req.session.cart);
        next();
    });
    // app.use(async function (req, res, next) {
    //     res.locals.lcCategories = await categoryModel.allSubCategories();
    //     res.locals.MainCategories = await categoryModel.allCategories();
    //     next();
    // });
}