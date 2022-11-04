import fs from "fs";

import global from "./../../global.js";

import Coordinates from "./Coordinates.js";

export default class Recording {
    static version = "1.0.2";

    constructor(id) {
        this.id = id;

        this.data = JSON.parse(fs.readFileSync("./app/uploads/activities/" + id + ".json"));
    };

    async getManifest() {
        if(!fs.existsSync("./app/uploads/activities/manifests/" + this.id + ".json"))
            await this.update(this.id);

        this.manifest = JSON.parse(fs.readFileSync("./app/uploads/activities/manifests/" + this.id + ".json"));
        
        if(this.manifest.meta.version != Recording.version) {
            fs.rmSync("./app/uploads/activities/manifests/" + this.id + ".json");
            
            await this.update(this.id);
        }

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

                //map: await this.snapToRoads(coordinates),
                coordinates: await this.updateCoordinates(coordinates)
            };
        }));
    };

    async updateCoordinates(coordinates) {
        coordinates = coordinates.map((coordinate) => {
            return {
                timestamp: coordinate.timestamp,

                coords: {
                    altitude: coordinate.coords.altitude,
                    heading: coordinate.coords.heading,
                    altitudeAccuracy: coordinate.coords.altitudeAccuracy,
                    latitude: coordinate.coords.latitude,
                    speed: coordinate.coords.speed,
                    longitude: coordinate.coords.longitude,
                    accuracy: coordinate.coords.accuracy
                }
            };
        });

        return await this.snapToRoads(coordinates);
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

            let response = await fetch(`https://roads.googleapis.com/v1/snapToRoads?path=${path}&interpolate=false&key=${global.config.google.key}`);
            let result = await response.json();

            const points = result.snappedPoints;
            let passedOverlap = false;

            points.forEach((point) => {
                if(offset == 0 || point.originalIndex >= overlap - 1)
                    passedOverlap = true;
                
                if(passedOverlap) {
                    const originalCoordinate = page[point.originalIndex];

                    if(Coordinates.getDistance(originalCoordinate.coords, point.location) < originalCoordinate.coords.acccuracy) {
                        snappedPoints.push({
                            ...originalCoordinate,

                            road: {
                                latitude: point.location.latitude,
                                longitude: point.location.longitude
                            }
                        });
                    }
                    else {
                        snappedPoints.push(originalCoordinate);
                    }
                }
            });
    
            offset = upperBound;
        }

        return snappedPoints;
    };
};
