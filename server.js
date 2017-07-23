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

function send_poll_email(creatorEmail, createdPollId) {

  // knex.select('*')
  // .from('poll_info')
  // .then((rows) => {
    const helper = require('sendgrid').mail;
    const toEmail = creatorEmail;
    const fromEmail = new helper.Email("PollStar@example.com");
    console.log(helper)
    const subject = "Here are your poll information";
    const content = new helper.Content("Results link: ", "http://localhost:8080/results/:", createdPollId, " ", "Voting link: ", "http://localhost:8080/voting/:", createdPollId);
    console.log(typeof content)
    const mail = new helper.Mail(fromEmail, subject, toEmail, content);
    console.log("popop", mail)
    const sg = require("sendgrid")(process.env.SENDGRID_API_KEY);
    console.log("whyyyyyyy", sg)
    const request = sg.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
      if (error) {
        console.log("Error response received", error);
      }
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    });
  // })
}

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

function insertchoice(choice, foreignkey){
  return knex('poll_result').insert({choice: choice, poll_info_id: foreignkey, weight: 0}, 'id')
  .then((results)=>{
  })
}

app.post("/summary", (req, res) => {
  const pollId = generateRandomString();
  if (req.body.email === "") {
    res.send("Please enter email first")
  } else {
    knex('poll_info').insert({name: req.body.name, email: req.body.email, pollid: pollId}, 'id')
    .then((results)=>{
      const foreignkey = results[0]
      for(let choice of req.body.choice){
      insertchoice(choice, foreignkey);
      }
    })
    .catch((error) => {
    res.send(error);
  })
  }
  send_poll_email(req.body.email,`${pollId}`)
  res.redirect(`/summary/${pollId}`)
})

// Wes' code
//   var http = require("https");

// var options = {
//   "method": "POST",
//   "hostname": "api.sendgrid.com",
//   "port": null,
//   "path": "/v3/mail/send",
//   "headers": {
//     "authorization": "Bearer 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",
//     "content-type": "application/json"
//   }
// };

// var req = http.request(options, function (res) {
//   var chunks = [];

//   res.on("data", function (chunk) {
//     chunks.push(chunk);
//   });

//   res.on("end", function () {
//     var body = Buffer.concat(chunks);
//     console.log(body.toString());
//   });
// });

// req.write(JSON.stringify({ personalizations:
//    [ { to: [ { email: 'howareyouhelen@hotmail.com', name: 'John Doe' } ],
//        subject: 'Hello, World!' } ],
//   from: { email: 'sam.smith@example.com', name: 'Sam Smith' },
//   reply_to: { email: 'sam.smith@example.com', name: 'Sam Smith' },
//   subject: 'Hello, World!',
//   content:
//    [ { type: 'text/html',
//        value: '<html><p>Hello, world!</p></html>' } ] }));
// req.end();
// })

// Summary Page
app.get("/summary/:pollId", (req, res) => {
  const userPollId = req.params.pollId;
  if (userPollId === undefined) {
    res.status(400).redirect("/")
    return
  }
  knex.select('poll_info.id', 'name', 'email', 'pollid')
    .from('poll_info')
    .where('poll_info.pollid', userPollId)
    .then((results) => {
      res.render("summary", {
        userPollKey: userPollId,
        name: results[0].name,
        email: results[0].email
      })
      // res.render(`/summary/${userPollId}`)
    })

});

//Voting Page
app.get("/voting/:pollId", (req, res) => {
  return knex.select('*').from('poll_info')
  .join('poll_result', 'poll_info.id', '=', 'poll_result.poll_info_id')
  .where('pollid', req.params.pollId)
  .then((results) => {
    console.log(results)
    if (results.length > 0) {
      res.render("voting", {
        name: results[0].name,
        results: results
      });
    } else {
      res.redirect('/');
    }
    console.log(results)
  })
  .catch((error) => {
    res.send(error);
  })
})

app.post("/results", (req, res) => {

//   knex.select('poll_info_id').from('poll_result')
//   .where('id', '=', req.body.result3)
//   .then((result)=>{
//     console.log(result[0].poll_info_id)
//   })

// const array_result = [];
// array_result.push(req.body.result)

  var result4 = req.body.result4;
  var result3 = req.body.result3;
  var result2 = req.body.result2;
  var result1 = req.body.result1;


  //Update the values in the database.

  knex.select('weight').from('poll_result')
  .where('id','=',result4)
  .then((result)=>{

    knex("poll_result").where("id",result4)
    .update({weight: (result[0].weight+4)})
    .then(function (count) {
    })
  });

  knex.select('weight').from('poll_result')
  .where('id','=',result3)
  .then((result)=>{

    knex("poll_result").where("id",result2)
    .update({weight: (result[0].weight+3)})
    .then(function (count) {
    })
  });

  knex.select('weight').from('poll_result')
  .where('id','=',result2)
  .then((result)=>{

    knex("poll_result").where("id",result2)
    .update({weight: (result[0].weight+2)})
    .then(function (count) {
    })
  });

  knex.select('weight').from('poll_result')
  .where('id','=',result1)
  .then((result)=>{

    knex("poll_result").where("id",result1)
    .update({weight: (result[0].weight+1)})
    .then(function (count) {
    })
  });
  res.send("HAHHAHAHAH THIS REALLY WORKS IN THE DB. You don't get to see the result, sorry.")
})

// Result page
app.get("/results/:pollId", (req, res) => {
  return knex.select('poll_info.id', 'name', 'choice', 'weight')
  .from('poll_result')
  .join('poll_info', 'poll_result.poll_info_id', '=', 'poll_info.id')
  .where('poll_info.pollid', req.params.pollId)
  .orderBy('weight', 'desc')
  .then((results) => {
    console.log(results)
    if (results.length > 0) {
      res.render("results", {
        name: results[0].name,
        results: results
      });
    } else {
      res.redirect('/');
    }
  })
  .catch((error) => {
    res.send("OH NO");
  })
})

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
