# yt-downloader
Download a list of youtube videos listed on a text file (\n separated) via CLI.

Command usage:
<pre>
node index.js <file>
</pre>

File example:
<pre>
https://www.youtube.com/watch?v=Y6G-srRX2ZY
https://www.youtube.com/watch?v=Y6G-srRX2ZY
https://www.youtube.com/watch?v=BlK4iSMqqIU
https://www.youtube.com/watch?v=2FlHCmEwRkw
https://www.youtube.com/watch?v=5mrVYi751SU
</pre>

The script will download each video and store it like this: ./media/<video name>.mp3
Repeated videos will be ignored!

TO DO:
<ul>
<li>support various video and audio formats</li>
<li>specify filename desired for each video</li>
</ul>
