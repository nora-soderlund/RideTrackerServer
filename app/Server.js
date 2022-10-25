import http from "http";

import Database from "./Database.js";

export default class Server {
    static server = null;

    static listen(settings) {
        this.server = http.createServer((...args) => this.onRequest(...args)).listen(settings.port);

        console.log("Listening to port " + settings.port);
    };

    static requests = [];

    static async onRequest(request, response) {
        try {
            request.user = {
                guest: true
            };

            if(request.headers.authorization) {
                const authorization = request.headers.authorization.split(' ');

                if(authorization[0] != "Bearer") {
                    response.writeHead(403);

                    response.end();

                    return;
                }

                const rows = await Database.queryAsync(`SELECT * FROM user_tokens WHERE id = ${Database.connection.escape(authorization[1])} LIMIT 1`);

                if(rows.length) {
                    request.user = {
                        guest: false,
                        id: rows[0].user
                    };
                }
            }

            console.log(request.socket.remoteAddress + " > " + request.method + " " + request.url);
        
            const url = request.url.toLowerCase();
            const queryIndex = url.indexOf('?');
            const path = (queryIndex == -1)?(request.url):(request.url.substring(0, queryIndex));

            const listener = this.requests.find(x => x.method == request.method && x.path == path);

            if(!listener)
                throw new Error("Listener does not exist!");

            let result = null;

            if(listener.method == "GET" && queryIndex != -1) {
                const query = url.substr(queryIndex + 1, url.length).split('&');

                let parameters = {};

                for(let index = 0; index < query.length; index++) {
                    const pair = query[index].split('=');

                    parameters[pair[0]] = pair[1];
                }

                result = await listener.response(request, response, parameters);
            }
            else if(request.method == "POST") {
                const body = JSON.parse(await this.downloadBodyAsync(request));

                console.log(body);
                
                result = await listener.response(request, response, body);
            }
            else if(request.method == "PUT") {
                const body = await this.downloadBodyAsync(request);
                
                result = await listener.response(request, response, body);
            }
            else
                result = await listener.response(request, response);

            response.writeHead(200, {
                "Content-Type": listener.contentType
            });

            if(listener.contentType == "application/json")
                result = JSON.stringify(result);
            
            response.end(result);
        }
        catch(error) {
            console.error(request.socket.remoteAddress + ": " + error);
        }
        finally {
            response.end();
        }
    };

    static async downloadBodyAsync(request) {
        return new Promise((resolve) => {
            let body = "";

            request.on("data", (chunck) => {
                body += chunck;
            });

            request.on("end", async () => {
                resolve(body);
            });
        });
    };

    static on(method, path, response, requiredParameters = undefined, contentType = "application/json") {
        if(this.requests.find(x => x.method == method && x.path == path))
            throw new Error("Duplicate entry for " + method + " " + path);

        this.requests.push({ method, path, response, requiredParameters, contentType });
    };
};
