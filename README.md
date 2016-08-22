# yt-downloader
Download a list of youtube videos listed on a text file (\n separated) via CLI.

Installation:
<pre>
git clone https://github.com/zeesousa/yt-downloader 

cd yt-downloader

npm install
</pre>

Make sure you have nodejs and npm installed on your machine

Command usage:
<pre>
node index.js &lt;file with links&gt;
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
