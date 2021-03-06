const Twitter = require('twitter');
const hl = require('highland');
const R = require('ramda');
const config = require('config');
const path = require('path');
const utils = require(path.resolve('lib/utils'));

const client = new Twitter({
  consumer_key: config.twitterKeys.TWITTER_CONSUMER_KEY,
  consumer_secret: config.twitterKeys.TWITTER_CONSUMER_SECRET,
  access_token_key: config.twitterKeys.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: config.twitterKeys.TWITTER_ACCESS_TOKEN_SECRET
});

const params = {
  locations: R.prop(utils.getLocation(process.argv[2]), config.locations)
};

var statsObject = new utils.StatsObject()

client.stream('statuses/filter', params, function(stream){
  stream.on('data', function(tweet) {
    hl([tweet])
      .reject(R.compose(R.isNil, R.path(['geo', 'coordinates'])))
      .reject(R.compose(R.test(/http/), R.prop('text')))
      .map(function(tweet) {
        return {
          text: tweet.text,
          coordinates: tweet.geo.coordinates
        }
      })
      .map(utils.frequencyCounter(statsObject))
      .errors(err => console.log(err.message))
      .each(console.log)
  });
});


//pusher.trigger('test_channel', 'my_event', pusherMan.tweet);
