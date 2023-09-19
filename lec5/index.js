const express = require("express");
const mongoose = require("mongoose");
const Todo = require("./models/TodoSchema");
require("dotenv").config();
const app = express();
const bcrypt = require("bcrypt");
const { isUserExisting } = require("./utils/UsernameCheck");
const User = require("./models/UserSchema");
const { LoggerMiddleware } = require("./middleware/LoggerMiddleware");
const { isAuth } = require("./middleware/AuthMiddleware");
const jwt = require("jsonwebtoken");

app.use(LoggerMiddleware);
app.use(express.json());

const PORT = process.env.PORT;

const SALT_ROUNDS = 15;

app.get("/hello", (req, res) => {
  res.send("Hello world!");
});

// POST - Register User
app.post("/register", async (req, res) => {
  const userBody = req.body;
  const isUser = await isUserExisting(userBody.username);

  if (isUser) {
    return res.status(400).send({
      status: 400,
      message: "User already exists!",
    });
  }

  const hashedPassword = await bcrypt.hash(userBody.password, SALT_ROUNDS);
  const userObj = new User({
    name: userBody.name,
    username: userBody.username,
    password: hashedPassword,
    email: userBody.email,
    age: userBody.age,
    gender: userBody.gender,
  });
  try {
    await userObj.save();

    res.status(201).send({
      status: 201,
      message: "User created successfully!",
    });
  } catch (err) {
    res.status(400).send({
      status: 400,
      message: "Failed to register user!",
    });
  }
});

// POST - Login User
app.post("/login", async (req, res) => {
  const loginBody = req.body;
  let userData;

  try {
    userData = await User.findOne({ username: loginBody.username });
  } catch (err) {
    return res.status(400).send({
      status: 400,
      messsage: "User fetching failed!",
    });
  }

  let isPasswordSame;

  try {
    isPasswordSame = await bcrypt.compare(
      loginBody.password,
      userData.password
    );
  } catch (err) {
    return res.status(400).send({
      status: 400,
      messsage: "Bcrypt failed!",
    });
  }

  let payload = {
    name: userData.name,
    username: userData.username,
    email: userData.email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

  if (isPasswordSame) {
    return res.status(200).send({
      status: 200,
      message: "Successfully logged in!",
      token: token,
    });
  } else {
    return res.status(400).send({
      status: 400,
      message: "Incorrect password, please re-enter!",
    });
  }
});

// POST - Creating a new Todo
app.post("/todo", isAuth, async (req, res) => {
  const { text, isCompleted, username } = req.body;

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
      username,
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

// GET - Get all todos for a username
app.get("/todos/:username", isAuth, async (req, res) => {
  const username = req.params.username;
  const page = req.query.page || 1;
  const LIMIT = 5;

  //page=3

  try {
    const todoList = await Todo.find({ username })
      .sort({ dateTime: 1 })
      .skip((parseInt(page) - 1) * LIMIT)
      .limit(LIMIT);

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

app.get("/todo/:id", isAuth, async (req, res) => {
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
app.delete("/todo/:id", isAuth, async (req, res) => {
  const todoId = req.params.id;

  try {
    const todoData = await Todo.findById(todoId);
    if (todoData.username !== req.local.username) {
      return res.status(400).send({
        status: 400,
        message: "Not allowed to deleted the todo as you are not the owner!",
      });
    }
  } catch (err) {
    res.status(500).send({
      status: 500,
      message: "Internal Server Error!",
    });
  }

  try {
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
app.put("/todo", isAuth, (req, res) => {
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
