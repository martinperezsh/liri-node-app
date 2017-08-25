// Linking twitter/spotify keys to this file
var keys = require('./keys.js');
var twitterKeys = keys.twitterKeys;
var spotifyId = keys.spotifyId;

//npm packages used 
var inquirer = require("inquirer");
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

// command input
var input = process.argv[2];

if (input === 'my-tweets') {
	return tweets();
}

if (input === 'movie-this') {
	inquirer.prompt([
		{
			type: 'input',
			message: 'What movie would you like to search for?',
			name: 'movieInput'
		},
		{
			type: 'confirm',
			message: 'Are you sure?',
			name: 'confirm',
			default: true
		}
	]).then(function(inquirerResponse){
		if (inquirerResponse.confirm) {
			movie(inquirerResponse.movieInput);
		}
	})
}

if (input === 'spotify-song') {
	inquirer.prompt([
		{
			type: 'input',
			message: 'What song would you like to search for?',
			name: 'spotifySong'
		},
		{
			type: 'confirm',
			message: 'Are you sure?',
			name: 'confirm',
			default: true
		}
	]).then(function(inquirerResponse){
		if (inquirerResponse.confirm) {
			song(inquirerResponse.spotifySong);
		}
	})
}


// Retrieving the twitter keys from keys.js
function tweets() {
	var keyInfo = new twitter({
		consumer_key: twitterKeys.consumer_key,
		consumer_secret: twitterKeys.consumer_secret,
		access_token_key: twitterKeys.access_token_key,
		access_token_secret: twitterKeys.access_token_secret,
	});

// This will search for the last 20 tweets for that screen name
	var params = {
		screen_name: 'MartinLiriNode',
		count: '20',
		trim_user: false,
	}


	keyInfo.get('statuses/user_timeline', params, function(error, timeline, response){
		if(error){
			console.log(error);
		} else {
			for(tweet in timeline){
				var date = new Date(timeline[tweet].created_at);

				console.log('Tweet #: ' + (parseInt(tweet)+1));
				console.log('Date/Time: ' + date.toString().slice(0, 24));
				console.log('Tweet: ' + timeline[tweet].text);
				console.log('======================================================================')
	
			}
		} 
	})

}

function song(spotifySong) {
	var spotifyInfo = new spotify({
  		id: spotifyId.id,
  		secret: spotifyId.secret
	});

// Using prompt to search for the song
	spotifyInfo.search({ 
		type: 'track', 
		query: spotifySong
	}, function(err, data) {
	    if (err) throw err;
	    // 
		var song = data.tracks.items;
		
		    for (var i = 0; i < 5; i++){
		    	for (j = 0; j < song[i].artists.length; j++){
		    	    console.log('Artist: ' + song[i].artists[j].name);
		        	console.log('Song: ' + song[i].name);
		        	console.log('Preview link of the song from Spotify: ' + song[i].preview_url);
		        	console.log('Album: ' + song[i].album.name + "\n");
		    	}
		    }
	});
}

function movie(movieInput) {
	
	request('http://www.omdbapi.com/?t=' + movieInput + '&y=&plot=short&apikey=40e9cece', function (error, response, body) {
		if(error) throw error;

		json = JSON.parse(body);
		
		console.log(json.Title);
		console.log('Year: ' + json.Year);
		console.log('Rating(imdb): ' + json.imdbRating);
		console.log('Rating(Rotten Tomatoes): ' + json.Ratings[1].Value);
		console.log('Country: ' + json.Country);
		console.log('Language: ' + json.Language);
		console.log('Plot: ' + json.Plot);
		console.log('Actors: ' + json.Actors);
	})
}


