var Twitter = require('twitter');
var hl = require('highland');
var R = require('ramda');
var config = require('config');

var Pusher = require('pusher');

var T = new Twitter({
  consumer_key: config.TWITTER_CONSUMER_KEY,
  consumer_secret: config.TWITTER_CONSUMER_SECRET,
  access_token_key: config.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
});



function makeTweet() {

var primaryColours = [ 'red', 'blue', 'blue', 'red','yellow', 'red', 'red', 'red','blue','yellow'];
var colour = primaryColours[Math.floor(Math.random() * primaryColours.length)];

// DPLAbot uses the Wordnik API to grab a random noun. It then plugs that random noun--data[0].word--into a call to the DPLA API.
// You need two API keys for this two work: a Worknik API key and a DPLA API key.
	console.log(colour);
		    // tweet it!
		T.post('statuses/update', {status: colour}, function(err, reply) {});
	};


// Create a tweet upon running dplabot.js
makeTweet();

// Set up the timing for subsequent executions of makeDPLA. Here we run it every 87 minutes.

setInterval(function() {
  try {
    makeTweet();
  }
 catch (e) {
    console.log(e);
  }
},1000*60);
