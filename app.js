//use const ES6 standards OR ES5 standard which is var
const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');
const db = mongojs('catalog', ['products']); //database fisrt, second is collection

//initialise express
const app = express();

const port = 3000;
//middleware for bodyparser
app.use(bodyParser.json());

//Make it public, allowing to be used in any domain
//CORS in ExpressJS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//create a route/s
//Home
app.get('/', (req, res, next) => {
  res.send('Please use /api/products');
}); //es6 funciton the arrow

//Fetch all produts
app.get('/api/products', (req, res, next) =>{
  db.products.find((err, docs) => {
    if(err){
      res.send(err);
    }
    console.log('Products found');
    res.json(docs);

  }); //callback function, docs is what will be returned
});

//Fetch single products
app.get('/api/products/:id', (req, res, next) =>{
  db.products.findOne({_id: mongojs.ObjectID(req.params.id)}, (err, doc) => {
    if(err){
      res.send(err);
    }
    console.log('Products found');
    res.json(doc);

  });
});

//Add product (POST request)
app.post('/api/products', (req, res, next) =>{
  db.products.insert(req.body, (err, doc) => {
    if(err){
      res.send(err);
    }
    console.log('Adding product..');
    res.json(doc);
  }); //send the entire body
});

//Update Product (PUT request)
app.put('/api/products/:id', (req, res, next) =>{
  db.products.findAndModify({query: {_id: mongojs.ObjectID(req.params.id)},
      update:{
        $set:{
          name: req.body.name,
          category: req.body.category,
          details: req.body.details,
          price: req.body.price
        }},
        new: true }, (err, doc) =>{ //the new:true like an upsert, so if it cant find that object it will simply add the product if not,
          if(err){
            res.send(err);
          }
          console.log('Updating product....'),
          res.json(doc);
        })
});

//Delete Product
app.delete('/api/products/:id', (req, res, next) =>{
  db.products.remove({_id: mongojs.ObjectID(req.params.id)}, (err,doc) =>{
    if(err){
      res.send(err);
    }
    console.log('Deleting product');
    res.json(doc);
  });
});

//To run the server
app.listen(port, () => {
  console.log('Server started on port ' + port)
});
