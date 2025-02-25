require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let dbClient;

async function connectToMongo() {
  try {
    const client = await MongoClient.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    dbClient = client;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectToMongo();

app.get("/", (req, res) => {
  res.render("index", {
    challenges: ["lab1", "lab2", "lab3", "lab4"],
  });
});

app.get("/lab1", (req, res) => {
  res.render("lab1");
});

app.post("/api/lab1/login", async (req, res) => {
  try {
    const db = dbClient.db(process.env.LAB1_DB);
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await db.collection("users").findOne({ username, password });

    if (user) {
      res.json({
        success: true,
        user: { username: user["username"], role: user["role"] },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/lab2", (req, res) => {
  res.render("lab2");
});

app.post("/api/lab2/products", async (req, res) => {
  try {
    const aggregationPipeline = req.body;

    if (!Array.isArray(aggregationPipeline)) {
      return res
        .status(400)
        .json({ error: "Invalid aggregation pipeline format." });
    }

    const db = dbClient.db(process.env.LAB1_DB);
    const products = db.collection("products");

    const results = await products.aggregate(aggregationPipeline).toArray();
    res.json(results);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/lab3", (req, res) => {
  res.render("lab3");
});

app.post("/api/lab3/login", async (req, res) => {
  try {
    const db = dbClient.db(process.env.LAB1_DB);
    const { username, password } = req.body;

    const query = {
      $where: `return (this.username == '${username}' && this.password == '${password}')`,
    };

    const user = await db.collection("users").findOne(query);

    if (user) {
      res.json({
        success: true,
        user: { username: user["username"], role: user["role"] },
      });
    } else {
      res.status(401).json({ success: false, message: "Credenziali errate" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/lab4", (req, res) => {
  res.render("lab4");
});

app.post("/api/lab4/checkFlag", async (req, res) => {
  try {
    const db = dbClient.db(process.env.LAB1_DB);
    const { flag } = req.body;

    const query = {
      $where: `return (this.flag == '${flag}')`,
    };

    const result = await db.collection("flags").findOne(query);

    console.log(result);

    if (result) {
      res.json({ success: true, message: "Flag corretta!" });
    } else {
      res.json({ success: false, message: "Chi può dirlo?" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});