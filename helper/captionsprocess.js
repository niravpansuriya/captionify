// import modules-----------------------------------------------------

// this module contains functions for NLP
const nlp = require("./nlp");

// functions-----------------------------------------------------------

// this function count the words of captions
const wordCount = function (captions) {
  // function will return this object
  const obj = {};

  // for each caption object...
  captions.forEach((caption) => {
    // get words of caption without stop words
    var words = nlp.removeStopWords(caption.text);

    // for each word...
    words.forEach((word) => {
      // check if word encounted first time or not.
      // if encountered first time then, initialize it with 1
      // else increase by 1
      obj[word] = obj[word] === undefined ? 1 : obj[word] + 1;
    });
  });

  return obj;
};

// this function return the array which consists object with timestamp
const getSearchTokenTime = (captions, videoID, searchToken) => {
  // return the array of caption objects
  return captions.filter((obj) => {
    // for each caption object...
    // check if searchToken exists in captions
    if (obj.text.toLowerCase().indexOf(searchToken) === -1) {
      return false;
    } else {
      obj.url = // creating url
        "https://www.youtube.com/watch?v=" +
        videoID +
        "&t=" +
        Math.round(obj.start) +
        "s";
      return true;
    }
  });
};

// export the functions
module.exports = { getSearchTokenTime, wordCount };
