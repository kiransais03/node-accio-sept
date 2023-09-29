import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../components/Blogs/BlogCard";

function MyBlogs() {
  const [myBlogs, setMyBlogs] = useState();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/blog/get-user-blogs`, {
        headers: {
          "X-Acciojob": token,
        },
      })
      .then((res) => {
        setMyBlogs(res.data.data);
      })
      .catch((err) => {
        alert(err);
      });
  }, [token]);

  return (
    <div style={{ padding: "3rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>My Blogs</h1>
      {myBlogs?.map((blog) => (
        <BlogCard props={blog} setMyBlogs={setMyBlogs} myBlogs={myBlogs} />
      ))}
    </div>
  );
}

export default MyBlogs;
