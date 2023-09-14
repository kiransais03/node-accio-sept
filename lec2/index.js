const express = require("express");
const app = express();
const cors = require("cors");

//middleware
app.use(express.json());
app.use(cors());

const PORT = 8001;

// ------- Below is the implementation using Query for passing in the data

app.get("/add", (req, res) => {
  const num1 = Number(req.query.num1);
  const num2 = Number(req.query.num2);

  const sum = num1 + num2;

  res.send(`Your sum is: ${sum}`);
});

// --------- Below is the implementation using Params for passing in the data ---------

// Addition call
app.get("/add/:num1/:num2", (req, res) => {
  const num1 = Number(req.params.num1);
  const num2 = Number(req.params.num2);

  const sum = num1 + num2;

  res.send(`Your sum is: ${sum}`);
});

// Addition call
app.post("/subtract/:num1/:num2", (req, res) => {
  const num1 = Number(req.params.num1);
  const num2 = Number(req.params.num2);

  const difference = num1 - num2;

  res.send(`Your difference is: ${difference}`);
});

// Multiply call
app.get("/multiply/:num1/:num2", (req, res) => {
  const num1 = Number(req.params.num1);
  const num2 = Number(req.params.num2);

  const product = num1 * num2;

  res.send(`Your product is: ${product}`);
});

// Divide call
app.get("/divide/:num1/:num2", (req, res) => {
  const num1 = Number(req.params.num1);
  const num2 = Number(req.params.num2);

  if (num2 === 0) {
    return res.status(400).send(`Err: Please enter a number greater than 0`);
  }

  //----- Below is the implementation of calculator api using body to send data ------

  // // Addition call
  // app.post("/add", (req, res) => {
  //   const num1 = req.body.num1;
  //   const num2 = req.body.num2;

  //   const sum = num1 + num2;

  //   res.send(`Your sum is: ${sum}`);
  // });

  // // Addition call
  // app.post("/subtract", (req, res) => {
  //   const num1 = req.body.num1;
  //   const num2 = req.body.num2;

  //   const difference = num1 - num2;

  //   res.send(`Your difference is: ${difference}`);
  // });

  // // Multiply call
  // app.post("/multiply", (req, res) => {
  //   const num1 = req.body.num1;
  //   const num2 = req.body.num2;

  //   const product = num1 * num2;

  //   res.send(`Your product is: ${product}`);
  // });

  // // Divide call
  // app.post("/divide", (req, res) => {
  //   const num1 = req.body.num1;
  //   const num2 = req.body.num2;

  //   if (num2 === 0) {
  //     return res.status(400).send(`Err: Please enter a number greater than 0`);
  //   }

  const qoutient = num1 / num2;

  res.status(200).send(`Your qoutient is: ${qoutient}`);
});

app.listen(PORT, () => {
  console.log("Server is running at port:", PORT);
});
