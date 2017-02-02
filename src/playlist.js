let axios = require('axios').default;
let util = require('util');
let apiKey = 'AIzaSyA1Zv7gKh5pSX67ylmUygUx0vWUQeAXCjo';

const playlistItemURL = 'https://www.googleapis.com/youtube/v3/playlistItems';
const URLFormat = '%s?part=contentDetails&maxResults=%s&playlistId=%s&key=%s';

/**
 * Synchrousnly populates an array with video IDs from a youtube playlist
 *
 * @param {string} id The ID of the playlist
 * @param {callback} callback The callback to execute when the videos are
 * fully retrieved
 */
exports.getPlaylistVideos = function(id, callback) {
  let videos = [];
  recurse(id, null, videos, callback);
};

/**
 * Auxiliary function to recursively fill an array with video links
 *
 * @param {string} id The ID of the playlist
 * @param {string} pageToken The page token of the page to access
 * @param {Array.string} videos An array to fill with video links
 * @param {callback} callback The callback to execute when there
 * are no more pages
 */
function recurse(id, pageToken, videos, callback) {
  getPlaylistItems(id, 1, pageToken)
    .then((response) => {
      let playlistItems = response.data;

      playlistItems.items.forEach((item) => {
        videos.push(idToUrl(item.contentDetails.videoId));
      });

      pageToken = playlistItems.nextPageToken;

      if (pageToken) return recurse(id, pageToken, videos, callback);
      else return callback(null, videos);
    }).catch((err) => callback(err, null));
}

/**
 * Auxiliary function to convert a youtube id to a full url
 *
 * @param {string} id The ID of the video
 * @return {string} string The full video URL
 */
function idToUrl(id) {
  return 'https://www.youtube.com/watch?v=' + id;
}

/**
 * Gets the metadata of a playlist items
 *
 * @param {string} id The ID of the playlist
 * @param {string} maxResults Number of max results to return
 * @param {string} pageToken The token of the page we want to access
 * @return {Promise} the video IDs
 */
function getPlaylistItems(id, maxResults, pageToken) {
  let url = util.format(
    URLFormat,
    playlistItemURL,
    maxResults,
    id,
    apiKey);

  if (pageToken) url = url.concat(`&pageToken=${pageToken}`);

  return axios.get(url);
}
