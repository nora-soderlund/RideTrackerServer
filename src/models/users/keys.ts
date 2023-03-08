import Container from "../../container";
import { Database } from "../../services/database";

import { v4 as uuid } from "uuid";

const database = Container.resolve(Database);

export type UserKey = {
    id: string;
    user: string;

    timestamp: number;
};

export function createUserKey(user: string): Promise<UserKey | null> {
    return new Promise((resolve) => {
        const id = uuid();

        database.query("INSERT INTO user_keys (id, user, timestamp) VALUES (?, ?, ?)", [ id, user, Date.now() ], async (error: any, results: any) => {
            if(error)
                throw error;

            return resolve(await getUserKeyById(id));
        });
    });
};

export function getUserKeyById(id: string): Promise<UserKey | null> {
    return new Promise((resolve) => {
        database.query("SELECT id, user, timestamp FROM user_keys WHERE id = ? LIMIT 1", [ id ], (error: any, results: any) => {
            if(error)
                throw error;

            if(!results.length)
                return resolve(null);

            return resolve(results[0]);
        });
    });
};
