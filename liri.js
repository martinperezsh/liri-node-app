// Linking twitter keys to this file
var keys = require('./keys.js');
var twitterKeys = keys.twitterKeys;


var twitter = require('twitter');
var spotify = require('node-spotify-api');
var fs = require('fs');

var input = process.argv[2];

if (input === 'my-tweets') {
	return tweets();
}



// Retrieving the twitter keys from keys.js
function tweets() {
	var client = new twitter({
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


	client.get('statuses/user_timeline', params, function(error, timeline, response){
		if(!error){
			for(tweet in timeline){
				
				var date = new Date(timeline[tweet].created_at);

			//This will display tweet info in bash
				console.log('Tweet #: ' + (parseInt(tweet)+1) + ' ');
				console.log(date.toString().slice(0, 24) + ' ');
				console.log(timeline[tweet].text);
				console.log('======================================================================')
				

			//Add the info into the log.txt folder
				fs.appendFile('log.txt', "Tweet #: " + (parseInt(tweet)+1) + "\n");
				fs.appendFile('log.txt', timeline[tweet].text + "\n");
				

			}
		} 
	})

}