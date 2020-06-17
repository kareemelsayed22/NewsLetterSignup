//jshint esversion: 6


const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});



app.post("/", function(req, res){

  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const email = req.body.email;

  //mailchimp.com/references/lists/list-id
  const data = {
      members: [
        {
          email_address:  email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstname,
            LNAME: lastname
          }
        }
      ]
  };
  const jsonData = JSON.stringify(data);  //turn data in form of string JSON

  const url =  'https://us10.api.mailchimp.com/3.0/lists/7a9f81bf73';
  // 'https://usX.api.mailchimp.com/3.0/lists/7a9f81bf73 X is some number

  // create some options as javascript options
  // auth is the API Key
  const options = {
    method:"POST",
    auth: "kareem1:3dbbf9ff73b6f7b851209faba6bff743-us10"
  };

  //Make request
  const request = https.request(url, options, function(response) {

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();


});

app.post("/failure",function(req,res){
  res.redirect("/");
});
//no longer local host port 3000
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000!");
});
// API Key: 3dbbf9ff73b6f7b851209faba6bff743-us10
// for API key replace X with the number that is after -usSomenumber
// List ID: 7a9f81bf73
