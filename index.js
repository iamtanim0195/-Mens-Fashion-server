const {MongoClient, ServerApiVersion} = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${
    process.env.DB_USER
}:${
    process.env.DB_PASS
}@cluster0.ogpr4db.mongodb.net/?retryWrites=true&w=majority`;

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
        // collection
        const productCollection = client.db("productDB").collection("product");
        const userCollection = client.db("userDB").collection("user");
        const userAddToCartCollection = client.db("userAddToCartDB").collection("userAddToCart");

        // post product
        app.post("/product", async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);

        });
        // get product
        app.get('/product', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        // delete user
        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
        });
        // user api
        app.post("/user", async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });
        // add cart to user db
        app.post("/userAddToCart", async (req, res) => {
            const userAddToCart = req.body;
            console.log(userAddToCart);
            const result = await userAddToCartCollection.insertOne(userAddToCart);
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// rooot
app.get("/", (req, res) => {
    res.send("Card is running...");
});

app.listen(port, () => {
    console.log(`App is running on ${port}`);
});
