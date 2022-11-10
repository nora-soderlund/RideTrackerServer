import fs from "fs";

import global from "../../../global.js";

export default class Geocoding {
    static async reverse(coordinate, options = {}) {
        const parameters = {
            ...options,
            
            latlng: coordinate.latitude + "," + coordinate.longitude,
            
            key: global.config.google.key
        };
    
        const url = `https://maps.googleapis.com/maps/api/geocode/json?${Object.entries(parameters).map(([ key, value ]) => `${key}=${value}`).join('&')}`;
    
        let response = await fetch(url);
        let result = await response.json();
    
        fs.writeFileSync(global.config.paths.logs + `Google_Maps_Geocoding_reverse_${Date.now()}.json`, JSON.stringify({
            url,
            response: result
        }));
    
        return result;
    };
};
