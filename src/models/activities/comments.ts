import Container from "../../container";
import { Database } from "../../services/database";
import { Activity } from "../activities";

const database = Container.resolve(Database);

export type ActivityComment = {
    id: string;
    activity: string;
    user: string;
    parent: string;
    
    message: string;
    
    timestamp: number;
};

export function getLatestActivityComment(activity: Activity): Promise<ActivityComment | null> {
    return new Promise((resolve) => {
        database.query("SELECT id, activity, user, parent, message, timestamp FROM activity_comments WHERE activity = ? ORDER BY timestamp DESC LIMIT 1", [ activity.id ], (error: any, results: any) => {
            if(error)
                throw error;

            if(!results.length)
                return resolve(null);

            return resolve(results[0]);
        });
    });
};
