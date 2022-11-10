import mysql from "mysql";

export default class Database {
    static connection = null;

    static connectAsync(settings) {
        return new Promise((resolve, reject) => {
            this.settings = settings;

            this.connection = mysql.createConnection(this.settings);

            this.connection.connect((error) => {
                if(error)
                    return reject(error);

                return resolve();
            });
        });
    };

    static queryAsync(query) {
        return new Promise((resolve, reject) => {
            try {
                this.connection.query(query, (error, rows) => {
                    if(error)
                        return reject(error);
    
                    return resolve(rows);
                });
            }
            catch(error) {
                console.error(`ERROR! MySQL query failed: ${error}`);
                this.error("query", { query, error });

                this.diagnose();
            }
        });
    };

    static diagnose() {
        try {
            console.warn("WARNING! Attempting to diagnose MySQL server state...");

            const ping = connection.ping((error) => {
                console.error(`ERROR: failed to talk with the MySQL server: ${error}`);
                this.error("diagnose", { query, error });

                console.warn(`WARNING! Attempting to restart the MySQL server connection...`);
                this.connectAsync(this.settings).then(() => {
                    this.diagnose();
                }).catch((error) => {
                    console.error(`ERROR! Couldn't reconnect to the MySQL server: ${error}`);
                    this.error("diagnose", { error });
                });
            });

            if(ping)
                console.log("Ping to the MySQL server was succesful!");
        }
        catch(error) {
            console.error(`ERROR! Diagnose failed: ${error}`);
            this.error("diagnose", { error });
        }
    };

    static error(category, object) {
        const name = `mysql_${category}_${Date.now()}.json`;

        if(!fs.existsSync("./logs/"))
            fs.mkdirSync("./logs/");
                
        fs.writeFileSync(`./logs/${name}`, JSON.stringify(object));
    };
};
