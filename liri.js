var axios = require('axios');

require('dotenv').config();

var keys = require('./keys.js');

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
// console.log(command);
var argument = process.argv.slice(3).join(" ");
// console.log(argument);

var spotifyThisSong = function(searchString) {
  spotify
    .search({ type: 'track', query: searchString })
    .then(function(response) {
      var track = response.tracks.items[0];
      console.log(track.name);
      console.log(track.artists[0].name);
      console.log(track.album.name);
      console.log(track.external_urls.spotify);
    })
    .catch(function(err) {
      console.log(err);
    });
}

switch(command) {
  case 'concert-this':
    //concertThis(argument);
    break;
  case 'spotify-this-song':
    if (!argument) {
      spotifyThisSong("The Sign Ace of Base");
    } else {
      spotifyThisSong(argument);
    }
    break;
  case 'movie-this':
    //movieThis(argument);
    break;
}