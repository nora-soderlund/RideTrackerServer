import Container from "../container";
import { Database } from "../services/database";
import { Activity } from "./activities";

const database = Container.resolve(Database);

export type Feed = {
    activities: string[];
};

export function getFeed(): Promise<Feed> {
    return new Promise((resolve) => {
        database.query("SELECT id FROM activities", (error: any, results: any) => {
            if(error)
                throw error;

            return resolve({
                activities: results.map((activity: Activity) => activity.id)
            });
        });
    });
};
