import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import formatDateAndTime from "../../DateTimeUtils";
import axios from "axios";

function BlogCard({ props, setMyBlogs, myBlogs }) {
  const token = localStorage.getItem("token");
  const handleDeleteBlog = (blogId) => {
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/blog/delete-blog/${blogId}`,
        {
          headers: {
            "X-Acciojob": token,
          },
        }
      )
      .then((res) => {
        if (res.data.status === 200) {
          alert(res.data.message);

          const myBlogsNew = myBlogs.filter((blog) => blog._id !== blogId);
          setMyBlogs(myBlogsNew);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <Card style={{ width: "100%", marginBottom: "25px" }}>
      <Card.Body>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Card.Title>{props.title}</Card.Title>
          <Card.Text>
            {formatDateAndTime(new Date(props.creationDateTime))}
          </Card.Text>
        </div>

        <Card.Text>{props.textBody}</Card.Text>
        <Button variant="primary" style={{ marginRight: "15px" }}>
          Edit Blog
        </Button>
        <Button variant="danger" onClick={() => handleDeleteBlog(props._id)}>
          Delete Blog
        </Button>
      </Card.Body>
    </Card>
  );
}

export default BlogCard;
