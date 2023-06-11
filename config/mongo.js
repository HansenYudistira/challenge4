const { MongoClient, ServerApiVersion } = require('mongodb');

class MongoDatabase {
    constructor() {
        this.db = null;
        this.#run();
    }

    #run = async function () {
        // database URI
        const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@belajarmongo.9ziapsh.mongodb.net/?retryWrites=true&w=majority`;

        // Create a MongoClient with a MongoClientOptions object to set the Stable API version
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        try {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();
            // Send a ping to confirm a successful connection
            await client.db("my-server").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            this.db = client.db("my-server").collection("user");
        } catch (error) {
            console.log(error);
        }
    }
}

const mongoDB = new MongoDatabase();
module.exports = mongoDB;
