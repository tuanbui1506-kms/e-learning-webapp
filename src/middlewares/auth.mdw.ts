import express, { NextFunction } from 'express'
const auth = (req:express.Request, res:express.Response, next:NextFunction) => {
  if (req.session.auth === false) {
//     req.session.retUrl = req.originalUrl;
    return res.redirect('/account/login');
  }
  next();
}
export default auth