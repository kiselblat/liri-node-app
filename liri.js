var axios = require('axios');
var fs = require('fs');
var moment = require('moment');
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
  //console.log("concertThis()" , queryUrl);
  axios.get(queryUrl).then(
    function(response) {
      response.data.forEach(function(element) {
        var venueName = element.venue.name;
        var venuePlace = "";
        if (element.venue.region) {
          venuePlace = (`${element.venue.city}, ${element.venue.region}`);
        } else {
          venuePlace = (`${element.venue.city}, ${element.venue.country}`);
        }
        var concertTime = moment(element.datetime).format("MM/DD/YYYY");
        console.log(venueName);
        console.log(venuePlace);
        console.log(concertTime);
        console.log('--------------------------------')
        fs.appendFile("log.txt" , `${venueName}\n${venuePlace}\n${concertTime}\n----------------\n` , function(err) {
          if (err) {
            console.log(err);
          }
        });
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
      var trackName = track.name;
      var trackArtist = track.artists[0].name;
      var trackAlbum = track.album.name;
      var trackUrl = track.external_urls.spotify;
      console.log(trackName);
      console.log(trackArtist);
      console.log(trackAlbum);
      console.log(trackUrl);
      fs.appendFile("log.txt" , `${trackName}\n${trackArtist}\n${trackAlbum}\n${trackUrl}\n----------------\n` , function(err) {
        if (err) {
          console.log(err);
        }
      });
    })
    .catch(function(err) {
      console.log(err);
    });
}

var movieThis = function(searchString) {
  var queryUrl = "http://www.omdbapi.com/?t=" + searchString + "&y=&plot=short&apikey=trilogy";
  console.log(`movieThis(${searchString})` , queryUrl);
  axios.get(queryUrl).then(
    function(response) {
      var movieTitle = `${response.data.Title} (${response.data.Year})`;
      var movieActors = "Starring: " + response.data.Actors;
      var moviePlot = response.data.Plot;
      var movieRatings = `IMDB Rating: ${response.data.Ratings[0].Value} Rotten Tomatoes: ${response.data.Ratings[1].Value}`;
      var movieLocale = `Country: ${response.data.Country} Language(s): ${response.data.Language}`;
      console.log(movieTitle);
      console.log(movieActors);
      console.log(moviePlot);
      console.log(movieRatings);
      console.log(movieLocale);
      fs.appendFile("log.txt" , `${movieTitle}\n${movieActors}\n${moviePlot}\n${movieRatings}\n${movieLocale}\n----------------\n` , function(err) {
        if (err) {
          console.log(err);
        }
      });
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