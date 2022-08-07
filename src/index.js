console.log('Milk distro'); 
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import express from 'express'
import inquirer from 'inquirer'
import { MongoClient, ServerApiVersion } from 'mongodb'
const url = "mongodb://ak2:1234@cluster0-shard-00-00.lrmw0.mongodb.net:27017,cluster0-shard-00-01.lrmw0.mongodb.net:27017,clus \
    ter0-shard-00-02.lrmw0.mongodb.net:27017/?ssl=true&replicaSet=atlas-111t6w-shard-0&authSource=admin&retryWrites=true&w=majority";

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));
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
];
app.get('/add', (req, res) => {
inquirer.prompt(questions).then(answers => {
  const ads = [
    { id: answers.id,
        milktype: answers.type,
      qty: answers.qty}
  ];
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj =  {id: answers.id, milktype: answers.type, qty: answers.qty}
    dbo.collection("orders").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 order recieved");
        db.close();
    });
    });
    
    
    
    


});
});

// return all dist
app.get('/', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        dbo.collection("orders").find({},{ projection: { _id: 0, id: 1, milktype: 1, qty: 1 } }).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
      });
    
});


// starting the server
app.listen(3002, () => {
  console.log('listening on port 3002');
});