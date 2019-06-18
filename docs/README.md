# LIRI

## Overview
LIRI is a CLI app that delivers the goods from multiple APIs! Search Spoitfy for tracks, bandsintown for shows, or the OMDB for movies right from the command line.

## Installation and Requirements

### Setting up LIRI

LIRI requires the Node.js command line tool. First go to the [node.js](https://nodejs.org/en/) website and download and install node.

Once node is installed, you can use the **Node Package Manager** to install all relevent dependencies listed in the included `package.json` file. Do this by opening a terminal in your LIRI directory, making sure you are connected to the internet, and running:

```
npm install
```

Additionally, this software does not come with the necessary keys to access the Spotify API. In order to make this function work, a file named `.env` must be present and must contain two keys provided by Spotify in the following format:

```
SPOTIFY_ID=your-spotify-key
SPOTIFY_SECRET=your-spotify-secret
```

The `dotenv` package is responsible for interfacing the included `keys.js` with the `.env` file you provide with LIRI.

If you have done this correctly, and you have valid keys, all LIRI functions should now be available to you.

### Dependencies

LIRI requires several third-party packages to run. These are stored in the `package.json` file in your LIRI directory. When you run `npm -i`, the following packages will be downloaded and installed into your LIRI directory:

  * `axios`
  * `dotenv`
  * `fs`
  * `moment`
  * `node-spotify-api`

## How it Works

LIRI is organized into four different commands:

  * `concert-this`
  * `spotify-this-song`
  * `movie-this`
  * `do-what-it-says`

By invoking these, followed by a band name, song title, or movie title, LIRI will automatically select and search the appropriate online resourse.

### `concert-this`:

This uses `axios` to pass a search term of indeterminate length to the **bands in town** API, which then returns a list of upcoming performances of arbitrary length. The date is formatted properly by `moment.js`.

Search bands in town with the following:

```
$ node liri.js concert-this mucca pazza
```

This will yield the following output, or something like it:

```
Humiston-Riverside Park
Pontiac, IL
06/27/2019
--------------------------------
Weird Al Strings Attached 2019
Highland Park, IL
07/28/2019
--------------------------------
```

[See the demo](./docs/gifs/concert-this-demo.gif)

---

### `spotify-this-song`

This uses the `node-spotify-api` package to request song information from the **Spotify** API.

Search Spotify like this:

```
$ node liri.js spotify-this-song Hooked on a Feeling          
```

This will yield the following output:

```
Hooked on a Feeling
Björn Skifs
Hooked On A Feeling
https://open.spotify.com/track/6Ac4NVYYl2U73QiTt11ZKd
```

[See the demo](./docs/gifs/spotify-this-song-demo.gif)

---

### `movie-this`

This also uses `axios` to search the **Open Movie Database** (OMDB) service for information about a given movie title.

Like so:

```
$ node liri.js movie-this The Matrix        
```

This will yield the following output:

```
The Matrix (1999)
Starring: Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving
A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.
Internet Movie Database: 8.7/10 Rotten Tomatoes: 88% Metacritic: 73/100
Country: USA Language(s): English
```

[See the demo](./docs/gifs/movie-this-demo.gif)

---

### `do-what-it-says`

Do what it says makes use of the `fs` package to read a command and argument from the provided `random.txt` file.

By default, `do-what-it-says` will search Spotify for *I Want it That Way*, by 
The Backstreet Boys. Unless you change it, of course.

```
$ node liri.js do-what-it-says
```

Will yield the following output:

```
I Want It That Way
Backstreet Boys
The Hits--Chapter One
https://open.spotify.com/track/6e40mgJiCid5HRAGrbpGA6
```

[See the demo](./docs/gifs/do-what-it-says-demo.gif)

---

## Other Features

### `log.txt`

In part because of the lengthy nature of some `concert-this` responses, a text file, `log.txt`, is provided to record the output. It will be created by the first call to any of the three search functions, and will be appended to after each subsequent search.

Sample `log.txt` file entries:

```
***mucca pazza Tour Dates***
Humiston-Riverside Park
Pontiac, IL
06/27/2019
----------------
Weird Al Strings Attached 2019
Highland Park, IL
07/28/2019
----------------
The Matrix (1999)
Starring: Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving
A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.
Internet Movie Database: 8.7/10 Rotten Tomatoes: 88% Metacritic: 73/100 
Country: USA Language(s): English
----------------
Hooked on a Feeling
Björn Skifs
Hooked On A Feeling
https://open.spotify.com/track/6Ac4NVYYl2U73QiTt11ZKd
----------------
```

---

### Default behaviors

Each of the three search functions also have a default search that they perform if no argument is passed to them, but I won't show you here, you'll just have to try them out!

## About

LIRI was developed based on an assignment in the University of Minnesota Full-Stack Web Developer Boot Camp program. This version of the assignment was authored entirely by me, Thomas Christ.