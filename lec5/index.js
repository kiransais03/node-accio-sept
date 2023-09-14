const express = require("express");
const mongoose = require("mongoose");
const Todo = require("./models/TodoSchema");
require("dotenv").config();
const app = express();

app.use(express.json());

const PORT = process.env.PORT;

// POST - Creating a new Todo
app.post("/todo", async (req, res) => {
  const { text, isCompleted } = req.body;

  if (text.length == 0 || isCompleted == null) {
    return res.status(400).send({
      status: 400,
      message: "Please enter the values in correct format!",
    });
  }

  try {
    const todoObj = new Todo({
      text,
      isCompleted,
    });

    await todoObj.save();

    res.status(201).send({
      status: 201,
      message: "Todo created successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Todo creation failed!",
    });
  }
});

// GET - Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todoList = await Todo.find({}).sort({ dateTime: 1 });

    res.status(200).send({
      status: 200,
      message: "Fetched all todos successfully!",
      data: todoList,
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to fetch all todos!",
    });
  }
});

app.get("/todo/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const todoData = await Todo.findById(todoId);

    res.status(200).send({
      status: 200,
      message: "Todo fetched successfully!",
      data: todoData,
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to fetch the todo!",
    });
  }
});

// DELETE - Delete a todos based on id
app.delete("/todo/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    await Todo.findByIdAndDelete(todoId);

    res.status(200).send({
      status: 200,
      message: "Todo deleted successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to delete the todo!",
    });
  }
});

// PUT - Update a todo
app.put("/todo", (req, res) => {
  Todo.findByIdAndUpdate(req.body.todoId, {
    isCompleted: req.body.isCompleted,
    text: req.body.text,
  })
    .then((res1) => {
      res.status(200).send({
        status: 200,
        message: "Todo updated successfully!",
      });
    })
    .catch((err) => {
      res.status(400).send({
        status: 400,
        message: "Failed to update the todo!",
        data: err,
      });
    });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB is connected!"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log("Server running at Port: ", PORT);
});
