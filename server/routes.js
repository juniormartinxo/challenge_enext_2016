const express = require('express');
const router = express.Router();
const fs = require('fs');

let data = {};

fs.readFile('./cars.json', 'utf8', function (err, dataJson) {
  if (err) {
    return console.log('Erro ao ler arquivo ' + err);
  }

  data = JSON.parse(dataJson); // faz o parse para json
});

router.get('/', (req, res) => {
  res.json(Object.values(data));
});

function checkBody(req, res, next) {
  if (areAllFieldsValid(req.body)) {
    return next();
  }

  res
    .status(400)
    .json({ error: true, message: 'Todos os campos são obrigatórios' });
}

function areAllFieldsValid(body) {
  const fields = [
    body.id,
    body.image,
    body.brand,
    body.model,
    body.year,
    body.plate,
    body.color,
  ];
  return fields.every(field => typeof field !== 'undefined' && field !== '');
}

function checkAlreadyRegistered(req, res, next) {
  const infoCar = Object.values(req.body);
  const dataValores = Object.values(data);

  dataValores.filter(element => {
    if (infoCar[5].toUpperCase() === element.plate.toUpperCase()) {
      return res.status(400).json({
        error: true,
        message: `Já existe um carro cadastrado com a placa ${req.body.plate.toUpperCase()}`,
      });
    }
  });

  next();
}

router.post('/', checkBody, checkAlreadyRegistered, (req, res) => {
  data[req.body.id] = {
    id: req.body.id,
    image: req.body.image,
    brand: req.body.brand,
    model: req.body.model,
    year: req.body.year,
    plate: req.body.plate,
    color: req.body.color,
  };

  res.json({
    message: `O carro com placa ${req.body.plate} foi cadastrado com sucesso`,
  });
});

router.delete('/', (req, res) => {
  delete data[req.body.id];
  res.json({
    message: `O carro com placa ${req.body.plate} foi removido com sucesso`,
  });
});

module.exports = router;
