const User = require("../model/UserSchema");

const isUserExisting = async (username) => {
  let userData;

  try {
    userData = await User.findOne({ username });
  } catch (err) {
    console.log(err);
  }

  if (userData) {
    return true;
  } else {
    return false;
  }
};

module.exports = { isUserExisting };
