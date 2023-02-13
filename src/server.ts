import express from "express";
import mysql from "mysql2";
import { Request, Response } from "express";
import bodyparser from "body-parser";
import cors from "cors";

const app = express();

app.use(bodyparser.json());
app.use(cors({ origin: "*" }));
app.use("/static", express.static("public"));

//conection test
app.get("/", (req: Request, res: Response) => {
  pool.query("SELECT * FROM posts", (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

// getting single post
app.get("/posts/:id", (req: Request, res: Response) => {
  const postId = req.params.id;
  pool.query(`SELECT * FROM posts WHERE id = ?`, [postId], (error, results) => {
    if (error) throw error;
    res.send(results[0]);
  });
});

//get all posts
app.get("/posts", (req: Request, res: Response) => {
  pool.query("SELECT * FROM posts", (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

//add new post
app.post("/posts", (req: Request, res: Response) => {
  const { author, title, content } = req.body;
  pool.query(
    `INSERT INTO posts (author, title, content) VALUES (?, ?, ?)`,
    [author, title, content],
    (error, results) => {
      if (error) {
        res.send({ error: "An error occurred while adding the post." });
        return;
      }
      res.send(results);
    }
  );
});

//delete selected post
app.delete("/posts/:id", (req: Request, res: Response) => {
  const postId = req.params.id;
  pool.query(`DELETE FROM posts WHERE id = ?`, [postId], (error) => {
    if (error) {
      res
        .status(500)
        .send({ error: "An error occurred while deleting the post." });
      return;
    }
    res.send({ message: "Post deleted successfully." });
  });
});

// app.put("/posts/:id", (req: Request, res: Response) => {
//   const postId = req.params.id;
//   const { title, content } = req.body;
//   pool.query(
//     `UPDATE posts SET title = ?, content = ? WHERE id = ?`,
//     [title, content, postId],
//     (error, results) => {
//       if (error) {
//         res.status(500).send({ error: "An error occurred while updating the post." });
//         return;
//       }
//       res.send({ message: "Post updated successfully." });
//     }
//   );
// });

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
