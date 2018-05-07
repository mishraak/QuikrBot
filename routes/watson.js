const NLP = require('../config/nlp-api-keys');
var config = require('../config/index.js');
const featuresList = require('../config/nlp-features');
var mongo = require('./mongo');
var Client = require('node-rest-client').Client;
var client = new Client();
var T = require('../config/twit.js')
const request = require('request');

function callDubeyAPI(id_str, params, cb){    
  client.post(config.REC_ENGINE_URL, params, function (data, response) {    
    cb(id_str, data);   
  });
}


//exports.sendMail =function(screen_name,tweetText){
function sendMail(screen_name,tweetText){
  console.log("screen_name " + screen_name);
  mongo.connect(config.MONGO_URL, function(){
      var coll = mongo.collection('users2');
      coll.find({"screen_name": screen_name}).toArray(function(err, users_list){
        if(err) return;
        if(users_list.length===0) return;
      console.log("users_list");
      console.log(users_list);      
          var args = {
            data: { 
                  "title": tweetText,
                  "subject": "Please provide the feedback.",
                  "body": "Did our response help you?",
                  "recipients": users_list[0].email,
                  "user": { 
                        "credits": 0,
                          "_id": "5a63c4e6c9de713eb3174406",
                          "googleId": "110257804128313869472",
                          "__v": 0 
                  }
            },
            headers: { "Content-Type": "application/json" }
        };        
        
        if(!err){
          client.post("http://localhost:5000/api/surveys/node", args, function (data, response) {    
            console.log("\n\n\n\n\n\n" + response + "\n\n\n\n\n\n");
          });            
        }
      });
  });  
}


exports.analyzeText = function (id_str, tweetText, screen_name) {    
  var parameters = {
    'text': tweetText,
    'features': featuresList
  }

  NLP.analyze(parameters, function(err, response) {
    if (err)
      console.log('error:', err);
    else {  
        //console.log(JSON.stringify(response, null, 2));
        var entities = response.entities;
        var entityArray = {};

        for(let e of entities){
            if(e.type=="Location"){
                entityArray[e.type] = e.text;
            }
            else
                entityArray["type"] = e.type;
        }
        mongo.connect(config.MONGO_URL, function(){
            
            var coll = mongo.collection('tweets');
            coll.update({"id_str":id_str}, {$set:{"entities":entityArray}},function(err, tweet){                            
              var myParams = {
                  data : {
                    "entities" : entityArray
                  },
                  headers : {
                    "x-api-key" : config.REC_ENGINE_API_KEY,
                    "Content-Type" : "application/json" 
                  }
              }

              callDubeyAPI(id_str, myParams, function(id_str, data){       
              console.log("HAMARA DATA YAHi HAI");
              console.log(data);                               
                  var params = {
                    status: "@" + screen_name + " " + data.authorityName + " " + data.authorityContact + " " + data.authorityWebsite,    
                    in_reply_to_status_id: id_str
                  };
                  console.log(params);
                  T.post('statuses/update', params, function (err, data, response) {
                    sendMail(screen_name,tweetText);
                    console.log("response data ");
                    console.log(data);
                  });

              });                
            });
        });
    }
  });
}