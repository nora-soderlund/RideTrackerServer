import Container from "../container";
import { Database } from "../services/database";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

const saltRounds = 10;

const database = Container.resolve(Database);

export type User = {
    id: string;
    
    email: string;
    
    firstname: string;
    lastname: string;

    avatar: string;
    
    timestamp: number;
};

export function createUser(firstname: string, lastname: string, email: string, password: string): Promise<User | null> {
    return new Promise(async (resolve) => {
        const id = uuid();

        const hash = await bcrypt.hash(password, saltRounds);

        database.query("INSERT INTO users (id, firstname, lastname, email, password, timestamp) VALUES (?, ?, ?, ?, ?, ?)", [ id, firstname, lastname, email, hash, Date.now() ], async (error: any, results: any) => {
            if(error)
                throw error;

            return resolve(await getUserById(id));
        });
    });
};

export function getUserById(id: string): Promise<User | null> {
    return new Promise((resolve) => {
        database.query("SELECT id, email, firstname, lastname, avatar, timestamp FROM users WHERE id = ? LIMIT 1", [ id ], (error: any, results: any) => {
            if(error)
                throw error;

            if(!results.length)
                return resolve(null);

            return resolve(results[0]);
        });
    });
};

export function getUserByEmail(email: string): Promise<User | null> {
    return new Promise((resolve) => {
        database.query("SELECT id, email, firstname, lastname, avatar, timestamp FROM users WHERE email = ? LIMIT 1", [ email ], (error: any, results: any) => {
            if(error)
                throw error;

            if(!results.length)
                return resolve(null);

            return resolve(results[0]);
        });
    });
};

export function compareUserPassword(user: User, password: string): Promise<boolean> {
    return new Promise((resolve) => {
        database.query("SELECT password FROM users WHERE id = ? LIMIT 1", [ user.id ], async (error: any, results: any) => {
            if(error)
                throw error;

            if(!results.length)
                return resolve(false);

            const result = await bcrypt.compare(password, results[0].password);

            return resolve(result);
        });
    });
};
