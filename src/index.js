#!/usr/bin/env node

let fs = require('fs');
let ytdl = require('ytdl-core');
let ffmpegstatic = require('ffmpeg-static');
let ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegstatic.path);
let _ = require('underscore');
let playlist = require('./playlist');
let videoQueue = require('./queue.js');
const commandLineCommands = require('command-line-commands');

const validCommands = ['playlist', 'file', 'video', null];
const {
  command,
  argv,
} = commandLineCommands(validCommands);

if (!fs.existsSync('./media')) {
  fs.mkdirSync('./media');
}

switch (command) {
  case 'playlist': {
    let videos = playlist.getVideos(argv[0]);
    videoQueue.downloadVideos(videos);
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
    downloadUrl(argv[0])
      .then(() => console.log('Finished downloading and converting ' + argv[0]))
      .catch((err) => console.log(err));
    break;
  }
  default:
    console.log('Usage:');
    console.log('-v <video url> | downloads a video');
    console.log('-p <playlist url> | download a playlist');
    console.log('-f <file location> | download a list of links from a file');
}

/**
 * Downloads a music file from a youtube video
 *
 * @param {string} url The video url
 * @return {Promise}
 */
function downloadUrl(url) {
  console.log(url);
  return new Promise((resolve, reject) => {
    try {
      ytdl.getInfo(url, function(err, info) {
        if (err) return reject(err);
        if (info) {
          let filename = info.title.replace(/\/|\\/g, '-');
          let output = './media/' + filename + '.mp3';

          console.log('Downloading ' + filename);

          ffmpeg()
            .input(ytdl(url, {
              format: 'highest',
              filter: 'audioonly',
            }))
            .toFormat('mp3')
            .save(output)
            .on('error', console.error)
            .on('end', function() {
              resolve();
            });
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}
