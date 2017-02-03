# yt-downloader
Useless nodeJS based Youtube to mp3 donwloader.

Installation:
<pre>
npm install -g yt-downloader
</pre>

Make sure you have nodejs and npm installed on your machine

Command usage:
<pre>
yt-downloader video &lt;url&gt;
</pre>

Downloads a single video.

Download a list of videos from a file:
<pre>
yt-downloader file &lt;file with links&gt;
</pre>

Download a playlist:
<pre>
yt-downloader playlist &lt;playlist link&gt;
</pre>

File example:
<pre>
https://www.youtube.com/watch?v=Y6G-srRX2ZY
https://www.youtube.com/watch?v=Y6G-srRX2ZY
https://www.youtube.com/watch?v=BlK4iSMqqIU
https://www.youtube.com/watch?v=2FlHCmEwRkw
https://www.youtube.com/watch?v=5mrVYi751SU
</pre>

The script will download each video and store it a folder named `media` on the directory you executed the command from.
<br/>
Repeated videos will be ignored!

TO DO:
<ul>
<li> Optionally download video </li>
<li> More audio formats, currently only mp3 </li>
<li> Improve parsing of command line arguments </li>
</ul>
