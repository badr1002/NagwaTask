var express = require('express');
var router = express.Router();
const checkWords = require('../core/business/words.bll')

// get rondom 10 words
router.get('/getRondonmWordList', (req, res) => {
 try {
   checkWords.getRondonmList(data => {
     res.status(200).send({
       success: true,
       msg: "Get rondom wordList successfully",
       data: data
     })
   })
 } catch (err) {
   res.status(401).send({
     success: false,
     msg: "Error when get rondom wordList!",
     data: err
   })
 }
});
router.post('/checkWords', (req, res) => {
  try {
    checkWords.checkWords(req.body.wordList, (data) => {
      res.status(200).send({
        success: true,
        msg: "Checked wordList successfully",
        data: data
      })
    })
  } catch (err) {
    res.status(401).send({
      success: false,
      msg: "Error when check word list!",
      data: err
    })
  }

});

module.exports = router;
