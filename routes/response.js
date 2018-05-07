var T = require('../config/twit.js')

var myParams = {
                  data : {
                    "entities" : {
                      "type" : "Crime",
                      "Location" : "San Jose, CA"
                    }
                  },
                  headers : {
                    "x-api-key" : "ULijX7EfaV5RRH9BwgweD5NkxfvMDV5u45rNQHoT",
                    "Content-Type" : "application/json" 
                  }
              } 


exports.test = function (id_str, str){
  var params = {
                status: str,    
                in_reply_to_status_id: id_str
            };
  T.post('statuses/update', params, function (err, data, response) {
    console.log("response data ");
    console.log(data);
  });
}
