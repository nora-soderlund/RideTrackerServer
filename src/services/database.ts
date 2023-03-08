import mysql from "mysql";

export class Database {
    constructor(options: any) {
        return mysql.createPool(options);
    };
};
