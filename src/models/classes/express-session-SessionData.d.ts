import session from 'express-session';
import Cart from './Cart';
import Category from './Category';
import SubCategory from './SubCategory';

export declare module 'express-session' {
    interface SessionData {
        auth: boolean;
        //TODO: fix this fucking shit
        authUser: {
            username: string
            Name?: string,
            ID: string,
            StuID?: number,
            TeaID?: number,
            permission: number,
        };
        subcategories:SubCategory | null,
        categories:Category | null,
        cart: Cart
    }
}



export declare module 'express' {
    export interface Response {
        locals: Locals;
    }
    export interface Locals {
        subcategories:SubCategory,
        categories:Category,
        auth: boolean;
        //TODO: fix this fucking shit
        authUser: {
            username: string
            Name?: string,
            ID: string,
            StuID?: number,
            TeaID?: number,
            permission: number,
        };
    }
}