import fs from "fs";

import global from "./../../global.js";

export default class Recording {
    static version = "1.0.0";

    constructor(id) {
        this.id = id;

        this.data = JSON.parse(fs.readFileSync("./app/uploads/activities/" + id + ".json"));
    };

    async getManifest() {
        if(!fs.existsSync("./app/uploads/activities/manifests/" + this.id + ".json"))
            await this.update(this.id);

        this.manifest = JSON.parse(fs.readFileSync("./app/uploads/activities/manifests/" + this.id + ".json"));
        
        if(this.manifest.meta.version != Recording.version)
            await this.update(this.id);

        return this.manifest;
    };

    async update(id) {
        const manifest = {
            meta: {
                version: Recording.version
            },

            sections: await this.updateSections()
        };

        fs.writeFileSync("./app/uploads/activities/manifests/" + id + ".json", JSON.stringify(manifest));
    };

    async updateSections() {
        return await Promise.all(this.data.sections.map(async (section) => {
            const coordinates = section.coordinates.sort((start, finish) => start.timestamp - finish.timestamp);

            return {
                start: section.start,
                end: section.end,

                map: await this.snapToRoads(coordinates),
                coordinates: coordinates
            };
        }));
    };

    getCoordinateDistance(start, end) {
        let R = 6371; // Radius of the earth in km
        let dLat = this.degreesToRadius(end.latitude - start.latitude);  // this.degreesToRadius below
        let dLon = this.degreesToRadius(end.longitude - start.longitude);

        let a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.degreesToRadius(start.latitude)) * Math.cos(this.degreesToRadius(end.latitude)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        let d = R * c; // Distance in km

        return d * 1000;
    };
      
    degreesToRadius(degree) {
        return degree * (Math.PI / 180.0);
    };

    async snapToRoads(coordinates) {
        let snappedPoints = [];

        const size = 75;
        const overlap = 100 - size;

        let offset = 0;

        while(offset < coordinates.length) {
            if(offset > 0)
                offset -= overlap;

            const lowerBound = offset;
            const upperBound = Math.min(offset + size, coordinates.length);

            const page = coordinates.slice(lowerBound, upperBound);

            const path = page.map((coordinate) => `${coordinate.coords.latitude},${coordinate.coords.longitude}`).join('|');

            let response = await fetch(`https://roads.googleapis.com/v1/snapToRoads?path=${path}&interpolate=true&key=${global.config.google.key}`);
            let result = await response.json();

            const points = result.snappedPoints;
            let passedOverlap = false;

            points.forEach((point) => {
                if(offset == 0 || point.originalIndex >= overlap - 1)
                    passedOverlap = true;
                
                if(passedOverlap)
                    snappedPoints.push(point.location);
            });
    
            offset = upperBound;
        }

        return snappedPoints;
    };
};
