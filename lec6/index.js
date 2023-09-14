const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const app = express();
const { isUserExisting } = require("./utils/UsernameCheck");
const User = require("./model/UserSchema");

app.use(express.json());

const PORT = process.env.PORT;
const SALT_ROUNDS = 15;

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
    res.status(400).send({
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
    res.status(400).send({
      status: 400,
      messsage: "Bcrypt failed!",
    });
  }

  if (isPasswordSame) {
    res.status(200).send({
      status: 200,
      message: "Successfully logged in!",
    });
  } else {
    res.status(400).send({
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
