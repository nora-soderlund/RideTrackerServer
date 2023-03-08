import Container from "../container";
import { Database } from "../services/database";

const database = Container.resolve(Database);

export type User = {
    id: string;
    
    email: string;
    
    firstname: string;
    lastname: string;

    avatar: string;
    
    timestamp: number;
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
