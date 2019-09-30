var express = require('express');
var router = express.Router();
var mysql = require('mysql')

const fs = require("fs");
const load = fn => JSON.parse(fs.readFileSync(fn));
let config = load("./config.json");

let connections = [];

// intended for local use, so no problem with password encryption.
router.post('/connection', function(req, res, next) {
  let newConfig = {
    host: req.body.host || config.host,
    user: req.body.user || config.user,
    port: req.body.port || config.port,
    password: req.body.password || config.password,
    database: req.body.database || config.database
  }
  console.log(newConfig);
  try {
    let newConn = mysql.createConnection(newConfig);
    newConn.connect();
    connections.push(newConn);
    res.status(201).send(newConfig);
  } catch (error) {
    console.log(error);
    res.send(500);
  }
});

router.get('/connection/count', function(req, res, next) {
  res.status(200).send(connections.length.toString());
});

router.post('/connection/:id/end', function (req, res, next) {
  try {
    connections[req.id].end();
    connection.end();
    res.send(200);
  } catch (error) {
    res.send(500);
  }
});

router.post('/:connId/query', function (req, res, next) {
  let query = req.body.query;
  let connId = req.params.connId;
  callQuery(connId, query, res);
});

const callQuery = (connId, query, res) => {
  console.log(`conn[${connId}]: query`);
  connections[connId].query(query, function (error, results, fields) {
    if (error) res.status(400).send(`conn[${connId}]: ` + error);
    res.send(results);
  });
}

module.exports = router;