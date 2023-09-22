const UserSchema = require("../models/User");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { TRUE, ERR } = require("../constants");
const {
  verifyUsernameAndEmailExisits,
} = require("../utils/verifyEmailUsername");

// POST - Register User
const registerUser = async (req, res) => {
  // Data validation
  const isValid = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().min(3).max(30).alphanum().required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
  }).validate(req.body);

  if (isValid.error) {
    return res.status(400).send({
      status: 400,
      message: "Invalid Input",
      data: isValid.error,
    });
  }

  // Checking whether we have any username or email already exisiting in our DB
  const isUserExisiting = await verifyUsernameAndEmailExisits(email, username);

  if (isUserExisiting === TRUE) {
    return res.status(400).send({
      status: 400,
      message: "Email or Username already exists.",
    });
  } else if (isUserExisiting === ERR) {
    return res.status(400).send({
      status: 400,
      message: "Err: verifyUsernameAndEmailExisits failed",
    });
  }
};

module.exports = { registerUser };
