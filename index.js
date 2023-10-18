const {MongoClient, ServerApiVersion} = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();

// middleware
app.use(cors());
app.use(express.json());
/* mdtanim0195
SBnHpsEMCFudXDjx
 */
const port = process.env.PORT || 3000;

const uri = "mongodb+srv://mdtanim0195:dhur123@cluster0.ogpr4db.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

async function run() {
    try { // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const userCollection = client.db("userDB").collection("users");  
        // post user
        app.post("/users", async(req, res) =>{
            const user = req.body;
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.send(result);
        });
        //get user
        app.get("/users", async (req, res) =>{
            const result = await userCollection.find().toArray();
            console.log(result);
            res.send(result);
        });
        // delete user
        app.delete("/users/:id", async (req, res) =>{
            const id = req.params.id;
            console.log(id);
        });
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally { // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Card is running...");
});

app.listen(port, () => {
    console.log(`App is running on ${port}`);
});
