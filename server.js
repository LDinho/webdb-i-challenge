const express = require('express');

const server = express();

const db = require('./data/accounts-model');

const {
  find,
  findById,
  add,
  remove,
  update
} = db;

server.use(express.json());

server.get('/', (req, res) => {
  res.send(`<h2>Database Playground</h2>`)
});

server.get('/accounts', async (req, res) => {

  try {
    const accounts = await find();

    if (accounts.length) {
      return res.status(200).json({accounts});
    }

    res.status(400)
       .json({message: 'No accounts found'});
  }
  catch (err) {
    res.status(500)
       .json({
         error: 'Server error',
         err
       })
  }
})

module.exports = server;
