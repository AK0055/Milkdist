console.log('>>Milk Distro<<');
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import express from 'express'
import inquirer from 'inquirer'
import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === 'production' });
const url = process.env.MONGO_URI;
const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));
const PORT = process.env.PORT ||3002;


const questions = [
  {
    type: 'input',
    name: 'id',
    message: "Enter milk bottle ID:",
  },
  {
    type: 'list',
    name: 'type',
    message: "Enter milk type:('Normal' or 'Premium'):",
    choices: ['Normal', 'Premium']
  },
  {
    type: 'input',
    name: 'qty',
    message: "Enter quantity of milk bottles:",
  },
  {
    type: 'list',
    name: 'day',
    message: "Enter day of the week:",
    choices: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
      'Sunday']
  },
];
const dayer = [

  {
    type: 'input',
    name: 'cap',
    message: "Set capacity for all days:",
  },
];
const updater = [

  {
    type: 'list',
    name: 'type',
    message: "Update milk type:('Normal' or 'Premium'):",
    choices: ['Normal', 'Premium']
  },
  {
    type: 'input',
    name: 'qty',
    message: "Update quantity of milk bottles:",
  },
  {
    type: 'list',
    name: 'day',
    message: "Enter day of the week:",
    choices: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
      'Sunday']
  },
];
const updaterstatus = [

  {
    type: 'list',
    name: 'status',
    message: "Update order status:",
    choices: ['Placed', 'Packed', 'Dispatched', 'Delivered']
  },
];
app.get('/add', (req, res) => {
  inquirer.prompt(questions).then(answers => {
    const ads = [
      {
        id: answers.id,
        day: answers.day,
        milktype: answers.type,
        qty: answers.qty,
        status: 'Placed'
      }
    ];
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var myobj = { id: answers.id, day: answers.day, milktype: answers.type, qty: answers.qty, status: 'Placed' };
      dbo.collection("orders").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 order recieved");
        db.close();
      });


    });
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var updatedcap = -1 * Number(answers.qty)
      var myquery = { day: answers.day };
      var newvalues = { $inc: { cap: updatedcap } };
      dbo.collection("daycapacity").updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("capacity for the day updated");
        db.close();
      });
    });




  });
});

// return all dist
app.get('/', (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("orders").find({}, { projection: { _id: 0, id: 1, milktype: 1, qty: 1, status: 1 } }).toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
      db.close();
    });
  });

});
app.get('/update/:id', (req, res) => {
  const qid = req.params.id;
  inquirer.prompt(updater).then(answers => {


    MongoClient.connect(url, function (err, db) {


      if (err) throw err;
      var dbo = db.db("mydb");
      var myquery = { id: qid };
      var newvalues = { $set: { milktype: answers.type, qty: answers.qty } };
      dbo.collection("orders").updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 order updated");
        db.close();
      });
    });
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var updatedcap = -1 * Number(answers.qty)
      var myquery = { day: answers.day };
      var newvalues = { $inc: { cap: updatedcap } };
      dbo.collection("daycapacity").updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("capacity for the day updated");
        db.close();
      });
    });




  });


});
app.get('/updateStatus/:id', (req, res) => {
  const qid = req.params.id;
  inquirer.prompt(updaterstatus).then(answers => {


    MongoClient.connect(url, function (err, db) {


      if (err) throw err;
      var dbo = db.db("mydb");
      var myquery = { id: qid };
      var newvalues = { $set: { status: answers.status } };
      dbo.collection("orders").updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("status updated");
        db.close();
      });
    });
    



  });


});
app.get('/setday', (req, res) => {
  inquirer.prompt(dayer).then(answers => {


    MongoClient.connect(url, function (err, db) {


      if (err) throw err;
      var dbo = db.db("mydb");
      var myvalues = [{ day: 'Monday', cap: Number(answers.cap) }, { day: 'Tuesday', cap: Number(answers.cap) }, { day: 'Wednesday', cap: Number(answers.cap) },
      { day: 'Thursday', cap: Number(answers.cap) },
      { day: 'Friday', cap: Number(answers.cap) },
      { day: 'Saturday', cap: Number(answers.cap) },
      { day: 'Sunday', cap: Number(answers.cap) }
      ]

      dbo.collection("daycapacity").insertMany(myvalues, function (err, res) {
        if (err) throw err;
        console.log("capacity set");
        db.close();
      });
    });




  });


});
app.get('/delete/:id', (req, res) => {
  const qid = req.params.id;


  MongoClient.connect(url, function (err, db) {


    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { id: qid };
    dbo.collection("orders").deleteOne(myquery, function (err, res) {
      if (err) throw err;
      console.log('order deleted');
      db.close();
    });
  });

});
app.get('/checkCapacity/:date', (req, res) => {
  const day = req.params.date;


  MongoClient.connect(url, function (err, db) {


    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { day: day };
    dbo.collection("daycapacity").find(myquery, { projection: { _id: 0, day: 1, cap: 1 } }).toArray(function (err, result) {
      if (err) throw err;
      res.send(result);

      db.close();
    });
  });






});
app.get('/checkCapacity', (req, res) => {


  MongoClient.connect(url, function (err, db) {


    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("daycapacity").find({}, { projection: { _id: 0, day: 1, cap: 1 } }).toArray(function (err, result) {
      if (err) throw err;
      res.send(result);

      db.close();
    });
  });

});
// starting the server
app.listen(PORT, () => {
  console.log('listening on port: '+PORT);
});