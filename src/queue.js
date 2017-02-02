const async = require('async');
const youtube = require('./youtube.js');

let queue = async.queue((url, callback) => {
  youtube.downloadVideo(url)
    .then((data) => callback(data))
    .catch((err) => callback(err));
}, 4);

queue.drain = function() {
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
    queue.push(videos[i], () => {
      videosDownloaded++;
      console.log(`Finished downloading ${videos[i]}`);
      console.log(`${videosDownloaded} out of ${totalVideos} downloaded`);
    });
  }
};
