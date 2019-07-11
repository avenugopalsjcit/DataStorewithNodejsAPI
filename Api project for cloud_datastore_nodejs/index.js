'use strict';
const express = require('express');
const JSON = require('circular-json');
const app = express();
app.enable('trust proxy');
const { Datastore } = require('@google-cloud/datastore');

// Instantiate a datastore client
const datastore = new Datastore();
/**
 * Insert a visit record into the database.
 *
 * @param {object} visit The visit record to insert.
 */
const insertVisit = visit => {
  return datastore.save({
    key: datastore.key('customer'),
    data: visit,
  });
};

/**
 * Retrieve the latest 10 visit records from the database.
 */
const getVisits = () => {
  const query = datastore
    .createQuery('customer')
    .order('Id', { descending: true });
  return datastore.runQuery(query);
};

//Fetching customers.
app.get('/', async (req, res, next) => {
  // Create a visit record to be stored in the database    
  const [entities] = await getVisits();
  res
    .status(200)
    .set('Content-Type', 'application/json')
    .send(`Customers=:\n${JSON.stringify(entities)}`)
    .end()
})

//Fetching customers by Id.
app.get('/:id', async (req, res) => {
  // Create a visit record to be stored in the database     
  var customerid = parseInt(req.params.id, 10)
  const querycust = datastore
    .createQuery('customer')
    .filter('Id', '=', customerid);
  await datastore.runQuery(querycust).then(results => {
    var jsonobject = results[0].reduce(function (r, o) {
      Object.keys(o).forEach(function (k) {
        r[k] = o[k];
      });
      return r;
    }, {});

    res
      .status(200)
      .set('Content-Type', 'application/json')
      .send(jsonobject)
      .end();
  }).catch(err => {
    console.log(err);
  })
});

const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
