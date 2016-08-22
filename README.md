# yt-downloader
Useless nodeJS based Youtube to mp3 donwloader.

Installation:
<pre>
git clone https://github.com/zeesousa/yt-downloader 

cd yt-downloader

npm install
</pre>

Make sure you have nodejs and npm installed on your machine

Command usage:
<pre>
node index.js &lt;url&gt;
</pre>

Downloads a single video.

Download a list of videos from a file:
<pre>
node index.js -f &lt;file with links&gt;
</pre>

Download a playlist:
<pre>
node index.js -p &lt;playlist link&gt;
</pre>

File example:
<pre>
https://www.youtube.com/watch?v=Y6G-srRX2ZY
https://www.youtube.com/watch?v=Y6G-srRX2ZY
https://www.youtube.com/watch?v=BlK4iSMqqIU
https://www.youtube.com/watch?v=2FlHCmEwRkw
https://www.youtube.com/watch?v=5mrVYi751SU
</pre>

The script will download each video and store it like this: ./media/&lt;video name&gt;.mp3
<br/>
Repeated videos will be ignored!

TO DO:
<ul>
<li>support various video and audio formats</li>
<li>specify a filename for each video link</li>
</ul>
