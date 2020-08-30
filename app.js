// import modules-----------------------------------------------------

var chalk = require("chalk"); // module is useful for color logging
var express = require("express"); // module is useful for handle the requests
var captionprocess = require("./captionsprocess"); // module is used to do captions processing

// module is useful for get subtitles of youtube video
var getSubtitles = require("youtube-captions-scraper").getSubtitles;

// variables-----------------------------------------------------------

// server will setup the port number
var portNo = process.env.PORT || 3000; // on this port, our server will listen

// setting the request parameters
var videoID = null;
var searchToken = null;

// define the functions------------------------------------------------

// function checks whether the given parameters
// are there in request or not
const checkRequestPara = function (req, ...others) {
  // for each parameters, check whether it exists in req...
  for (var index in others) {
    if (!req.query[others[index]]) {
      return false;
    }
  }
  return true;
};

// create the express server-------------------------------------------
var app = express();
app.listen(portNo, () =>
  console.log(chalk.green.inverse("Server started on " + portNo + " ..."))
);

// set up the routes------------------------------------------------------

// api route
app.get("/api", (req, res) => {
  // check the parameters
  if (!checkRequestPara(req, "videoID", "searchToken")) {
    res.status(404).send({
      error: "Bad parameter. Pass the parameters videoID and searchToken",
    });
  }

  // set parameters to scope from req
  videoID = req.query.videoID;
  searchToken = req.query.searchToken;

  // get subtitles
  getSubtitles({
    videoID, // youtube video id
  })
    // call back function in then will run when app get the subtitles
    .then((captions) => {
      // captions contains subtitles (array of objects)

      res.send(
        // this function returns time of video that contains
        // given searchToken word
        captionprocess.getSearchTokenTime(captions, videoID, searchToken)
      );
    })
    // call back function in catch will be called
    // if any error occurs
    .catch((err) => res.status(404).send("" + err));
});

// wordcount route
app.get("/wordcount", (req, res) => {
  // check the parameters
  if (!checkRequestPara(req, "videoID")) {
    res.status(404).send({
      error: "Bad parameter. Pass the parameters videoID",
    });
  }

  // set parameters to scope from req
  videoID = req.query.videoID;
  searchToken = req.query.searchToken;

  // get subtitles
  getSubtitles({
    videoID, // youtube video id
  })
    // call back function in then will run when app get the subtitles
    // captions contains subtitles (array of objects)
    .then((captions) => {
      // this function returns time of video that contains
      // given searchToken word
      res.send(captionprocess.wordCount(captions));
    })
    // call back function in catch will be called
    // if any error occurs
    .catch((err) => res.status(404).send("" + err));
});
