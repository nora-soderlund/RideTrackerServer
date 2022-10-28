const searchParams = new URLSearchParams(window.location.search);
const activity = searchParams.get("activity");

let map = null;
const mapElement = document.getElementById("map");

async function onMapReady() {
    const response = await fetch(`/api/activity/map?id=${activity}`);
    const result = await response.json();

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

    map.fitBounds(bounds);

	setTimeout(() => onMapLoad(result.content), 1000);
};

function onMapLoad(data) {
	const section = data.sections[0];

	let index = 0;
	let start = null;

	map.setZoom(18);
	map.setTilt(90);

	function onMapIdle() {
		window.requestAnimationFrame(onMapRender);
	};

	map.addListener("idle", onMapIdle);

	function onMapRender(time) {
		if(!start) {
			const coordinate = section.coordinates[index];

			console.log(index, (time - start), coordinate);

			start = time;

			map.panTo(new google.maps.LatLng(coordinate.coords.latitude, coordinate.coords.longitude));
			map.setHeading(coordinate.coords.heading);

			return;
		}
			
		index++;
		start = null;

		if(index != section.coordinates.length)
			return window.requestAnimationFrame(onMapRender);
	};

	window.requestAnimationFrame(onMapRender);
};

window.onMapReady = onMapReady;
