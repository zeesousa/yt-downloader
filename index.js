var fs = require('fs');
var ytdl = require('ytdl-core');
var ffmpeg = require('fluent-ffmpeg');
var _ = require('underscore');
var escapeStringRegexp = require('escape-string-regexp');

if (!fs.existsSync('./media')) {
	fs.mkdirSync('./media');
}

//cli args
var args = process.argv.slice(2);

fs.readFile(args[0], 'utf8', function(err, data) {

	if (err) {
		if (err.code == 'ENOENT') {

			console.log("File doesn't exist!");
		}
		console.log(err.message);

	} else {

		console.log(data.trim());
		var links = _.uniq(data.trim().split("\n").map(function(val) {
			return val.trim();
		}));
		for (var i = 0; i < links.length; i++) {
			downloadUrl(links[i], i);
		}
	}

});

function downloadUrl(url) {
	try {
		ytdl.getInfo(url, function(err, info) {

      filename = info.title.replace(/\//g,"\\");

			var video = ytdl.downloadFromInfo(info, url);

			new ffmpeg({
				source: video
			}).toFormat('mp3').pipe(fs.createWriteStream('./media/' + filename + '.mp3'));

			console.log('Downloading ' + filename);

		});
	} catch (err) {
		console.log(err.message);
	}
}
