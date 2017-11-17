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

exports.downloadMedia = (url, mediaType) => {
  let fileFormat;

  if (mediaType === 'video') {
    fileFormat = 'mp4';
  } else if (mediaType === 'audio') {
    fileFormat = 'mp3'
  }

  return new Promise((resolve, reject) => {
    try {
      ytdl.getInfo(url, function(err, info) {
        if (err) return reject(err);

        let filename = info.title.replace(/\/|\\/g, '-');
        let output = `./media/${filename}.${fileFormat}`;

        ffmpeg()
          .input(ytdl(url, {
            format: 'highest',
            filter: mediaType,
          }))
          .toFormat(fileFormat)
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
}
