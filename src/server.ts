import express from "express";
import mysql from "mysql2";
import { Request, Response } from "express";
import bodyparser from "body-parser";
import cors from "cors";

const app = express();

app.use(bodyparser.json());
app.use(cors({ origin: "*" }));
app.use("/static", express.static("public"));

//datu paņešana
app.get("/", (req: Request, res: Response) => {
  pool.query("SELECT * FROM posts", (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

//get visi posti
app.get("/posts", (req: Request, res: Response) => {
  pool.query("SELECT * FROM posts", (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// single post
app.get("/posts/:id", (req: Request, res: Response) => {
  const postId = req.params.id;
  pool.query(`SELECT * FROM posts WHERE id=${postId}`, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.listen(3004, () => {
  console.log("Application started on port 3004!");
});

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "123456",
  database: "wisdomBlog",
  port: 3306,
});
