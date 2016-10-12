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
  var done = false;
  while (!done) {
    var requestUrl = util.format("%s?part=contentDetails&maxResults=50&playlistId=%s&key=%s", youtube, playlistID, apiKey);

    var res = request('GET', requestUrl);

    if (res.statusCode != 200) {
      console.log(res.statusCode)
      console.log("Invalid playlist URL");
      return;
    }

    playlist = JSON.parse(res.getBody());
    for (var i = 0; i < playlist.items.length; i++) {
      videos.push("https://www.youtube.com/watch?v=" + playlist.items[i].contentDetails.videoId);
    }

    done = !playlist.nextPageToken;
  }
}
