import Container from "../../container";
import { Database } from "../../services/database";
import { Activity } from "../activities";

const database = Container.resolve(Database);

export type ActivityLike = {
    id: string;
    activity: string;
    user: string;
    
    timestamp: number;
};

export function getActivityLike(activity: Activity, user: string): Promise<ActivityLike | null> {
    return new Promise((resolve) => {
        database.query("SELECT id, activity, user, timestamp FROM activity_likes WHERE activity = ? AND user = ? LIMIT 1", [ activity.id, user ], (error: any, results: any) => {
            if(error)
                throw error;

            if(!results.length)
                return resolve(null);

            return resolve(results[0]);
        });
    });
};
