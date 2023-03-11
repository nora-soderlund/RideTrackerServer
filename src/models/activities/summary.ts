import Container from "../../container";
import { Database } from "../../services/database";
import { Activity } from "../activities";

const database = Container.resolve(Database);

export type ActivitySummary = {
    id: string;
    activity: string;

    area: string;
    
    distance: number;
    averageSpeed: number;
    elevation: number;
    maxSpeed: number;
    comments: number;
    
    timestamp: number;
};

export function getActivitySummary(activity: Activity): Promise<ActivitySummary | null> {
    return new Promise((resolve) => {
        database.query("SELECT id, activity, area, distance, average_speed AS averageSpeed, elevation, max_speed AS maxSpeed, comments, timestamp FROM activity_summary WHERE activity = ? LIMIT 1", [ activity.id ], (error: any, results: any) => {
            if(error)
                throw error;

            if(!results.length)
                return resolve(null);

            return resolve(results[0]);
        });
    });
};
