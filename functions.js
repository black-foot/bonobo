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
  }
}


var count = 5
// A function that calculates the mean at each index of an array between current and running mean values
function arrayMean(arr1,arr2,count){
  for (i = 0; i < arr1.length; i++) {
    var output = (arr1[i] + arr2[i] * count) / (count + 1);
  }
  return output
}

// A function that handles tweet counts at a predefined bin inteval.
//countPerInterval: The count of tweets in a predefined interval.
//intervalCount: The time of the interval.
function dataHandler (countPerInterval,intervalCount,count){

  if(data.minute.now.length < 60000/intervalCount){

    data.minute.now.push(countPerInterval)

  }else if(data.minute.now.length === 60000/intervalCount){

    var a = a + 1
    data.hour.now.push(R.mean(data.minute.now) * data.minute.now.length)
    //Get the mean of the data.day array for the day
    if(data.minute.avg === Array){
      data.minute.avg = arrayMean(data.minute.now, data.minute.avg,count)
    }else{
        data.minute.avg = data.minute.now}
    data.minute.now = []
  }
  if(data.hour.now.length === 24){
    data.day.now.push(R.mean(data.hour.now) * data.hour.now.length)
    if(data.hour.avg === Array){
      data.hour.avg = arrayMean(data.hour.now, data.hour.avg,count)
    }else{
        data.hour.avg = data.hour.now}
    data.hour.now = []
  }
  if(data.day.now.length === 7){
    data.week.now.push(R.mean(data.day.now) * data.day.now.length)
    if(data.day.avg === Array){
      data.day.avg = arrayMean(data.day.now, data.day.avg,count)
    }else{
        data.day.avg = data.day.now}
    data.day.now = []
  }
  if(data.week.now.length === 4){
    data.month.now.push(R.mean(data.week.now) * data.week.now.length)
    if(data.week.avg === Array){
      data.week.avg = arrayMean(data.week.now, data.week.avg,count)
    }else{
        data.week.avg = data.week.now}
    data.week.now = []
  }
  if(data.month.now.length === 12){
    data.year.now.push(R.mean(data.month.now) * data.month.now.length)
    if(data.year.avg === Array){
      data.year.avg = arrayMean(data.year.now, data.year.avg,count)
    }else{
        data.year.avg = data.year.now}
    data.year.now = []
  }
  return data
}

//console.log(dataHandler (countPerInterval,intervalCount))


for (i = 0; i < 100000; i++){
  console.log(dataHandler (5,5000,i))
}
