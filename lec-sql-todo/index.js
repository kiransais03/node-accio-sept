const express = require("express");
const mysql = require("mysql");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});

db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("DB Connected!");
  }
});

app.get("/create-table", (req, res) => {
  let query =
    "CREATE TABLE IF NOT EXISTS todos(id int primary key auto_increment, isCompleted bool not null, username varchar(25) not null)";

  db.query(query, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// POST - Adding a todo for a user
app.post("/todo", (req, res) => {
  const { text, isCompleted, username } = req.body;
  let query = `INSERT INTO todos(text, isCompleted, username) VALUES('${text}', ${isCompleted}, '${username}')`;

  db.query(query, (err, result) => {
    if (err) throw err;
    res.status(201).send("Todo created successfully!");
  });
});

app.listen(PORT, () => {
  console.log("Server running at port: ", PORT);
});
