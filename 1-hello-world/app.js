// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const express = require('express');

const app = express();

var router = express.Router();

app.use(express.static('test'));

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', router);

var fs = require('fs');

var path = require('path');

// Imports the Google Cloud client library
const Vision = require('@google-cloud/vision');

// Your Google Cloud Platform project ID
const projectId = 'picasso-160507';

// Instantiates a client
const visionClient = Vision({
  projectId: projectId
});


router.get('/', (req, res) => {
  res.sendfile('test/index.html');
});

app.post('/', function(req, res){
  // The name of the image file to annotate
  //console.log(req.body.NameofShape);
  const fileName = req.body.ImageLocation;

  var replacedFileName = fileName.replace(/^data:image\/png;base64,/, '');
  fs.writeFile(path.resolve(__dirname, 'image.png'), replacedFileName, 'base64', function(err) {
    if (err) throw err;
  });

  // Performs label detection on the image file
  visionClient.detectLabels('image.png')
    .then((results) => {
      const labels = results[0];

      //console.log('Labels:');
      res.send(labels);
      //labels.forEach((label) => console.log(label));
    });

});



if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;
