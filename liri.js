var axios = require('axios');

require('dotenv').config();

var keys = require('./keys.js');

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
// console.log(command);
var argument = process.argv.slice(3).join(" ");
// console.log(argument);

var concertThis = function(searchString) {
  var queryUrl = "https://rest.bandsintown.com/artists/" + searchString + "/events?app_id=codingbootcamp"
  console.log("concertThis()" , queryUrl);

  axios.get(queryUrl).then(
    function(response) {
      response.data.forEach(function(element) {
        console.log(element.venue.name);
        if (element.venue.region) {
          console.log(`${element.venue.city}, ${element.venue.region}`);
        } else {
          console.log(`${element.venue.city}, ${element.venue.country}`);
        }
        console.log(element.datetime);
        console.log('--------------------------------')
      });
    })
    .catch(function(error) {
      console.log("error" , error);
    });
}

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

var movieThis = function(searchString) {
  var queryUrl = "http://www.omdbapi.com/?t=" + searchString + "&y=&plot=short&apikey=trilogy";
  console.log("movieThis()" , queryUrl);

  axios.get(queryUrl).then(
    // If the request with axios is successful
    function(response) {
      // Then log the Release Year for the movie
      console.log(`${response.data.Title} (${response.data.Year})`);
      console.log(response.data.Plot);
    })
    .catch(function(error) {
      console.log("error" , error);
    });
}

var doWhatItSays = function() {
  console.log("doWhatItSays()");
}

switch(command) {
  case 'concert-this':
    if (!argument) {
      concertThis("Hootie and the Blowfish");
    } else {
      concertThis(argument);
    }
    break;
  case 'spotify-this-song':
    if (!argument) {
      spotifyThisSong("The Sign Ace of Base");
    } else {
      spotifyThisSong(argument);
    }
    break;
  case 'movie-this':
    if (!argument) {
      movieThis("Mr. Nobody");
    } else {
      movieThis(argument);
    }
    break;
  case 'do-what-it-says':
    doWhatItSays();
}