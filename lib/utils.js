var R = require('ramda');


var count = 0;
function counter() {
  count += 1
}

setInterval(function() {
  console.log('test')
}, 1000)
