var fs = require('fs');
var ytdl = require('ytdl-core');
var ffmpegstatic = require('ffmpeg-static');
var ffmpeg = require('fluent-ffmpeg');
var _ = require('underscore');
var path = require('path');
var playlist = require('./playlist');
var escapeStringRegexp = require('escape-string-regexp');
var async = require('async');

var YouTube = require('youtube-node');

var youTube = new YouTube();
youTube.setKey('AIzaSyA1Zv7gKh5pSX67ylmUygUx0vWUQeAXCjo');

ffmpeg.setFfmpegPath(ffmpegstatic.path);

if (!fs.existsSync('./media')) {
  fs.mkdirSync('./media');
}

//cli args
var args = process.argv.slice(2);
var totalVideos, videosDownloaded;

var q = async.queue(function(url, callback) {
  try {
    ytdl.getInfo(url, function(err, info) {
      if (info) {
        var filename = info.title.replace(/\/|\\/g, "-");
        output = './media/' + filename + '.mp3';

        ffmpeg()
          .input(ytdl(url, {
            format: 'highest',
            filter: 'audioonly'
          }))
          .toFormat('mp3')
          .save(output)
          .on('error', console.error)
          .on('end', function() {
            console.log('Finished downloading and converting ' + filename);
            callback();
          });
      }
    });
  } catch (err) {
    console.log(err.message);
  }
}, 4);

q.drain = function() {
  console.log('All videos have been downloaded');
}

if (args[0] == '-p') {
  var videos = playlist.getPlaylistVideos(args[1]);
  downloadVideos(videos);
} else if (args[0] == '-f') {
  fs.readFile(args[1], 'utf8', function(err, data) {
    if (err) {
      if (err.code == 'ENOENT') {
        console.log("File doesn't exist!");
      }
      console.log(err.message);
    } else {
      var videos = _.uniq(data.trim().split("\n").map(function(val) {
        return val.trim();
      }));
      downloadVideos(videos);
    }
  });
} else {
  downloadUrl(args[0]);
}

function downloadVideos(videos) {
  totalVideos = videos.length;
  videosDownloaded = 0;
  console.log("Downloading " + totalVideos + " videos, its going to take a while..");
  for (var i = 0; i < videos.length; i++) {
    q.push(videos[i], function(err) {
      videosDownloaded++;
      console.log(videosDownloaded + " out of " + totalVideos + " downloaded");
    });
  }
}

function downloadUrl(url) {
  try {
    ytdl.getInfo(url, function(err, info) {
      if (info) {
        filename = info.title.replace(/\/|\\/g, "-");
        output = './media/' + filename + '.mp3';

        console.log('Downloading ' + filename);

        ffmpeg()
          .input(ytdl(url, {
            format: 'highest',
            filter: 'audioonly'
          }))
          .toFormat('mp3')
          .save(output)
          .on('error', console.error)
          .on('end', function() {
            console.log('Finished downloading and converting ' + filename);
          });
      }
    });
  } catch (err) {
    console.log(err.message);
  }
}
