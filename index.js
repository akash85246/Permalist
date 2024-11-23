import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 3000;



const db=new pg.Client({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: 5432,
});

db.connect(); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));


app.get("/",async (req, res) => {
  const result = await db.query("SELECT * FROM items ORDER BY id DESC");
  const items = result.rows; 
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add",async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  const{updatedItemId, updatedItemTitle}=req.body;
  db.query("UPDATE items SET title=$1 WHERE id=$2",[updatedItemTitle,updatedItemId]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
const {deleteItemId}=req.body;
await db.query("DELETE FROM items WHERE id=$1",[deleteItemId]);
res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
