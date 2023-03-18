import Container from "../container";
import { Database } from "../services/database";

const database = Container.resolve(Database);

export type Bike = {
    id: string;
    user: string;
    
    name: string;
    model: string;

    image: string;
    
    timestamp: number;
};

export function getBikeById(id: string): Promise<Bike | null> {
    return new Promise((resolve) => {
        database.query("SELECT id, user, name, model, image, timestamp FROM bikes WHERE id = ? LIMIT 1", [ id ], (error: any, results: any) => {
            if(error)
                throw error;

            if(!results.length)
                return resolve(null);

            return resolve(results[0]);
        });
    });
};

export function getBikesByUser(user: string): Promise<Bike[]> {
    return new Promise((resolve) => {
        database.query("SELECT id, user, name, model, image, timestamp FROM bikes WHERE user = ? ORDER BY timestamp DESC", [ user ], (error: any, results: any) => {
            if(error)
                throw error;

            return resolve(results);
        });
    });
};
