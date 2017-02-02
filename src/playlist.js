let request = require('sync-request');
let util = require('util');
let apiKey = 'AIzaSyA1Zv7gKh5pSX67ylmUygUx0vWUQeAXCjo';
let youtube = 'https://www.googleapis.com/youtube/v3/playlistItems';

/**
 * Synchrousnly populates an array with video IDs from a youtube playlist
 *
 * @param {string} playlistID The ID of the playlist
 * @return {Array.string} the video IDs
 */
exports.getVideos = function(playlistID) {
  let videos = [];
  let done = false;
  while (!done) {
    let requestUrl = util
      .format('%s?part=contentDetails&maxResults=50&playlistId=%s&key=%s',
      youtube, playlistID, apiKey);

    let res = request('GET', requestUrl);

    if (res.statusCode != 200) {
      console.log(res.statusCode);
      console.log('Invalid playlist URL');
      return;
    }

    let playlist = JSON.parse(res.getBody());
    for (let i = 0; i < playlist.items.length; i++) {
      console.log(playlist.items[i].contentDetails.videoId);
      videos.push('https://www.youtube.com/watch?v=' + playlist.items[i].contentDetails.videoId);
    }

    done = !playlist.nextPageToken;
  }

  return videos;
};
