import express from "express";
import { MongoClient, ReturnDocument, ServerApiVersion } from "mongodb";
import admin from "firebase-admin";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(fs.readFileSync("./credentials.json"));

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});
const app = express();

app.use(express.json());

let db;
async function connectToDB() {
  const uri = process.env.MONGODB_USERNAME
    ? `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.wygkd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    : "mongodb://127.0.0.1:27017";

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();

  db = client.db("full-stack-react-db");
}

app.use(express.static(path.join(__dirname, "../dist")));

app.get(/^(?!\/api).+/, async (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});
async function connectToDb() {
  const uri = "mongodb://127.0.0.1:27017";

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();

  db = client.db("full-stack-practice");
}

app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;
  const article = await db.collection("articles").findOne({ name });
  res.json(article);
});
app.post("/api/ask-question", async (req, res) => {
  const { title, question } = req.body;
  const quest = { title, question };
  const updatedArticle = await db.collection("articles").insertOne(quest);
});
app.use(async function (req, res, next) {
  const { authtoken } = req.headers;

  if (authtoken) {
    const user = await admin.auth().verifyIdToken(authtoken);
    req.user = user;
    next();
  } else {
    res.sendStatus(400);
  }
});

app.post("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db.collection("articles").findOne({ name });

  const upvoteIds = article.upvoteIds || [];
  const downvoteIds = article.downvoteIds || [];
  const canUpvote =
    uid && !upvoteIds.includes(uid) && !downvoteIds.includes(uid);

  if (canUpvote) {
    const updatedArticle = await db.collection("articles").findOneAndUpdate(
      {
        name,
      },
      { $inc: { upvotes: 1 }, $push: { upvoteIds: uid } },
      {
        returnDocument: "after",
      }
    );
    res.json(updatedArticle);
  } else {
    res.sendStatus(403);
  }
});
app.post("/api/articles/:name/cancel-upvote", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db.collection("articles").findOne({ name });

  const upvoteIds = article.upvoteIds || [];
  const downvoteIds = article.downvoteIds || [];
  const canCancelUpvote =
    uid && upvoteIds.includes(uid) && !downvoteIds.includes(uid);

  if (canCancelUpvote) {
    const updatedArticle = await db.collection("articles").findOneAndUpdate(
      {
        name,
      },
      {
        $inc: { upvotes: -1 },
        $pull: { upvoteIds: uid },
      },
      {
        returnDocument: "after",
      }
    );
    res.json(updatedArticle);
  } else {
    res.sendStatus(403);
  }
});

app.post("/api/articles/:name/downvote", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;
  const article = await db.collection("articles").findOne({ name });
  const downvoteIds = article.downvoteIds || [];
  const upvoteIds = article.upvoteIds || [];
  const canDownvote =
    uid && !downvoteIds.includes(uid) && !upvoteIds.includes(uid);
  if (canDownvote) {
    const updatedArticle = await db.collection("articles").findOneAndUpdate(
      {
        name,
      },
      {
        $inc: { downvotes: 1 },
        $push: { downvoteIds: uid },
      },
      {
        returnDocument: "after",
      }
    );
    res.json(updatedArticle);
  } else {
    res.sendStatus(403);
  }
});
app.post("/api/articles/:name/cancel-downvote", async (req, res) => {
  const { name } = req.params;
  const { uid } = req.user;

  const article = await db.collection("articles").findOne({ name });
  const downvoteIds = article.downvoteIds || [];
  const upvoteIds = article.upvoteIds || [];

  const canCancelDownvote =
    uid && downvoteIds.includes(uid) && !upvoteIds.includes(uid);

  if (canCancelDownvote) {
    const updatedArticle = await db.collection("articles").findOneAndUpdate(
      { name },
      {
        $inc: { downvotes: -1 },
        $pull: { downvoteIds: uid },
      },
      { returnDocument: "after" }
    );
    res.json(updatedArticle);
  } else {
    res.sendStatus(403);
  }
});

app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;
  const comment = { postedBy, text };
  const updatedArticle = await db.collection("articles").findOneAndUpdate(
    { name },
    {
      $push: { comments: comment },
    },
    {
      returnDocument: "after",
    }
  );
  res.json(updatedArticle);
});

async function start() {
  await connectToDb();
  app.listen(8001, function () {
    console.log("Server is listening on port 8001");
  });
}
start();
