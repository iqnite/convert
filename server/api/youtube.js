const express = require("express");
let router = express.Router();
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

// Route base/youtube
router.route("/gettitle").post(async (req, res) => {
  try {
    const videoUrl = req.body.link;
    if (!ytdl.validateURL(videoUrl)) {
      return res.status(500).send("Invalid URL");
    }
    const info = await ytdl.getInfo(videoUrl);
    const title = info.videoDetails.title;
    res.status(200).send(title);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

router.route("/downloadvideo", async (req, res) => {
  try {
    const videoUrl = req.body.link;
    if (!ytdl.validateURL(videoUrl)) {
      return res.status(500).send("Invalid URL");
    }
    const options = {
      quality: "highestVideo",
      filter: "videoandaudio",
    };
    const info = await ytdl.getInfo(videoUrl);
    const title = info.videoDetails.title;
    const videoPath = path.join(__dirname, "temp", `video.mp4`); // TODO: Replace with sanitized title (also below!)
    const videoWriteStream = fs.createWriteStream(videoPath);
    ytdl(videoUrl, options).pipe(videoWriteStream);
    videoWriteStream.on("finish", () => {
      res.download(videoPath, `video.mp4`, () => {
        fs.unlinkSync(videoPath); // Delete our video once it is downloaded
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
