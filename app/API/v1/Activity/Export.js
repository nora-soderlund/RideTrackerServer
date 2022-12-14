import fs from "fs";
import { XmlBuilder, XmlElement } from "@nora-soderlund/xmlbuilder";

import Server from "./../../../Server.js";
import Database from "./../../../Database.js";

import global from "./../../../../global.js";

Server.on("GET", "/api/v1/activity/export", { authenticated: true, content: "application/xml", parameters: [ "id" ] }, async (request, response, parameters) => {
    const row = await Database.querySingleAsync(`SELECT * FROM activities WHERE id = ${Database.connection.escape(parameters.id)} LIMIT 1`);

    if(!row)
        return "Activity doesn't exist!";

    if(row.user != request.user.id)
        return "You do not have permissions!";

    const path = `${global.config.paths.activities}${parameters.id}.json`;

    if(!fs.existsSync(path))
        return "Something went wrong!";

    const content = fs.readFileSync(path);

    const json = JSON.parse(content);

    const builder = new XmlBuilder();

    const rootElement = new XmlElement("gpx", {
        creator: "RideTracker",
        version: "1.1",
        
        "xmlns": "http://www.topografix.com/GPX/1/1",
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "xsi:schemaLocation": "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd",
        "xmlns:gpxtpx": "http://www.garmin.com/xmlschemas/TrackPointExtension/v1",
        "xmlns:gpxx": "http://www.garmin.com/xmlschemas/GpxExtensions/v3"
    });

    const metadataElement = new XmlElement("metadata");
    metadataElement.addElement(new XmlElement("time", null, json.meta.started));
    rootElement.addElement(metadataElement);

    const trackElement = new XmlElement("trk");
    trackElement.addElement(new XmlElement("name", null, "Ride Tracker Activity Export"));

    json.sections.forEach((segment) => {
        const trackSegmentElement = new XmlElement("trkseg");

        segment.coordinates.forEach((coordinate) => {
            const trackSegmentPointElement = new XmlElement("trkpt", {
                lat: coordinate.coords.latitude,
                lon: coordinate.coords.longitude
            });

            trackSegmentPointElement.addElement(new XmlElement("ele", null, coordinate.coords.altitude));
            trackSegmentPointElement.addElement(new XmlElement("time", null, new Date(coordinate.timestamp)));

            trackSegmentElement.addElement(trackSegmentPointElement);
        });

        trackElement.addElement(trackSegmentElement);
    });

    rootElement.addElement(trackElement);

    builder.addElement(rootElement);

    return builder.toString(true);
});
