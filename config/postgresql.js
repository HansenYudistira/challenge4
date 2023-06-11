const { Client } = require('pg');

class postgresqlDb {
    constructor() {
        this.client = null;
        this.#run();
    }

    #run = async function () {
        // Create a Client
        const client = new Client({
            host: process.env.PG_DATABASE_HOST,
            port: process.env.PG_DATABASE_PORT,
            database: process.env.PG_DATABASE_NAME,
            user: process.env.PG_DATABASE_USER,
            password: process.env.PG_DATABASE_PASSWORD
        });
        try {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();
            // Send a ping to confirm a successful connection
            console.log("Pinged your deployment. You successfully connected to PostgresqlDb!");
            this.client = client;
        } catch (error) {
            console.log(error);
        }
    }
}

const postgresql = new postgresqlDb();
module.exports = postgresql;