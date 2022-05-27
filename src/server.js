import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import dotenv from 'dotenv';
const {MongoClient, ObjectId} = require('mongodb');
const config = require('../webpack.config.js');
const formidable = require('express-formidable');

const server = express();
server.use(formidable());

const args = process.argv;

// PATHS
const STATIC_ASSETS_PATH = path.resolve(path.join(__dirname, '..', 'assets'));
const INDEX_FILE_PATH = path.join(__dirname, '..', 'public', 'index.html' );
const BUNDLE_PATH = path.join(__dirname, '..', 'public', 'build', 'bundle.js');
const CSS_PATH = path.join(__dirname, '..', 'public', 'build', 'main.css');

// MODE

if (args[2] == '--mode' && args[3] == 'dev') {
  const compiler = webpack( config );
  dotenv.config({ path: 'config/development.env'});
  server.use(webpackDevMiddleware(compiler, { publicPath: '/static/build' }));
  server.use(webpackHotMiddleware(compiler, {}));
} else {
  dotenv.config({ path: 'config/production.env'});
  server.get('/static/build/bundle.js', (request, response) => response.status(200).sendFile(path.resolve( BUNDLE_PATH )));
  server.get('/static/build/main.css', (request, response) => response.status(200).sendFile(path.resolve( CSS_PATH )));
}

// DATABASE
const URI = process.env.DB_CONNECTION_STRING;

function getNotes() {
  return new Promise((resolve, rej) => {
    MongoClient.connect(URI, (err, db) => {
      const dbo = db.db();
      dbo.collection('notes').find({ deleted: false }).toArray(async (err, results) => {
        if (err) throw err;
        await db.close();
        resolve(results);
      });
    });
  });
}

function deleteNote(id) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(URI, async (err, db) => {
      const dbo = db.db();
        const o_id = ObjectId(id);
        await dbo.collection('notes').updateOne({ _id: o_id }, { $set: { deleted: true } });
        await db.close();
        resolve();
    });
  });
}

function insertNote(params, callback) {
    return new Promise((resolve, rej) => {
      MongoClient.connect(URI, async (err, db) => {
        const dbo = db.db();
        await dbo.collection('notes').insertOne({ ...params, deleted: false });
        await db.close();
        resolve();
      });
  });
}


server.use('/static/assets/', express.static(STATIC_ASSETS_PATH));

server.post("/save/note", (request, response) => {
  insertNote(request.fields).then(res => response.status(200).json({ response: "Note saved"}))
})

server.post("/delete/note/", (request, response) => {
  deleteNote(request.fields.id).then(res => response.status(200).json(res)).catch(err => {throw err});
})

server.get("/get/notes/", (request, response) => {
  getNotes().then(res => response.status(200).json(res)).catch(err => {throw err})
})

server.get('/*', (request, response) => {
  response.sendFile( INDEX_FILE_PATH )
});

const serverAddress = "0.0.0.0";
const port = 5000;
server.listen(port, serverAddress );
console.log(`Serving at http://${serverAddress}:${port}`);
