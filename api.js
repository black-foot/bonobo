'use strict';
const config = require('config');
const express = require('express');
const app = express();

/*------------------------
| Configuration
------------------------*/
app.use(express.static(__dirname + '/public'));
app.set('port', config.app.port);

/*------------------------
| Routes
------------------------*/
app.get('/', (req, res) => {
  res.render('index');
})

/*------------------------
| Start server
------------------------*/
app.listen(app.get('port'), () => {
  console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});
