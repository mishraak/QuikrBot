var Twit = require('twit');
var config = require('./index.js');
var consumers = require('./consumers.js');

module.exports = new Twit({
  consumer_key:         consumers.list[2].CONSUMER_KEY,
  consumer_secret:      consumers.list[2].CONSUMER_SECRET,
  access_token:         consumers.list[2].ACCESS_TOKEN,
  access_token_secret:  consumers.list[2].ACCESS_TOKEN_SECRET,
  timeout_ms:           consumers.list[2].TIMEOUT_MS
})