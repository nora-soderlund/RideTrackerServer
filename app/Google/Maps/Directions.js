import fs from "fs";

import global from "../../../global.js";

export default async function Directions(origin, destination, options = {}) {
    const parameters = {
        ...options,
        
        origin,
        destination,
        
        key: global.config.google.key
    };

    const url = `https://maps.googleapis.com/maps/api/directions/json?${Object.entries(parameters).map(([ key, value ]) => `${key}=${value}`).join('&')}`;

    let response = await fetch(url);
    let result = await response.json();

    return result;
};
