
var data = {
  hour:[],
  day:[]}

var bin = 1

function dayData (x){

  if(data.day.length < 24){

    data.day.push(x)

    return data.day

  }else if(data.day.length = 24){

    data.day.mean = (data.day.current + data.day.mean)/n

    //Get the mean of the data.day array for the day

    data.week.push(mean(data.day))

    data.day=[]

  }
}

console.log(dayData(bin))
