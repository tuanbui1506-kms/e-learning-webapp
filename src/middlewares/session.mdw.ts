import {Express} from 'express'
import session from 'express-session';
let mysqlSession = require('express-mysql-session');
import {dbConfig} from '../config/default';

const MySQLStore = mysqlSession(session);
export default function sessionMdw(app:Express){
  const sessionStore = new MySQLStore(dbConfig.mysql);
  app.set('trust proxy', 1) // trust first proxy
  app.use(session({
    secret: 'SECRET_KEY',
    resave: false,
    store: sessionStore,
    saveUninitialized: true,
    cookie: { 
      //secure: true 
    }
  }));
}