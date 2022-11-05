import fs from "fs";

import global from "../../../global.js";

export default class Roads {
    static async snapToRoads(path, options = {}) {
        let points = [];
    
        const overlap = options.overlap ?? 25;
        const size = 100 - overlap;
    
        let offset = 0;
    
        while(offset < path.length) {
            if(offset > 0)
                offset -= overlap;
    
            const lowerBound = offset;
            const upperBound = Math.min(offset + size, path.length);
    
            const page = path.slice(lowerBound, upperBound);

            const url = `https://roads.googleapis.com/v1/snapToRoads?path=${page.map((coordinate) => `${coordinate.latitude},${coordinate.longitude}`).join('|')}&interpolate=${options.interpolate ?? false}&key=${global.config.google.key}`;
    
            let response = await fetch(url);
            let result = await response.json();

            fs.writeFileSync(`./logs/Google_Maps_Roads_snapToRoads_${Date.now()}.json`, JSON.stringify({
                url,
                response: result
            }));
    
            let passedOverlap = false;
    
            result.snappedPoints.forEach((point) => {
                if(offset == 0 || point.originalIndex >= overlap - 1)
                    passedOverlap = true;
                
                if(passedOverlap)
                    points.push(point);
            });
    
            offset = upperBound;
        }
    
        return points;
    };
    
    static async nearestRoads(path, options = {}) {
        let points = [];
    
        const overlap = options.overlap ?? 25;
        const size = 100 - overlap;
    
        let offset = 0;
    
        while(offset < path.length) {
            if(offset > 0)
                offset -= overlap;
    
            const lowerBound = offset;
            const upperBound = Math.min(offset + size, path.length);
    
            const page = path.slice(lowerBound, upperBound);

            const url = `https://roads.googleapis.com/v1/nearestRoads?points=${page.map((coordinate) => `${coordinate.latitude},${coordinate.longitude}`).join('|')}&key=${global.config.google.key}`;
    
            let response = await fetch(url);
            let result = await response.json();

            fs.writeFileSync(`./logs/Google_Maps_Roads_nearestRoads_${Date.now()}.json`, JSON.stringify({
                url,
                response: result
            }));
    
            let passedOverlap = false;
    
            result.snappedPoints.forEach((point) => {
                if(offset == 0 || point.originalIndex >= overlap - 1)
                    passedOverlap = true;
                
                if(passedOverlap)
                    points.push(point);
            });
    
            offset = upperBound;
        }
    
        return points;
    };
};
