#!/usr/bin/env node

let fs = require('fs');
let _ = require('underscore');
let youtube = require('./youtube.js');
let playlist = require('./playlist.js');
let videoQueue = require('./queue.js');
const commandLineCommands = require('command-line-commands');

const validCommands = ['playlist', 'file', 'video', 'audio', null];
const {
  command,
  argv,
} = commandLineCommands(validCommands);

if (!fs.existsSync('./media')) {
  fs.mkdirSync('./media');
}

switch (command) {
  case 'playlist': {
    playlist.getPlaylistVideos(argv[0], (err, videos) => {
      if (err)
        console.error('Invalid playlist url');
      else
        videoQueue.downloadVideos(videos);
    });
    break;
  }
  case 'file': {
    fs.readFile(argv[0], 'utf8', function(err, data) {
      if (err) {
        if (err.code == 'ENOENT') {
          console.log('File doesn\'t exist!');
        }
        console.log(err.message);
      } else {
        let videos = _.uniq(data.trim().split('\n').map(function(val) {
          return val.trim();
        }));
        videoQueue.downloadVideos(videos);
      }
    });
    break;
  }
  case 'video': {
    youtube.downloadMedia(argv[0], 'video')
      .then((title) =>
        console.log('Finished downloading and converting ' + title)
      )
      .catch((err) => console.log(err));
    break;
  }
  case 'audio': {
    youtube.downloadMedia(argv[0], 'audio')
      .then((title) =>
        console.log('Finished downloading and converting ' + title)
      )
      .catch((err) => console.log(err));
    break;
  }
  default:
    console.log('Usage:');
    console.log('yt-downloader audio <audio url> | downloads audio only')
    console.log('yt-downloader video <video url> | downloads a video');
    console.log('yt-downloader playlist <playlist url> | download a playlist');
    console.log('yt-downloader file <file location> | download a list of links from a file');
}
