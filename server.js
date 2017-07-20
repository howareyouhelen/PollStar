"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/test_result");

function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/test_result", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/summary", (req, res) => {
  // const pollId = generateRandomString();
  const pollId = "1234";
  res.redirect("/summary/:pollId")
})

// Summary Page
app.get("/summary/:pollId", (req, res) => {
  let userPollId = req.params.pollId;
  if (userPollId === undefined) {
    res.status(400).redirect("/")
  } else {
    // res.render("summary/:pollId")
    res.send("haaskdjfh")
  }
});

// Voting page
app.get("/voting/:pollId", (req, res) => {
  let userPollId = req.params.pollId;
  if (userPollId === undefined) {
    res.status(400).redirect("/")
  } else {
    res.render("voting/:pollId", {})
  }
});

app.post("/results/:pollId", (req, res) => {
  //push form into DB here
  res.send("haha results page not done yet")
})

// Result page
app.get("/results/:pollId", (req, res) => {
  //display info from DB
  res.send("hello")
})



// app.get('/poll_info', (req, res) => {
//   res.json({
//     id: 1,
//     email: 'joel@joel.joel',
//     name: 'joel'
//   })
// })

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
