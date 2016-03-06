'use strict';
const R = require('ramda');
const config = require('config');

function getLocation(locationFilter) {
  if (locationFilter) {
    return locationFilter;
  }
  console.log('No location filter provided, defaulting to London');
  return 'london'
}

function StatsObject() {
  this.initTime = Date.now();
  this.counter = 0;
  this.countArray = [];
  this.weight = 0;
  this.current = {
    m: 0,
    mos: 0,
    stdev: 0
  }
  this.running = {
    m: 0,
    mos: 0,
    stdev: 0
  }
  this.limits = {
    upperLimit: null,
    lowerLimit: null
  }
}

function calculateStdev(m, mos, countArray){
  return Math.sqrt(mos - m * m);
}

function calculateRunningMean(m, runningM, weight) {
  return (m + runningM * weight) / (weight + 1);
}

const frequencyCounter = R.curry(function(statsObject, tweet) {
  // Increment statsObject counter.
  statsObject.counter = ++statsObject.counter;

  if (Date.now() - statsObject.initTime > config.counterInterval) {
    let countArray = statsObject.countArray;
    countArray.push(statsObject.counter);
    statsObject.counter = 0;
    statsObject.initTime = Date.now();

    if (R.equals(countArray.length, config.maxIntervals)) {
      let m = R.mean(countArray);
      let mos = R.mean(R.map(x => x * x, countArray));
      let stdev = calculateStdev(m, mos, countArray);

      let runningM = statsObject.running.m;
      let runningMos = statsObject.running.mos;
      let runningStdev = statsObject.running.stdev;

      let weight = statsObject.weight;

      // Mutate the curret values of the statsObject.
      statsObject.current.m = m;
      statsObject.current.mos = mos;
      statsObject.current.stdev = stdev;

      // Calulate running values and mutate statsObject.
      statsObject.running.m = calculateRunningMean(m, runningM, weight);
      statsObject.running.mos = calculateRunningMean(mos, runningMos, weight);
      statsObject.running.stdev = Math.sqrt(statsObject.running.mos - statsObject.running.m * statsObject.running.m);

      // Increment weight, flush array and mutate statsObject limits.
      statsObject.weight = ++weight;
      statsObject.countArray = [ ];
      statsObject.limits = {
        upperLimit: m + stdev,
        lowerLimit: m - stdev
      };
    }
  }
  return statsObject
})

module.exports = {
  getLocation: getLocation,
  StatsObject: StatsObject,
  frequencyCounter: frequencyCounter
}
