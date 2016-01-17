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

//Useful functions
//Function to clean strings with links
function cleanStream(x){
 return R.test(/http/,x)
};


var statsObject = {}
var initTime = Date.now()
var counter = 0;
var weight = 0; // variable to count how many multiples of the big interals have passed.
var keywords = ["i"]
var regexp = new RegExp(keywords[0])

var countArray = [ ];

function averageCount(context, countArray){
  // Takes the average of an array of values
   var sum = R.reduce(function(a,b) {
     return a + b
   }, 0, countArray)
   context === 'non-square' ? statsObject.currentAverage = sum / countArray.length : statsObject.currentSquareAverage = sum / countArray.length
   return statsObject
}

function stdevCount(average, countArray){
  //takes the standard deviation of an array of intergers
  var squareOfAverage = average * average
  var arraySquares = R.map(function(x){
    return x * x
  }, countArray)
  var averageOfSquares = R.prop('currentSquareAverage', averageCount('squares', arraySquares))
  statsObject.currentAverageOfSquares = averageOfSquares;
  statsObject.squareOfAverage = squareOfAverage;
  statsObject.currentStdev = Math.sqrt(averageOfSquares - squareOfAverage)
  return statsObject
}

function frequencyCounter(tweet) {
  counter = counter + 1
  var currentTime = Date.now()
  console.log(counter)
  if (currentTime - initTime > (1 * 5000)) {
// Counter interval is set to 5 seconds
    countArray.push(counter)
    counter = 0
    initTime = Date.now()
    console.log(countArray)

    if (countArray.length === 5 ) {
      var currentAverage = R.prop('currentAverage', averageCount('non-square', countArray))
      var currentAverageOfSquares = statsObject.currentAverageOfSquares;
      var currentStdev = R.prop('currentStdev', stdevCount(currentAverage, countArray))

if (statsObject.runningAverage === undefined ) {
      statsObject.runningAverage = 0
    }
      statsObject.runningAverage = (currentAverage + statsObject.runningAverage * weight) / (weight + 1)

   if (statsObject.runningAverageOfSquares === undefined ) {
         statsObject.runningStdev = 0;
         statsObject.runningAverageOfSquares = 0;
       }
      statsObject.runningAverageOfSquares = (statsObject.currentAverageOfSquares + statsObject.runningAverageOfSquares * weight) / (weight + 1);
      statsObject.runningStdev = Math.sqrt(statsObject.runningAverageOfSquares-statsObject.runningAverage * statsObject.runningAverage)
      weight = weight + 1

countArray = [ ]
statsObject.currentLimits = {
  upperLimit: statsObject.currentAverage + statsObject.currentStdev,
  lowerLimit: statsObject.currentAverage - statsObject.currentStdev
}
      console.log(currentAverage)
      console.log(currentStdev)
      console.log(countArray)
      console.log(statsObject)
    }
  }
  return statsObject
}


//Added location "boxes" for easy calling
var locations = {
london: "51.2,-0.49,51.7,0.13",
sanFran: "-122.75,36.8,-121.75,37.8",
everywhere: "-180,-90,180,90"
};

var keywords = [ "the"]

var searchTerm = process.argv[2]

if (searchTerm === undefined) {
  console.log('No search term provided')
  process.exit(1)
};

if (!R.has(searchTerm, locations)) {
  console.log("Location not available, wait for future updates")
  process.exit(1)
};

var params = {
  locations: R.prop(searchTerm, locations)
};

client.stream('statuses/filter', params, function(stream){
  stream.on('data', function(tweet) {
    hl([tweet])
      .reject(R.compose(R.isNil, R.path(['geo', 'coordinates'])))
      .reject(R.compose(cleanStream, R.prop('text')))
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
      .filter(R.compose(R.test(regexp), R.head))
      .map(frequencyCounter)
      .each(console.log)

  });
});


//pusher.trigger('test_channel', 'my_event', pusherMan.tweet);
