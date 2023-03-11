import Container from "../../container";
import { Database } from "../../services/database";
import { Bike } from "../bikes";

const database = Container.resolve(Database);

export type BikeSummary = {
    id: string;
    bike: string;

    rides: number;
    distance: number;
    elevation: number;
    
    timestamp: number;
};

export function getBikeSummary(bike: Bike): Promise<BikeSummary | null> {
    return new Promise((resolve) => {
        database.query("SELECT id, bike, rides, distance, elevation, timestamp FROM bike_summary WHERE bike = ? LIMIT 1", [ bike.id ], (error: any, results: any) => {
            if(error)
                throw error;

            if(!results.length)
                return resolve(null);

            return resolve(results[0]);
        });
    });
};
