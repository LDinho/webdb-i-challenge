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

/*
@GET: All Accounts
@PARAMS: none
@ROUTE: "/accounts"
*/

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

/*
@GET: Account
@PARAMS: id[STRING]!
@ROUTE: "/accounts/:id"
*/

server.get('/accounts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const account = await findById(id);

    if (account) {
      return res.status(200).json(account);
    }

    res.status(400)
      .json({message: `No account found with id ${id}`});
  }
  catch (err) {
    res.status(500)
      .json({
        error: 'Server error',
        err
      })
  }
})

/*
@POST: New Account
@PARAMS: account[obj]!
@ROUTE: "/accounts"
*/

/*
@PUT: Account
@PARAMS: id[STRING]! name[STRING]!
@ROUTE: "/accounts/:id"
*/

/*
@DELETE: Account
@PARAMS: id[STRING]!
@ROUTE: "/accounts/:id"
*/


module.exports = server;
