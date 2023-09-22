const User = require("../models/User");

const findUsersWithEmailOrUsername = async (email, username) => {
  let userData = {
    data: null,
    err: null,
  };
  try {
    // DB call to find if any records exists with the email and username given
    userData.data = await User.find({ $or: [{ email }, { username }] });

    return userData;
  } catch (err) {
    userData.err = err;
    return userData;
  }
};

module.exports = { findUsersWithEmailOrUsername };
