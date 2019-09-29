var express = require('express');
var router = express.Router();
var mysql = require('mysql')

const fs = require("fs");
const load = fn => JSON.parse(fs.readFileSync(fn));
let config = load("./config.json");

var connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  port: config.port,
  password: config.password,
  database: config.database
});

router.get('/connection', function(req, res, next) {
  try {
    connection = mysql.createConnection({
      host: config.host,
      user: config.user,
      port: config.port,
      password: config.password,
      database: config.database
    });
    connection.connect();
    res.send(200);
  } catch (error) {
    res.send(500);
  }
});

router.get('/connection/end', function (req, res, next) {
  try {
    connection.end();
    res.send(200);
  } catch (error) {
    res.send(500);
  }
});

router.post('/query', function (req, res, next) {
  let query = req.body.query;
  console.log(query);
  connection.query(query, function (error, results, fields) {
    if (error) res.send(400, error);
    res.send(results);
  });
  // connection.end();
});

module.exports = router;