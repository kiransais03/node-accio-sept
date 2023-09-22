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

app.post("/add-column", (req, res) => {
  const { columnName, datatype, checks } = req.body;

  let query = `ALTER TABLE todos ADD ${columnName} ${datatype} ${checks}`;

  db.query(query, (err, result) => {
    if (err) throw err;
    res.status(200).send({
      message: "New column added successfully!",
    });
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

// GET - Getting all todos for a user
app.get("/todos/:username", (req, res) => {
  const username = req.params.username;
  const page = parseInt(req.query.page) || 1;
  const LIMIT = 2;

  let query = `SELECT * FROM todos WHERE username='${username}' ORDER BY id LIMIT ${
    LIMIT * (page - 1)
  }, ${LIMIT}`;

  db.query(query, (err, result) => {
    if (err) throw err;
    res.status(200).send({
      data: result,
    });
  });
});

// GET - Get a todo based on an id
app.get("/todo/:username/:id", (req, res) => {
  const username = req.params.username;
  const todoId = parseInt(req.params.id);

  let query = `SELECT * FROM todos WHERE id=${todoId}`;

  db.query(query, (err, result) => {
    if (err) throw err;
    if (result[0].username === username) {
      res.status(200).send({
        data: result[0],
      });
    } else {
      res.status(400).send({
        message:
          "Not allowed to perform this operation, as you are not allowed to access the resource.",
      });
    }
  });
});

// PUT - Updating a todo based on id
app.put("/todo/:username/:id", (req, res) => {
  const username = req.params.username;
  const todoId = req.params.id;

  let query = `SELECT * FROM todos WHERE id=${todoId}`;

  db.query(query, (err, result) => {
    if (err) throw err;
    if (result[0].username === username) {
      let query1 = "UPDATE todos SET ";

      if (req.body.isCompleted) {
        query1 += `isCompleted=${req.body.isCompleted} `;
      }

      if (req.body.text) {
        query1 += `text='${req.body.text} '`;
      }

      query1 += `WHERE id=${todoId}`;

      db.query(query1, (err, result) => {
        if (err) throw err;
        res.status(200).send({
          message: "Todo updated successfully!",
        });
      });
    } else {
      res.status(401).send({
        message:
          "Not allowed to perform this operation, as you are not allowed to access the resource.",
      });
    }
  });
});

// DELETE - Delete a todo based on id
app.delete("/todo/:username/:id", (req, res) => {
  const username = req.params.username;
  const todoId = parseInt(req.params.id);

  let query = `SELECT * FROM todos WHERE id=${todoId}`;

  db.query(query, (err, result) => {
    if (err) throw err;
    if (result[0].username === username) {
      let query1 = `DELETE FROM todos WHERE id=${todoId}`;

      db.query(query1, (err, result) => {
        if (err) throw err;
        res.status(200).send({
          message: "Todo successfully deleted!",
        });
      });
    } else {
      res.status(400).send({
        message:
          "Not allowed to perform this operation, as you are not allowed to access the resource.",
      });
    }
  });
});

app.listen(PORT, () => {
  console.log("Server running at port: ", PORT);
});
