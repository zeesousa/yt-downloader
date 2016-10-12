#!/usr/bin/env node

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

const commandLineCommands = require('command-line-commands')

const validCommands = ['playlist', 'file', 'video']
const {
  command,
  argv
} = commandLineCommands(validCommands)

if (!fs.existsSync('./media')) {
  fs.mkdirSync('./media');
}


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


switch (command) {
  case 'playlist':
    var videos = playlist.getPlaylistVideos(argv[0]);
    downloadVideos(videos);
    break;
  case 'file':
    fs.readFile(argv[0], 'utf8', function(err, data) {
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
    break;
  case 'video':
    downloadUrl(argv[0]);
    break;
  default:
    console.log('Usage:');
    console.log('-v <video url> | downloads a video');
    console.log('-p <playlist url> | download a playlist');
    console.log('-f <file location> | download a list of links from a file');
}

var totalVideos, videosDownloaded;

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
