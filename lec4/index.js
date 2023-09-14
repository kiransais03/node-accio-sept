const express = require("express");
const fs = require("fs");
const app = express();

const PORT = 8001;

app.use(express.json());

app.get("/todo/:id", (req, res) => {
  try {
    const todoId = req.params.id;

    const fileData = JSON.parse(fs.readFileSync("./database.json").toString());
    const todoList = fileData.todos;

    let todoWithId = todoList.filter((todo) => todo.id == todoId);
    res.status(200).send({
      status: 200,
      message: "Todo with id fetched successfully!",
      data: todoWithId[0],
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to fetch a todo!",
    });
  }
});

// GET - Get all Todos
app.get("/todos", (req, res) => {
  try {
    const fileData = JSON.parse(fs.readFileSync("./database.json").toString());
    const todos = fileData.todos;

    res.status(200).send({
      status: 200,
      message: "Fetched all todos successfully!",
      data: todos,
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to get all todos!",
    });
  }
});

// POST - Create a Todo
app.post("/todo", (req, res) => {
  try {
    const newTodo = {
      id: req.body.id,
      text: req.body.text,
      date: new Date(),
      isCompleted: req.body.isCompleted,
    };

    let fileData = JSON.parse(fs.readFileSync("./database.json").toString());
    fileData.todos.push(newTodo);

    fs.writeFileSync("./database.json", JSON.stringify(fileData));
    res.status(201).send({
      status: 201,
      message: "Todo is successfully created!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to create a todo!",
    });
  }
});

// PUT - Update a todo
app.put("/todo", (req, res) => {
  try {
    const todoId = req.body.id;
    const updatedBody = req.body;

    let fileData = JSON.parse(fs.readFileSync("./database.json").toString());
    let todoList = fileData.todos;

    for (let i = 0; i < todoList.length; i++) {
      if (todoList[i].id == todoId) {
        fileData.todos[i] = updatedBody;
        break;
      }
    }

    fs.writeFileSync("./database.json", JSON.stringify(fileData));
    res.status(200).send({
      status: 200,
      message: "Todo updated successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: 200,
      message: "Failed to update a todo!",
    });
  }
});

// DELETE - Delete a todo
app.delete("/todo/:id", (req, res) => {
  try {
    const todoId = parseInt(req.params.id);

    let fileData = JSON.parse(fs.readFileSync("./database.json").toString());
    let todoList = fileData.todos;

    let listOfTodosAfterDeleting = todoList.filter((todo) => todo.id != todoId);

    fileData.todos = listOfTodosAfterDeleting;

    fs.writeFileSync("./database.json", JSON.stringify(fileData));
    res.status(200).send({
      status: 200,
      message: "Todo deleted successfully!",
    });
  } catch (err) {
    res.send(400).send({
      status: 400,
      message: "Failed to delete a todo!",
      data: err,
    });
  }
});

app.listen(PORT, () => {
  console.log("Server is running at port:", PORT);
});
