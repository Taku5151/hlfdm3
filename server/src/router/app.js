const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')

const connection = mysql.createPool({
  connectionlimit : 10,
  host            : '127.0.0.1',
  user            : 'root',
  password        : '',
  database        : 'HLFDM',
  dateStrings     : 'date'
});

app.use(function(req, res, next) {
    // res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Content-Type', 'application/json; charset=utf-8');
    // res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    // res.header('Access-Control-Allow-Headers', 'appid, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// }));

app.post('/data/', function(req, res) {

  // connection.connect(function(err) {
  //   if (err) throw err;
  // });
  // console.log(req.body.sql);
  connection.query(req.body.sql, function (err, rows, fields) {
    if (err) throw err

    const result = rows;
    result.unshift([]);

    for(let i = 0; i < fields.length; i++) {
      const newObj = {
        "name" : fields[i].name,
        "type" : fields[i].type
      }
      result[0].push(newObj)
    }

    // console.log(result);
    res.json(result);
  })

  // connection.end();
});

app.get('/data/', function(req, res) {

  connection.connect(function(err) {
    if (err) throw err;
  });
  // console.log(req.body.sql);
  // connection.query(req.body.sql, function (err, rows, fields) {
  //   if (err) throw err
  //   console.log(rows);
  //   console.log(fields);
  // })

  connection.end();
});

app.listen(3001, () => console.log('Start 3001!'))
