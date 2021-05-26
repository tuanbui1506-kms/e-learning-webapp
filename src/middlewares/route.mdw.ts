import express from 'express';
import homeRoute from "../controller/home.route";

export function routeFunc (app:express.Express):void{
    app.get('/',homeRoute);
    app.get('/pageNum1',(req:express.Request,res:express.Response):void=>{
        res.send("This is page num 1");
    });
}
    
