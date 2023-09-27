const { TRUE, ERR } = require("../constants");
const Blog = require("../models/Blog");

const addBlogToDB = async (blogObj) => {
  try {
    await blogObj.save();

    return TRUE;
  } catch (err) {
    return ERR;
  }
};

const getUserBlogsFromDB = async (userId, page, LIMIT) => {
  let blogsData = {
    data: null,
    err: null,
  };

  try {
    blogsData.data = await Blog.find({ userId })
      .sort({
        creationDateTime: -1,
      })
      .skip((page - 1) * LIMIT)
      .limit(LIMIT);

    return blogsData;
  } catch (err) {
    blogsData.err = err;

    return blogsData;
  }
};

const getBlogDataFromDB = async (blogId) => {
  let blogData = {
    data: null,
    err: null,
  };

  try {
    blogData.data = await Blog.findOne({ _id: blogId });

    return blogData;
  } catch (err) {
    blogData.err = err;
    return blogData;
  }
};

const deleteBlogFromDB = async (blogId) => {
  try {
    await Blog.findByIdAndDelete(blogId);

    return TRUE;
  } catch (err) {
    return ERR;
  }
};

module.exports = {
  addBlogToDB,
  getUserBlogsFromDB,
  getBlogDataFromDB,
  deleteBlogFromDB,
};
