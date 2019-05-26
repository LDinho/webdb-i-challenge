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

    res.status(404)
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

server.post('/accounts', async (req, res) => {
  const newAccount = req.body;

  try {

    const accounts = await find();

    const result = accounts.filter((account) => {
      return newAccount.name === account.name;

    }) // checking for duplicate account names
    // to show custom error message.
    // However, in the sqlite db schema,
    // we already do check that, as name is required to be unique.

    console.log("RESULT::", result);

    if (result.length) {
      return res.status(400)
        .json({
          message: `account ${newAccount.name} already exist`
        });
    } else {

      add(newAccount);
      return res.status(201).json(newAccount);
    }
  }
  catch (err) {
    return res.status(500)
      .json({
        err,
        message: 'Server error'

      })
  }
})

/*
@PUT: Account
@PARAMS: id[STRING]! name[STRING]!
@ROUTE: "/accounts/:id"
*/

server.put('/accounts/:id', async (req, res) => {
  const { id } = req.params;
  const accountChanges = req.body;

  try {
    await update(id, accountChanges)
      ?   res.status(200).json(accountChanges)
      :   res.status(404)
             .json({message: `account does not exist`})
  }
  catch (err) {
    res.status(500)
       .json({
         error: `Unable to process the request`,
         err
       })
  }
});

/*
@DELETE: Account
@PARAMS: id[STRING]!
@ROUTE: "/accounts/:id"
*/

server.delete('/accounts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await remove(id)
      ?   res.status(200)
             .json({message: `account has been deleted`})
      :   res.status(404)
             .json({message: `account does not exist.`});
  }
  catch (err) {
    res.status(500)
       .json({error: `Server error`});
  }

});


module.exports = server;
