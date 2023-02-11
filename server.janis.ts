import express from "express";
import { Request, Response } from "express";
import bodyparser from "body-parser";
import cors from "cors";
import multer from "multer";
import { writeFileSync, readdirSync } from "fs";
import { uuid } from "uuidv4";
import getArticlesFromFile from "./utils/getArticlesFromFile";

const app = express();

app.use(bodyparser.json());
app.use(cors({ origin: "*" }));

app.use("/static", express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.send("Application works!");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post(
  "/send-image",
  upload.single("photo"),
  (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    console.log("123", req.file);

    res.send("send-image works!");
  }
);

app.get("/articles", (req: Request, res: Response) => {
  const parseFileTextToJson = getArticlesFromFile();

  res.json(parseFileTextToJson);
});

app.get("/articles/:id", (req: Request, res: Response) => {
  const { articles } = getArticlesFromFile();

  const preferableArticle = articles.find(
    (article) => article.id === req.params.id
  );

  if (!preferableArticle) {
    res.status(404);
    res.send("Article not found!");
  }

  res.json(preferableArticle);
});

type ArticleBody = {
  title: string;
  description: string;
};

app.post(
  "/articles",
  (req: Request<null, null, ArticleBody>, res: Response) => {
    if (!req.body.title || !req.body.description) {
      res.status(400);
      res.send("Title or description is missing");
    }

    const parseFileTextToJson = getArticlesFromFile();

    const newArticle = {
      id: uuid(),
      title: req.body.title,
      description: req.body.description,
    };

    parseFileTextToJson.articles.push(newArticle);

    const articlesStringified = JSON.stringify(parseFileTextToJson);

    writeFileSync("./src/db/db.json", articlesStringified);

    res.send(newArticle);
  }
);

app.get("/all-image-link", (req, res) => {
  const files = readdirSync("public");

  const imagePaths = files.map((imagePath) => `/static/${imagePath}`);

  res.json(imagePaths);
});

app.listen(3004, () => {
  console.log("Application started on port 3004!");
});

