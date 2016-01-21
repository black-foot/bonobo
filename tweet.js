var Twitter = require('twitter');
var hl = require('highland');
var R = require('ramda');
var config = require('config');

var client = new Twitter({
  consumer_key: config.TWITTER_CONSUMER_KEY,
  consumer_secret: config.TWITTER_CONSUMER_SECRET,
  access_token_key: config.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
});

var searchTerm = process.argv[2]


client.stream('statuses/filter', searchTerm, function(stream){
  stream.on('data', function(tweet) {
    hl([tweet])
      .map(function(tweet) {
        //Show me the hashtag (if a space happens before a hashtag then the hashtag is not logged)
        var tweetString = R.prop('text', tweet)
        if (tweetString.search("#") > -1) {
          var hashLocation = tweetString.search("#")
          var spaceLocation = tweetString.search(" ")
          var hashtag = tweetString.slice(hashLocation,spaceLocation);
          console.log(hashtag);
        }
        return [
         R.prop('text', tweet),
         R.path(['geo', 'coordinates'], tweet),
         R.path(['place', 'full_name'], tweet),
         R.path(['place', 'country'], tweet),
        ]
      })
      .each(console.log)
  });
});
