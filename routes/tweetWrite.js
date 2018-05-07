var mongo = require("./mongo");
var config = require('../config/index.js');

exports.insertTweetInDatabase = function insertTweetInDatabase(req,res) {
    var hashtag = config.HASHTAG;
    var tweetText = req.text.substr(hashtag.length, req.text.length).trim();
    var post  = {created_at: req.created_at,
        id : req.id,
        id_str:req.id_str,
        lang: req.lang,
        metadata: req.metadata,
        source: req.source,
        text: tweetText,
    };
    var json_responses;

    mongo.connect(config.MONGO_URL, function(){
        var coll = mongo.collection('tweets');
        coll.insert(post, function(err, user){
            if(err){
                json_responses = {"statusCode" : 402};
            }
            else
            {
                json_responses = {"statusCode" : 200};
            }
        });
    });

}


exports.validateTweet = function (req, callback)
{
    var hashtag = config.HASHTAG;
    var id_str = req.id_str;
    var id = req.id;

    mongo.connect(config.MONGO_URL, function(){        
        var coll = mongo.collection('tweets');

        coll.find({"id":{$gte: id}}).toArray(function(err, tweet){
            callback(tweet,id_str);
        });
    });

}