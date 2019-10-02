var express = require('express');
var router = express.Router();
var mysql = require('mysql')

const fs = require("fs");
const load = fn => JSON.parse(fs.readFileSync(fn));
let configs = load("./config.json").configs;

let connections = [];

const DEFAULT_LIMIT = 100;

router.get('/configs', function(req, res, next) {
  res.status(200).send(configs);
});

//                                   _   _                 
//    ___ ___  _ __  _ __   ___  ___| |_(_) ___  _ __  ___ 
//   / __/ _ \| '_ \| '_ \ / _ \/ __| __| |/ _ \| '_ \/ __|
//  | (_| (_) | | | | | | |  __/ (__| |_| | (_) | | | \__ \
//   \___\___/|_| |_|_| |_|\___|\___|\__|_|\___/|_| |_|___/

// intended for local use, so no problem with password encryption.
router.post('/connection', function(req, res, next) {
  let newConfig = {
    host: req.body.host || configs[0].host,
    user: req.body.user || configs[0].user,
    port: req.body.port || configs[0].port,
    password: req.body.password || configs[0].password,
    database: req.body.database || configs[0].database
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
  let connId = req.params.connId;
  let query = req.body.query;
  callQuery(connId, query, res);
});

const callQuery = (connId, query, res) => {
  console.log(`conn[${connId}]: ${query}`);
  connections[connId].query(query, function (error, results, fields) {
    if (error) res.status(400).send(`conn[${connId}]: ` + error);
    res.send(results);
  });
}

//  _        _     _           
// | |_ __ _| |__ | | ___  ___ 
// | __/ _` | '_ \| |/ _ \/ __|
// | || (_| | |_) | |  __/\__ \
//  \__\__,_|_.__/|_|\___||___/

router.get('/:connId/tables', function (req, res, next) {
  let connId = req.params.connId;
  let query = `SHOW TABLES`;
  callQuery(connId, query, res);
});

router.get('/:connId/tables/:tableName', function (req, res, next) {
  let connId = req.params.connId;
  let tableName = req.params.tableName;
  let limit = req.query.limit || DEFAULT_LIMIT;
  let offset = req.query.offset || null;
  let where = req.query.where ? "WHERE " + req.query.where : "";
  let query = `SELECT * FROM ${tableName} ${where} LIMIT ${offset ? offset + ", " : ""} ${limit}`;
  callQuery(connId, query, res);
});

/*
  Given a table and a field,
  get all the distinct values this field currently takes.
*/
router.get('/:connId/tables/:tableName/distinct-values/:fieldName', function(req, res, next) {
  let connId = req.params.connId;
  let tableName = req.params.tableName;
  let fieldName = req.params.fieldName;
  let query = `SELECT DISTINCT(${fieldName}) FROM ${tableName}`;
  callQuery(connId, query, res);
});

/*
  Given a list of values L, and a table T with columns K, V that map each element of L,
  return all values of L mapped to their corresponding values.
*/
router.post('/:connId/tables/:tableName/mapped', function(req, res, next) {
  let connId = req.params.connId;
  let values = req.body.values;
  let tableName = req.body.tableName;
  let columnKName = req.body.columnKName;
  let columnVName = req.body.columnVName;
  // let query = `SELECT * FROM ${table1Name} INNER JOIN ${table2Name} WHERE `;
  callQuery(connId, query, res);
});

/* Check that the open connection contains a matching row in the specified table */
// router.post('/:connId/find-row/:tableName', function(req, res, next) {
//   let connId = req.params.connId;
//   let tableName = req.params.tableName;
//   let columnValues = req.body.values;
//   let query = `SELECT COUNT(*) FROM ${tableName} WHERE `;
//   callQuery(connId, query, res);
// });

//        _               _        
//    ___| |__   ___  ___| | _____ 
//   / __| '_ \ / _ \/ __| |/ / __|
//  | (__| | | |  __/ (__|   <\__ \
//   \___|_| |_|\___|\___|_|\_\___/

/*
  Given two tables and two fields that should match
  retrieve all tuples that don't have a match (FK check).
*/
router.post('/:connId/check', function(req, res, next) {
  let connId = req.params.connId;
  let table1Name = req.body.table1Name;
  let field1Name = req.body.field1Name;
  let table2Name = req.body.table2Name;
  let field2Name = req.body.field2Name;
  // let query = `SELECT * FROM ${table1Name} INNER JOIN ${table2Name} WHERE `;
  callQuery(connId, query, res);
});

// check collations

// check empty tables
router.post('/:connId/check/empty-tables', function(req, res, next) {
  let query = ```
  select table_schema as database_name, table_name
    from information_schema.tables
    where table_type = 'BASE TABLE'
          and table_rows = 0
          and table_schema not in('information_schema', 'sys', 'performance_schema', 'mysql')
          -- and table_schema = 'sakila' -- put your database name here
    order by table_schema, table_name;
  ```;
  let connId = req.params.connId;
  callQuery(connId, query, res);
});

// denormalizer

module.exports = router;