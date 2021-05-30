class Admin {
    adminId: number;
    name: string;
    UID: string;
    constructor(adminID: number, name: string, UID: string) {
        this.adminId = adminID;
        this.name = name;
        this.UID = UID;
    }
}

export default Admin;