var express = require('express');
var pug = require('pug');
var bodyParser = require('body-parser');
var mongodb = require("mongodb");
var ttn = require('ttn');

var app = express();
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(express.static('public'));

var TTN1_SECRET = process.env.TTN1_SECRET;
var TTN1_APPID = process.env.TTN1_APPID;
var TTN1_ACCESSKEY = process.env.TTN1_ACCESSKEY;
var ttnclient = new ttn.Client('eu.thethings.network', TTN1_APPID, TTN1_ACCESSKEY);

ttnclient.on('connect', function(connack) {
  console.log('[DEBUG]', 'Connect:', connack);
});

ttnclient.on('error', function(err) {
  console.error('[ERROR]', err.message);
});

ttnclient.on('activation', function(deviceId, data) {
  console.log('[INFO] ', 'Activation:', deviceId, JSON.stringify(data, null, 2));
});

ttnclient.on('message', function(deviceId, data) {
  console.info('[INFO] ', 'Message:', deviceId, JSON.stringify(data, null, 2));
});

ttnclient.on('message', function(deviceId, data) {
  console.log('Received message:', data);
  db.collection(TTN1_MONGODB_COLLECTION).insertOne(data, function(err, doc) {
    if (err) {
      console.log("Failed to insert record.");
      console.log(err);
    } else {
      console.log("Inserted record.");
    }
  });
});

var ObjectID = mongodb.ObjectID;
var db; // Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var TTN1_MONGODB_COLLECTION = process.env.TTN1_MONGODB_COLLECTION;

if (typeof TTN1_SECRET == 'undefined') {
  console.log('Required environment variable is not set, aborting.');
  process.exit(1);
}

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.TTN1_MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");
  // Initialize the app.
  var server = app.listen(process.env.TTN1_PORT || 3003, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/", function(req, res) {
  res.render('index');
});

app.get("/all", function(req, res) {
  db.collection(TTN1_MONGODB_COLLECTION).distinct('devEUI', {}, function (err, docs) {
    console.log('docs = ' + docs);
    docs.forEach( function(node) {
      console.log('node = ' + node);
      db.collection(TTN1_MONGODB_COLLECTION).find({'devEUI': node}).sort({'metadata.time':1}).limit(1).toArray( function (date) {
        console.log('date = ' + date);
      });
    });
  });
  db.collection(TTN1_MONGODB_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get records.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get("/last", function(req, res) {
  db.collection(TTN1_MONGODB_COLLECTION).find({}).sort({"metadata.time":-1}).limit(1).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get records.");
    } else {
      res.render('last', docs[0]);
    }
  });
});
