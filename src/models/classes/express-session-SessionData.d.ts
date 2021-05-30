import session from 'express-session';

export declare module 'express-session' {
    export interface SessionData {
        auth: boolean;
        //TODO: fix this fucking shit
        authUser: {
            username: string
            Name?: string,
            ID?: string,
            StuID?: number,
            TeaID?: number,
            permission: number,
        }
    }
}