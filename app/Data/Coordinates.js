export default class Coordinates {
    static getDistance(start, end) {
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
      
    static degreesToRadius(degree) {
        return degree * (Math.PI / 180.0);
    };
};
