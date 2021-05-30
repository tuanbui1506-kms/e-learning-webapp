import { RowDataPacket } from "mysql2";

class User {
    id: number;
    username: string;
    password: string;
    permission: number;
    UID: string;
    block: number;
    constructor(id?: number, username?: string, password?: string, permission?: number, UID?: string, block?: number,) {
        this.id = id || 0;
        this.username = username || "";
        this.password = password || "";
        this.permission = permission || 0;
        this.UID = UID || "";
        this.block = block || 0;
    }
    static transform(row: RowDataPacket): User {
        let user =  new User();
        user.id = row['id'];
        user.username = row['username'];
        user.password = row['password'];
        user.permission = row['permission'];
        user.UID = row['UID'];
        user.block = row['block'];
        return user;
    };
}
export default User;