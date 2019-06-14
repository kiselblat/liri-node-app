// LIRI is a command line app that can return information about touring bands, movies, and songs!

// axios
var axios = require('axios');
// filesystem
var fs = require('fs');
// moment.js
var moment = require('moment');
// Spotify
require('dotenv').config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// Read in the command and argumend passed from the command line
var command = process.argv[2];
var argument = process.argv.slice(3).join(" ");
// console.log(command , argument);

// Displays a given band's touring schedule, as provided by bandsintown
var concertThis = function(searchString) {
  var queryUrl = "https://rest.bandsintown.com/artists/" + searchString + "/events?app_id=codingbootcamp"
  console.log(`concertThis(${searchString})` , queryUrl);
  axios.get(queryUrl).then(
    function(response) {
      fs.appendFile("log.txt" , `***${searchString} Tour Dates***\n` , errorHandler);

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
        console.log('--------------------------------');

        fs.appendFile("log.txt" , `${venueName}\n${venuePlace}\n${concertTime}\n----------------\n` , errorHandler);
      });
    })
    .catch(errorHandler);
}

// Displays information about a song whose title is provided by the user, provided by Spotify
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

      fs.appendFile("log.txt" , `${trackName}\n${trackArtist}\n${trackAlbum}\n${trackUrl}\n----------------\n` , errorHandler);
    })
    .catch(errorHandler);
}

// Displays information about a movie whose title is provided by the user, provided by OMDB
var movieThis = function(searchString) {
  var queryUrl = "http://www.omdbapi.com/?t=" + searchString + "&y=&plot=short&apikey=trilogy";
  // console.log("movieThis(): ", searchString , queryUrl);
  axios.get(queryUrl).then(
    function(response) {
      var movieTitle = `${response.data.Title} (${response.data.Year})`;
      var movieActors = "Starring: " + response.data.Actors;
      var moviePlot = response.data.Plot;
      var movieRatings = "";
      response.data.Ratings.forEach(function(element) {
        movieRatings += element.Source + ": " + element.Value + " ";
      });
      var movieLocale = `Country: ${response.data.Country} Language(s): ${response.data.Language}`;

      console.log(movieTitle);
      console.log(movieActors);
      console.log(moviePlot);
      console.log(movieRatings);
      console.log(movieLocale);

      fs.appendFile("log.txt" , `${movieTitle}\n${movieActors}\n${moviePlot}\n${movieRatings}\n${movieLocale}\n----------------\n` , errorHandler);
    })
    .catch(errorHandler);
}

// Takes a command and argument from a seperate file
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    errorHandler(error);
    var fileInput = data.split(',' , 2);
    // console.log("doWhatItSays(): " , fileInput);
    initiate(fileInput[0] , fileInput[1]);
  });
}

// DRY out all the anonymous error handlers
var errorHandler = function(error) {
  if (error) {
    console.log("error!" , error);
  }
}

// Takes the argument and passes it to the appropriate function
var initiate = function(doThis , search) {
  switch(doThis) {
    case 'concert-this':
      if (!search) {
        concertThis("Hootie and the Blowfish");
      } else {
        concertThis(search);
      }
      break;
    case 'spotify-this-song':
      if (!search) {
        spotifyThisSong("The Sign Ace of Base");
      } else {
        spotifyThisSong(search);
      }
      break;
    case 'movie-this':
      if (!search) {
        movieThis("Mr. Nobody");
      } else {
        movieThis(search);
      }
      break;
    case 'do-what-it-says':
      doWhatItSays();
  }
}

// Engage
initiate(command , argument);