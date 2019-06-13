require('dotenv').config();

var keys = require('./keys.js');

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

spotify
  .search({ type: 'track', query: 'All the Small Things' })
  .then(function(response) {
    console.log(JSON.stringify(response.tracks.items[0].name , null , 2));
    console.log(JSON.stringify(response.tracks.items[0].artists[0].name , null , 2));
    console.log(JSON.stringify(response.tracks.items[0].external_urls.spotify , null , 2));
  })
  .catch(function(err) {
    console.log(err);
  });