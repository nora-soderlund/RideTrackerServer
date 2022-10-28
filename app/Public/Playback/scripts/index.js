const searchParams = new URLSearchParams(window.location.search);
const activity = searchParams.get("activity");

let map = null, data = null;
const mapElement = document.getElementById("map");

async function onMapReady() {
    const response = await fetch(`/api/activity/map?id=${activity}`);
    const result = await response.json();

    data = result.content;

    map = new google.maps.Map(mapElement, {
        mapId: "b0c4ef9d12f624c9",
        
        zoom: 16
    });

    let paths = [];

    const bounds = new google.maps.LatLngBounds();

    result.content.sections.forEach((section, index) => {
        const path = section.coordinates.map((coordinate) => {
            const position = new google.maps.LatLng(coordinate.coords.latitude, coordinate.coords.longitude);
            
            bounds.extend(position);

            return position;
        });

        const createdPolyline = new google.maps.Polyline({
            path,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });

        createdPolyline.setMap(map);

        paths = paths.concat(path);
    });

    map.addListener("idle", onMapLoad);

    map.fitBounds(bounds);
};

function onMapLoad() {
    google.maps.event.clearListeners(map, "idle");

    setTimeout(() => {
        const section = data.sections[0];

        map.addListener("idle", onPanFinish);

        map.setZoom(16);
        map.setTilt(90);
        map.panTo(new google.maps.LatLng(section.coordinates[0].coords.latitude, section.coordinates[0].coords.longitude));
        map.setHeading(section.coordinates[0].coords.heading);
    }, 2000);
};

function onPanFinish() {
    google.maps.event.clearListeners(map, "idle");

    setTimeout(() => {
        map.addListener("idle", onPanReady);

        map.setZoom(18);
    }, 1000);
};

function onPanReady() {
    google.maps.event.clearListeners(map, "idle");

    setTimeout(() => {
        let index = 0;
        let ready = true;
        
        function onMapIdle() {
            ready = true;
        };
    
        map.addListener("heading_changed", onMapIdle);
    
        function onMapRender(time) {
            const section = data.sections[0];

            const coordinate = section.coordinates[index];

            console.log(index, coordinate);

            map.moveCamera({
                center: new google.maps.LatLng(coordinate.coords.latitude, coordinate.coords.longitude),
                heading: coordinate.coords.heading
            });
                
            index++;
    
            window.requestAnimationFrame(onMapRender);
        };
    
        window.requestAnimationFrame(onMapRender);
    }, 2000);
};

window.onMapReady = onMapReady;
