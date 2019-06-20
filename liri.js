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

// display variable
var divider = "--------------------------------------------------------------------------------";

// Read in the command and argumend passed from the command line
var command = process.argv[2];
var argument = process.argv.slice(3).join("%20");
// console.log(command , argument);

// Displays a given band's touring schedule, as provided by bandsintown
var concertThis = function(searchString) {
  var queryUrl = `https://rest.bandsintown.com/artists/${searchString}/events?app_id=codingbootcamp`
  // console.log(`concertThis(${searchString}) , ${queryUrl}`);
  fs.appendFile("log.txt" , `\nconcertThis(${searchString}): ${queryUrl}\n` , errorHandler);

  axios.get(queryUrl).then(
    function(response) {

      var searchTitle = `\n${searchString} Tour Dates\n${divider}`
      
      console.log(searchTitle);
      fs.appendFile("log.txt" , `${searchTitle}` , errorHandler);

      response.data.forEach(function(element) {
        // bands in town returns undefined to .region when venue is outside of US.
        var venuePlace = function() {
          if (element.venue.region) {
            return `${element.venue.city}, ${element.venue.region}`;
          } else {
            return `${element.venue.city}, ${element.venue.country}`;
          }
        }

        var concertData = [
          `Venue: ${element.venue.name}`,
          `Location: ${venuePlace()}`,
          `Date: ${moment(element.datetime).format("MM/DD/YYYY")}`,
        ].join('\n');

        console.log(`${concertData}\n${divider}`);

        fs.appendFile("log.txt" , `\n${concertData}\n${divider}` , errorHandler);
      });
      console.log(`\n${response.data.length} results\n`);
      fs.appendFile("log.txt" , `\n${response.data.length} results\n` , errorHandler);
    })
    .catch(errorHandler);
}

// Displays information about a song whose title is provided by the user, provided by Spotify
var spotifyThisSong = function(searchString) {
  fs.appendFile("log.txt" , `\nspotifyThisSong(${searchString})\n` , errorHandler);
  spotify
    .search({ type: 'track', query: searchString })
    .then(function(response) {
      var track = response.tracks.items[0];
      var trackData = [
        `Title: ${track.name}`,
        `Artist: ${track.artists[0].name}`,
        `Album: ${track.album.name}`,
        `URL: ${track.external_urls.spotify}`
      ].join('\n');

      console.log(`\n${trackData}\n${divider}`);

      fs.appendFile("log.txt" , `\n${trackData}\n${divider}` , errorHandler);
    })
    .catch(errorHandler);
}

// Displays information about a movie whose title is provided by the user, provided by OMDB
var movieThis = function(searchString) {
  var queryUrl = "http://www.omdbapi.com/?t=" + searchString + "&y=&plot=short&apikey=trilogy";
  // console.log(`movieThis(): ${searchString} , ${queryUrl}`);
  fs.appendFile("log.txt" , `\nmovieThis(): ${searchString} , ${queryUrl}\n` , errorHandler);

  axios.get(queryUrl).then(
    function(response) {
      var movieRatings = "";
      response.data.Ratings.forEach(function(element) {
        movieRatings += `${element.Source}: ${element.Value}\n         `;
      });

      var movieData = [
        `${response.data.Title} (${response.data.Year})\n`,
        `Starring: ${response.data.Actors}\n`,
        `Summary: ${response.data.Plot}\n`,
        `Ratings: ${movieRatings}`,
        `Country: ${response.data.Country}\n`,
        `Language(s): ${response.data.Language}`  
      ].join('\n');

      console.log(`\n${movieData}\n${divider}`);

      fs.appendFile("log.txt" , `\n${movieData}\n${divider}` , errorHandler);
    })
    .catch(errorHandler);
  }
  
  // Takes a command and argument from a seperate file
  var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      errorHandler(error);
      
      var fileInput = data.split(',' , 2);
      var instruction = fileInput[0];
      // either axios.get or omdb and bandsintown doesn't like quotes around the string
      var searchString = fileInput[1].slice(1 , fileInput[1].length - 1);
      // console.log(`doWhatItSays():  ${instruction} , ${searchString}`);
      fs.appendFile("log.txt" , `\ndoWhatItSays():  ${instruction} , ${searchString}\n` , errorHandler);
      initiate(instruction , searchString);
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
      if (typeof search === typeof undefined || search === "") {
        concertThis("Hootie%20and%20the%20Blowfish");
      } else {
        concertThis(search);
      }
      break;
    case 'spotify-this-song':
      if (typeof search === typeof undefined || search === "") {
        spotifyThisSong("The%20Sign%20Ace%20of%20Base");
      } else {
        spotifyThisSong(search);
      }
      break;
    case 'movie-this':
      if (typeof search === typeof undefined || search === "") {
        movieThis("Mr.%20Nobody");
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