require("dotenv").config({ path: ".env" });
const { MongoClient } = require("mongodb");
console.log(process.env.MONGODB_URI);

async function setupLab1() {
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.LAB1_DB;

  try {
    const client = await MongoClient.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db(dbName);

    // Elimina la collezione 'users' se esiste
    try {
      await db.collection("users").drop();
      console.log("Collezione 'users' eliminata (se esisteva).");
    } catch (err) {
      if (err.codeName === "NamespaceNotFound") {
        console.log(
          "Collezione 'users' non trovata, nessuna eliminazione necessaria.",
        );
      } else {
        console.error(
          "Errore durante l'eliminazione della collezione 'users':",
          err,
        );
      }
    }
    
    // Inserisci i dati
    const usersCollection = db.collection("users");
    const usersToInsert = [
      { _id: 1, username: "alice", password: "password1", role: "admin" },
      { _id: 3, username: "bob", password: "password2", role: "user" },
      { _id: 4, username: "tizio", password: "password3", role: "user" },
      { _id: 5, username: "caio", password: "password3", role: "user" },
      { _id: 6, username: "sempronio", password: "password3", role: "admin" }
    ];

    let result = await usersCollection.insertMany(usersToInsert);
    console.log(`Inserted ${result.insertedCount} users.`);

    try {
      await db.collection("products").drop();
      console.log("Collezione 'products' eliminata (se esisteva).");
    } catch (err) {
      if (err.codeName === "NamespaceNotFound") {
        console.log(
          "Collezione 'products' non trovata, nessuna eliminazione necessaria.",
        );
      } else {
        console.error(
          "Errore durante l'eliminazione della collezione 'products':",
          err,
        );
      }
    }

    const productsCollection = db.collection("products");
    const productsToInsert = [
      { _id: 1, name: "USB Type C Cable", inStock: true, price: 10 },
      { _id: 2, name: "USB B Cable", inStock: false, price: 2 },
      { _id: 3, name: "USB B micro Cable", inStock: false, price: 1 },
    ];

    result = await productsCollection.insertMany(productsToInsert);
    console.log(`Inserted ${result.insertedCount} products.`);

    try {
      await db.collection("flags").drop();
      console.log("Collezione 'flags' eliminata (se esisteva).");
    } catch (err) {
      if (err.codeName === "NamespaceNotFound") {
        console.log(
          "Collezione 'flags' non trovata, nessuna eliminazione necessaria.",
        );
      } else {
        console.error(
          "Errore durante l'eliminazione della collezione 'flags':",
          err,
        );
      }
    }

    const flagsCollection = db.collection("flags");
    const flagsToInsert = [
      { flag: "nOSQ1_B11ND_INJeCTIOn" }
    ];

    result = await flagsCollection.insertMany(flagsToInsert);
    console.log(`Inserted ${result.insertedCount} flags.`);

    await client.close();
  } catch (err) {
    console.error("Error setting up lab:", err);
  }
}

setupLab1();
