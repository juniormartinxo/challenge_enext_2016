const express = require('express');
const router = express.Router();
const fs = require('fs');

let data = {};

fs.readFile('./potions.json', 'utf8', function (err, dataJson) {
  if (err) {
    return console.log('Erro ao ler arquivo ' + err);
  }

  data = JSON.parse(dataJson); // faz o parse para json
});

router.get('/', (req, res) => {
  res.json(Object.values(data));
});

module.exports = router;
