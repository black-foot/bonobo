var R = require('ramda')


// An object that holds the current & running avg tweet frequencies.
var data = {
  minute:{
    now:[],
    avg:[]
  },
  hour:{
    now:[],
    avg:[]
  },
  day:{
    now:[],
    avg:[]
  },
  week:{
    now:[],
    avg:[]
  },
  month:{
    now:[],
    avg:[]
  },
  year:{
    now:[],
    avg:[]
  }}
  }


// A function that calculates the mean at each index of an array between current and running mean values
function arrayMean(arr1,arr2,count){
  for (i = 0; i < arr1.length; i++) {
    var output = (arr1 + arr2 * count) / (count + 1);
  }
  return output
}

// A function that handles tweet counts at a predefined bin inteval.
//countPerInterval: The count of tweets in a predefined interval.
//intervalCount: The time of the interval.
function dataHandler (countPerInterval,intervalCount){

  if(data.minute.now.length < 60000/intervalCount){

    data.minute.now.push(countPerInterval)

  }else if(data.minute.now.length = 60000/intervalCount){

    var a = ++1
    data.hour.now.push(R.mean(data.minute.now))
    //Get the mean of the data.day array for the day
    data.minute.avg = arrayMean(data.minute.now,data.minute.avg,)
    data.minute.now = []
  }
  return data
}

console.log(dataHandler (countPerInterval,intervalCount))
