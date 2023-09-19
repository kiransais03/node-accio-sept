const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const app = express();
const { isUserExisting } = require("./utils/UsernameCheck");
const User = require("./model/UserSchema");
const { LoggerMiddleware } = require("./middleware/LoggerMiddleware");
const { isAuth } = require("./middleware/AuthMiddleware");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(LoggerMiddleware);

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

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB is connected!"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log("Server running at port: ", PORT);
});
