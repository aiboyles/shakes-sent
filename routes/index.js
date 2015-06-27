var express = require('express');
var router = express.Router();
var shakesSentiment = require('../logic/shakesSentiment');

router.index = function(req, res) {
  res.render('index', {
    title: 'Shakespeare Sentiment Analysis'
  });
}

router.analyze = function(req, res) {
    shakesSentiment(req.body.search, function (data) {
        res.json(data);
    });
};
    
module.exports = router;