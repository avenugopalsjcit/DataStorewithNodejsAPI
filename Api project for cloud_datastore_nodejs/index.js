'use strict';
const express = require('express');
const app = express();
const { Datastore } = require('@google-cloud/datastore');

// Instantiate a datastore client
const datastore = new Datastore();

//Fetching customers default page.
app.get('/', async (req, res, next) => {     
    res.send("Welcome");    
});

//Fetching customers.
app.get('/api/customers',  (req, res, next) => { 
  const querycust = datastore
  .createQuery('customer');
  datastore.runQuery(querycust).then(results => {
    res
    .status(200)
    .set('Content-Type', 'application/json')
    .send(results);   
  }).catch(err=>{
    console.log(err);
  }); 
});

//Fetching customers by Id.
app.get('/api/customers/:id',  (req, res,next) => { 
  var customerid = parseInt(req.params.id, 10);
  const querycust = datastore
    .createQuery('customer')
    .filter('Id', '=', customerid);
   datastore.runQuery(querycust).then(results => {    
    res
    .status(200)
    .set('Content-Type', 'application/json')
    .send(results[0][0]);  
  }).catch(err => {
    console.log(err);  
});
});

const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
