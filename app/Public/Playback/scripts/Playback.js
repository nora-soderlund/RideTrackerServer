class Playback {
    constructor(element, activity, color) {
        this.element = element;
        this.activity = activity;
        this.color = color;
    };

    async startAsync() {
        this.data = await this.getActivityMapAsync();

        this.map = new google.maps.Map(this.element, {
            mapId: "b0c4ef9d12f624c9",
            
            disableDefaultUI: true,

            zoom: 16
        });

        this.createMapBounds();

        await this.fitMapToBoundsAsync();

        await this.timeoutAsync(2000);

        await this.focusMapToStartAsync();

        await this.timeoutAsync(1000);

        await this.zoomMapToStartAsync();

        await this.timeoutAsync(2000);

        if(!window.isReactNativeApp)
            await this.playback();
    };

    async getActivityMapAsync() {
        const response = await fetch(`/api/activity/map?id=${this.activity}`);
        const result = await response.json();

        return result.content;
    };

    smoothenPath(path) {
        const result = [];
    
        for(let index = 0; index < path.length - 1; index += 2) {
            //result.push(path[index]);

            result.push({
                lat: 0.75 * path[index].lat + 0.25 * path[index + 1].lat,
                lng: 0.75 * path[index].lng + 0.25 * path[index + 1].lng
            });
            
            result.push({
                lat: 0.25 * path[index].lat + 0.75 * path[index + 1].lat,
                lng: 0.25 * path[index].lng + 0.75 * path[index + 1].lng
            });

            //result.push(path[index + 1]);
        }

        return result;
    };

    createMapBounds() {
        this.bounds = new google.maps.LatLngBounds();

        this.data.sections.forEach((section, index) => {
            const path = section.coordinates.map((coordinate) => {
                const position = { lat: coordinate.coords.latitude, lng: coordinate.coords.longitude };
                
                this.bounds.extend(position);

                return position;
            });

            const polyline = new google.maps.Polyline({
                path: this.smoothenPath(path),
                geodesic: true,
                strokeColor: `#${this.color}`,
                strokeOpacity: 1.0,
                strokeWeight: 5,
            });

            polyline.setMap(this.map);
        });
    };

    async fitMapToBoundsAsync() {
        return new Promise((resolve) => {
            this.map.addListener("idle", () => {
                google.maps.event.clearListeners(this.map, "idle");
    
                resolve();
            });
    
            this.map.fitBounds(this.bounds);
        });
    };

    async timeoutAsync(interval) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, interval);
        });
    };

    async focusMapToStartAsync() {
        return new Promise((resolve) => {
            this.map.addListener("idle", () => {
                google.maps.event.clearListeners(this.map, "idle");
    
                resolve();
            });
            
            const section = this.data.sections[0];

            this.map.setZoom(16);
            this.map.setTilt(90);
            this.map.panTo(new google.maps.LatLng(section.coordinates[20].coords.latitude, section.coordinates[20].coords.longitude));
            this.map.setHeading(section.coordinates[20].coords.heading);
        });
    };

    async zoomMapToStartAsync() {
        return new Promise((resolve) => {
            this.map.addListener("idle", () => {
                google.maps.event.clearListeners(this.map, "idle");
    
                resolve();
            });

            this.map.setZoom(18);
        });
    };

    playback() {
        let ready = true;
        const section = this.data.sections[0];
        const start = performance.now();
        let delays = 0, timestamp = null;
        let previousCoordinateIndex = null;

        this.map.addListener("idle", () => {
            if(timestamp)
                delays += performance.now() - timestamp;
            
            window.requestAnimationFrame(() => onMapRender());
        });
    
        const onMapRender = () => {
            const elapsed = ((performance.now() - start) - delays) * 40;

            const current = section.coordinates[20].timestamp + elapsed;

            const index = section.coordinates.findIndex((coordinate) => coordinate.timestamp >= current);
            const coordinate = section.coordinates[index];

            if(index - 1 >= 0) {
                timestamp = null;

                const previousCoordinate = section.coordinates[index - 1];

                const duration = current - previousCoordinate.timestamp;

                const difference = previousCoordinate.timestamp - coordinate.timestamp;
                const differenceLatitude = previousCoordinate.coords.latitude - coordinate.coords.latitude;
                const differenceLongitude = previousCoordinate.coords.longitude - coordinate.coords.longitude;
                const differenceHeading = previousCoordinate.coords.heading - coordinate.coords.heading;

                const multiplier = duration / difference;

                const center = new google.maps.LatLng(
                    previousCoordinate.coords.latitude + (differenceLatitude * multiplier),
                    previousCoordinate.coords.longitude + (differenceLongitude * multiplier)
                );

                const camera = {
                    center
                };

                if(previousCoordinate.coords.speed >= 2 && coordinate.coords.speed >= 2)
                    camera.heading = previousCoordinate.coords.heading + (differenceHeading * multiplier);

                this.map.moveCamera(camera);

                if(window.ReactNativeWebView && previousCoordinateIndex != index) {
                    previousCoordinateIndex = index;

                    window.ReactNativeWebView.postMessage(JSON.stringify({ timestamp: current, index }));
                }

                timestamp = performance.now();
            }
            else
                window.requestAnimationFrame(() => onMapRender());
        };
    
        window.requestAnimationFrame(() => onMapRender());
    };
};
