const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
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
        const cartCollection = client.db("cartDB").collection("cart");

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
        // get product with id
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;

            const query = {
                _id: new ObjectId(id)
            };

            const product = await productCollection.findOne(query);
            res.send(product);
        });
        // update or put the product
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const product = req.body;
            console.log(id, product);
            // send in db
            const filter = {
                _id: (id)
            };
            const options = {upsert: true }
            const updateProduct = {
                $set: {
                    productName: product.productName,
                    category:product.category,
                    price:product.price, 
                    rating:product.rating, 
                    shortDescription:product.shortDescription, 
                    brandName:product.brandName, 
                    image:product.image
                }
            }
            const result = await productCollection.updateOne(filter, updateProduct, options);
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
        app.post("/cart", async (req, res) => {
            const cart = req.body;
            console.log(cart);
            const result = await cartCollection.insertOne(cart);
            res.send(result);
        });
        // get cart
        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        // delet cart
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            console.log('delte', id);
            const query = {
                _id: (id)
            }
            const result = await cartCollection.deleteOne(query);
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
