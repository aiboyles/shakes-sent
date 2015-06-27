//includes
var util = require('util');
var sentiment = require('sentiment');
var jsdom = require('jsdom').jsdom;
var S = require('string');

function sortSpeakersArray(speakers) {
    var speakersSorted = [];
    for (var k in speakers) {
        speakersSorted.push(speakers[k]);
    }
    return speakersSorted.sort(function(a,b) {
        return b.numLines - a.numLines;
    });
}


module.exports = function(respText, callback) {
    url = "./playtext/" + respText + ".html";
    var fs = require("fs");
    var playText = fs.readFileSync(url, "utf8");
    var htmlPlay = jsdom(playText, {
                    features: {
                                QuerySelector: true
                                }
                });
    var lines = htmlPlay.querySelectorAll('a[name]');
    var speakers = {};
    var person = "";

    for (i = 0; i < lines.length; i++) {
        if (lines[i].outerHTML.indexOf('<a name="speech') >= 0) { // we are at a speaker
            person = (S(lines[i].innerHTML).stripTags().s).replace(/:$/, "");
            // if the speaker does not already exist in the speakers array, create a new speaker object
            if (!speakers[person]) {
                speakers[person] = {
                                    name: person,
                                    numLines: 0,
                                    lines: "",
                                    matchedwords: 0,
                                    sentiment: 0,
                                    words: ""
                                    };
            }
            i++;
            // add the lines that this person speaks to their object
            while ((i < lines.length) && (lines[i].outerHTML.indexOf('<a name="speech') < 0)) {
                speakers[person].numLines ++;
                speakers[person].lines += " " + S(lines[i].innerHTML).stripTags().s; // trim out everything in brackets
                i++;
            }
            i--;
        }
    }
    var speakersSorted = sortSpeakersArray(speakers).slice(0,6); // we are only taking the top 6 speakers

    // now calculate the sentiment and total number of words
    for (i = 0; i < speakersSorted.length; i++) {
        var tempWords = sentiment(speakersSorted[i].lines)['words'];
        var tempString = "";
        for (j = 0; j < tempWords.length; j++)
        {
            tempString += tempWords[j] + ", ";
        }
        speakersSorted[i].words = S(tempString).chompRight(', ').s;
        speakersSorted[i].sentiment = sentiment(speakersSorted[i].lines)['score'] / sentiment(speakersSorted[i].lines)['words'].length;
        speakersSorted[i].matchedwords = sentiment(speakersSorted[i].lines)['words'].length / speakersSorted[i].lines.split(' ').length;
    }
    callback(speakersSorted);
}