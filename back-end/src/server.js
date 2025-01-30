import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import admin from "firebase-admin";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase setup
const credentials = JSON.parse(fs.readFileSync("./credentials.json"));
admin.initializeApp({ credential: admin.credential.cert(credentials) });

// Express setup
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
const uri =
  "mongodb+srv://practice-full-stack-react-server:peciPWJVpMMU8wwS@cluster0.d3kce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let db;

async function connectToDB() {
  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();
    db = client.db("practice-full-stack-react-db");
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

await connectToDB(); // Ensure DB connection before using it

// Serve static files from React frontend (optional)
app.use(express.static(path.join(__dirname, "../dist")));

// Routes
app.get("/api/articles/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const article = await db.collection("articles").findOne({ name });
    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/articles/:name/upvote", async (req, res) => {
  try {
    const { name } = req.params;
    const { uid } = req.body;

    const article = await db.collection("articles").findOne({ name });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const upvoteIds = article.upvoteIds || [];
    if (!upvoteIds.includes(uid)) {
      const updatedArticle = await db
        .collection("articles")
        .findOneAndUpdate(
          { name },
          { $inc: { upvotes: 1 }, $push: { upvoteIds: uid } },
          { returnDocument: "after" }
        );
      res.json(updatedArticle);
    } else {
      res.status(403).json({ error: "Already upvoted" });
    }
  } catch (error) {
    console.error("Error in upvote:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Comment API
app.post("/api/articles/:name/comments", async (req, res) => {
  try {
    const { name } = req.params;
    const { postedBy, text } = req.body;

    const comment = { postedBy, text };
    const updatedArticle = await db
      .collection("articles")
      .findOneAndUpdate(
        { name },
        { $push: { comments: comment } },
        { returnDocument: "after" }
      );

    res.json(updatedArticle);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Export handler for Vercel
export default app;
