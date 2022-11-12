import fs from "fs";

import Coordinates from "./Coordinates.js";

import global from "./../../global.js";

import { Geocoding } from "../Google/Google.js";

export default class Recording {
    static version = "1.0.11";

    constructor(id) {
        this.id = id;

        this.data = JSON.parse(fs.readFileSync(global.config.paths.activities + `${id}.json`));
    };

    async getManifest() {
        if(!fs.existsSync(global.config.paths.manifests + `${this.id}.json`))
            await this.update(this.id);

        this.manifest = JSON.parse(fs.readFileSync(global.config.paths.manifests + `${this.id}.json`));
        
        if(this.manifest.meta.version != Recording.version) {
            fs.rmSync(global.config.paths.manifests + `${this.id}.json`);
            
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

        fs.writeFileSync(global.config.paths.manifests + `${id}.json`, JSON.stringify(manifest));
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
        try {
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

                if(!points) {
                    console.log("snap to roads issue with accuracy!");

                    console.log(result);
        
                    offset = upperBound;

                    continue;
                }

                points.forEach((point) => {
                    if(offset == 0 || point.originalIndex >= overlap - 1)
                        passedOverlap = true;
                    
                    if(passedOverlap) {
                        const originalCoordinate = page[point.originalIndex];

                        const distance = Coordinates.getDistance(originalCoordinate.coords, point.location);

                        if(distance < originalCoordinate.coords.accuracy) {
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
        }
        catch(error) {
            console.log(error);

            return coordinates;
        }
    };

    getDistance() {
        let distance = 0;

        this.manifest.sections.forEach((section) => {
            const coordinates = section.coordinates;

            for(let index = 1; index < coordinates.length; index++)
                distance += Coordinates.getDistance(coordinates[index - 1].coords, coordinates[index].coords);
        });

        const distanceInKm = distance / 1000;

        return Math.round(distanceInKm * 10) / 10;
    };

    getSpeed() {
        let speeds = [];

        this.manifest.sections.forEach((section) => {
            section.coordinates.forEach((coordinate) => {
                speeds.push(coordinate.coords.speed);
            });
        });

        if(speeds.length == 0)
            return 0;

        const averageMetersPerSecond = speeds.reduce((a, b) => (a + b)) / speeds.length;

        const averageKilometersPerHour = averageMetersPerSecond * 3.6;

        return Math.round(averageKilometersPerHour * 10) / 10;
    };

    getElevation() {
        let elevation = 0;

        this.manifest.sections.forEach((section) => {
            const coordinates = section.coordinates;

            for(let index = 1; index < coordinates.length; index++) {
                const difference = (coordinates[index].coords.altitude - coordinates[index - 1].coords.altitude) / Math.max(coordinates[index].coords.altitudeAccuracy, coordinates[index - 1].coords.altitudeAccuracy);

                if(difference >= 0)
                    elevation += difference;
            }
        });

        return Math.round(elevation);
    };

    async getOrigin() {
        if(!this.manifest.sections.length)
            return null;

        const section = this.manifest.sections[0];

        if(!section.coordinates.length)
            return null;

        const coordinate = section.coordinates[0];

        const geocoding = await Geocoding.reverse(coordinate.coords, {
            result_type: "locality"
        });

        if(!geocoding.results.length)
            return null;

        if(!geocoding.results[0].address_components.length)
            return null;

        return geocoding.results[0].address_components[0].long_name;
    };

    async getDestination() {
        if(!this.manifest.sections.length)
            return null;

        const section = this.manifest.sections[this.manifest.sections.length - 1];

        if(!section.coordinates.length)
            return null;
            
        const coordinate = section.coordinates[section.coordinates.length - 1];

        const geocoding = await Geocoding.reverse(coordinate.coords, {
            result_type: "locality"
        });

        if(!geocoding.results.length)
            return null;

        if(!geocoding.results[0].address_components.length)
            return null;

        return geocoding.results[0].address_components[0].long_name;
    };
};
