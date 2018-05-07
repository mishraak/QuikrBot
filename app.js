const http = require('http');
const express = require('express');
const mongo = require('./routes/mongo');
const config = require('./config')
const T = require('./config/twit.js')
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const tweetWrite = require('./routes/tweetWrite');
const ibm = require('./routes/watson')
const fakeResponse = require('./config/fakeResponse');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

//#testingtesting Robbery at San Jose, CA Testing 17


app.use(bodyParser.json());

/*
const testResponse = require('./routes/response');
testResponse.test('988159275393404928',"<b>test4</b>");
*/

app.get('/form', function (req, res) {
  var html='';
  html +="<body>";
  html += "<center><form action='/thank'  method='post' name='form1' style={margin-top: 100px}>";
  html += "Screen Name <br> <input type= 'text' name='screen_name'><br>";
  html += "Email<br> <input type='text' name='email'><br>";
  html += "<input type='submit' value='submit'>";
  html += "<input type='reset'  value='reset'>";
  html += "</form></center>";
  html += "</body>";
  res.send(html);
});
 
app.post('/thank', urlencodedParser, function (req, res){
  var reply='';
  reply += "Your name is " + req.body.screen_name;
  reply += "Your E-mail id is " + req.body.email;   

  mongo.connect(config.MONGO_URL, function(){
      var user = {
        screen_name : req.body.screen_name,
        email : req.body.email
      };

      var coll = mongo.collection('users2');
      coll.insert(user, function(err, user){
          if(err) {
              console.log("user data could not be inserted successfully");
              json_responses = {"statusCode" : 402};
          }
          else {
            console.log("user data inserted successfully");
              json_responses = {"statusCode" : 200};
          }
      });
  });


  res.send(reply);
 });


app.get('/fakeTwitter', function(req, res){    
  res.send(fakeResponse);
})


function  fakeStubAPI(){
  request(
      'http://localhost:8000/fakeTwitter', 
      function (error, response, body) {
          tweetWrite.validateTweet(JSON.parse(body).statuses[0], function(validTweet, id_str){         
            if(validTweet.length <1){
               tweetWrite.insertTweetInDatabase(JSON.parse(body).statuses[0]);               
              ibm.analyzeText(id_str);
            }     
          });    
      })
}



function realAPI() {  
  T.get('search/tweets', { 
          q: config.HASHTAG, 
          count: 1,          
        }, 
        function(err, data, response) {                 
          if( data != null && data.statuses != null && data.statuses.length != 0){               
            tweetWrite.validateTweet(data.statuses[0], function(validTweet, id_str){                        
              if(validTweet.length <1){                
                //console.log(data.statuses[0].user.screen_name);
                tweetWrite.insertTweetInDatabase(data.statuses[0]);                
                ibm.analyzeText(id_str, data.statuses[0].text.replace(config.HASHTAG, ""), data.statuses[0].user.screen_name);
              }
            });
          }
  })
}

//ibm.sendMail('@omisharma115');

setInterval(function(){      
  realAPI();
  //fakeStubAPI();  
}, config.POLLING_INTERVAL);


http.createServer(app).listen(process.env.PORT || 8000, function(){
    console.log('Express Server listening at port:' + 8000);
});  
