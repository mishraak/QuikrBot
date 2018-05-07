var Twit = require('twit');
var config = require('./index.js');
var consumers = require('./consumers.js');

module.exports = new Twit({
  consumer_key:         consumers.list[1].CONSUMER_KEY,
  consumer_secret:      consumers.list[1].CONSUMER_SECRET,
  access_token:         consumers.list[1].ACCESS_TOKEN,
  access_token_secret:  consumers.list[1].ACCESS_TOKEN_SECRET,
  timeout_ms:           consumers.list[1].TIMEOUT_MS
})