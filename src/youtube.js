let ytdl = require('ytdl-core');
let ffmpegstatic = require('ffmpeg-static');
let ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegstatic.path);

/**
 * Downloads a music file from a youtube video
 *
 * @param {string} url The video url
 * @return {Promise}
 */
exports.downloadVideo = function(url) {
  return new Promise((resolve, reject) => {
    try {
      ytdl.getInfo(url, function(err, info) {
        if (err) return reject(err);
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
            resolve(info.title);
          });
      });
    } catch (err) {
      reject(err);
    }
  });
};
