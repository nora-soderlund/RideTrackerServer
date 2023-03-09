import Container from "../container";
import { Database } from "../services/database";

const database = Container.resolve(Database);

export type Activity = {
    id: string;
    user: string;
    bike: string;
    
    timestamp: number;
};

export function getActivityById(id: string): Promise<Activity | null> {
    return new Promise((resolve) => {
        database.query("SELECT id, user, bike, timestamp FROM activities WHERE id = ? LIMIT 1", [ id ], (error: any, results: any) => {
            if(error)
                throw error;

            if(!results.length)
                return resolve(null);

            return resolve(results[0]);
        });
    });
};