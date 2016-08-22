var request = require('sync-request');
var util = require('util');
var apiKey = 'AIzaSyA1Zv7gKh5pSX67ylmUygUx0vWUQeAXCjo';
var youtube = 'https://www.googleapis.com/youtube/v3/playlistItems'

module.exports = {
  getPlaylistVideos: function(playlistID, callback) {
    var videos = []

    getPlaylist(playlistID, videos)

    return videos
  }
};

function getPlaylist(playlistID, videos) {
  var requestUrl = util.format("%s?part=contentDetails&maxResults=50&playlistId=%s&key=%s", youtube, playlistID, apiKey);

  var res = request('GET', requestUrl);

  playlist = JSON.parse(res.getBody());
  for (var i = 0; i < playlist.items.length; i++) {
    videos.push("https://www.youtube.com/watch?v=" + playlist.items[i].contentDetails.videoId);
  }

  var nextPage = playlist.nextPageToken;
  if (playlist.nextPageToken)
    getPlaylistNextPage(playlistID, nextPage, videos)
}

function getPlaylistNextPage(playlistID, pageToken, videos) {
  var requestUrl = util.format("%s?part=contentDetails&maxResults=50&playlistId=%s&key=%s&pageToken=%s", youtube, playlistID, apiKey, pageToken);

  var res = request('GET', requestUrl);

  playlist = JSON.parse(res.getBody());
  for (var i = 0; i < playlist.items.length; i++) {
    videos.push("https://www.youtube.com/watch?v=" + playlist.items[i].contentDetails.videoId);
  }

  var nextPage = playlist.nextPageToken;
  if (playlist.nextPageToken)
    getPlaylistNextPage(playlistID, nextPage, videos)
}
