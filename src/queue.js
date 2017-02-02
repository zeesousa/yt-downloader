let ffmpegstatic = require('ffmpeg-static');
let ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegstatic.path);
let async = require('async');
let ytdl = require('ytdl-core');

let q = async.queue(function(url, callback) {
  try {
    ytdl.getInfo(url, function(err, info) {
      if (info) {
        let filename = info.title.replace(/\/|\\/g, '-');
        let output = './media/' + filename + '.mp3';

        ffmpeg()
          .input(ytdl(url, {
            format: 'highest',
            filter: 'audioonly',
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
};

/**
 * Downloads a list of videos by puhsing them into a downloading queue
 *
 * @param {Array} videos
 */
exports.downloadVideos = function(videos) {
  let totalVideos = videos.length;
  let videosDownloaded = 0;
  console.log(`Downloading ${totalVideos} videos, its going to take a while..`);
  for (let i = 0; i < videos.length; i++) {
    q.push(videos[i], function() {
      videosDownloaded++;
      console.log(`${videosDownloaded} out of ${totalVideos} downloaded`);
    });
  }
};
