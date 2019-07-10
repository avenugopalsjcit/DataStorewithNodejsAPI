'use strict';

const express = require('express');
const JSON = require('circular-json');
const app = express();
app.enable('trust proxy');


const {Datastore} = require('@google-cloud/datastore');

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
     .order('Id', {descending: true});
    

  return datastore.runQuery(query);
};







app.get('/', async (req, res, next) => {
  // Create a visit record to be stored in the database
  var i=0;
  const visit ={
    Name: "venu",
    
    Id: 22
  };

  try {
    await insertVisit(visit);
    const [entities] = await getVisits();
      
    res
      .status(200)
      .set('Content-Type', 'application/json')
      .send(`Customers=:\n${JSON.stringify(entities)}`)
      .end();
  } catch (error) {
    next(error);
  }
});








app.get('/:id', async (req, res) => {
  // Create a visit record to be stored in the database
  var i=0;
  
  const visit ={
    Name: "venu",
  
    Id: 23
  };

  try {
    await insertVisit(visit);
    var customerid = parseInt(req.params.id, 10)
  const querycust = datastore
  .createQuery('customer')
  .filter('Id', '=', customerid);

await datastore.runQuery(querycust).then(results => {
 const  customers = results[0];
  
  res
  .status(200)
  .set('Content-Type', 'application/json')
  .send(`CustomersbyID=:\n${JSON.stringify(customers)}`)
  .end();
  
})
.catch(err => { console.error('ERROR:', err); });  
  } catch (error) {
    next(error);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});