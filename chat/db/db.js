require('dotenv').config()
const { throws } = require('assert');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const { MongoClient } = require('mongodb');
const { allowedNodeEnvironmentFlags } = require('process');
let message = {}
let user = {}
let room = 'noRoom'
let mis = {}
app.use(bodyParser.json())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.unsubscribe(bodyParser.json())
app.use(cors({
              origin: [
              'http://localhost:3000',
              'http://localhost:2700',
              'http://localhost:3010']
            }));

app.get('/messages/', (req, res) => {
              console.log('req: '+req+' res: '+res)

              
              mainLoad()
              // .then(console.log)
              .then(console.log('success'))
              .catch(console.error)
              .finally(() => client.close())
              // console.log(JSON.stringify(mis))
              // res.send(JSON.stringify(mes))
              res.send(JSON.stringify(mis))
              // res.send('<h1>Hey MondoDB</h1>');
})
app.post('/messages/', (req, res) => {
              let mes = 'Message received on MongoDB node'
              room  = req.body.message.room
              message = req.body.message
              user = req.body.user
              console.log('received post: '+req.body.message+' with res: '+'res')
              console.log('received post: '+req.body.user.name+' with res: '+'res')
              console.log('received message from : '+user.name+' message: '+message)
              main()
              .then(console.log)
              .catch(console.error)
              .finally(() => client.close())
              // console.log(Object.getOwnPropertyNames(req.body.user.name))
              res.send(JSON.stringify(mes))
              return message, user, room
            })

const url = process.env.DB_URL
//  || 'mongodb+srv://chat:DLDA5wxUBYpu4vj@cluster0.dme9q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// Database Name
const colName = room
const client = new MongoClient(url)
// Database Name
const dbName = 'Cluster0'

async function main() {
  // Use connect method to connect to the server
  await client.connect()
  console.log('Connected successfully to server')
  const db = client.db(dbName)
  const collection = db.collection(colName)

  // the following code examples can be pasted here...
  const insertResult = await collection.insertOne({user:user, message:message})
  console.log('Inserted documents =>', insertResult)

//   const findResult = await collection.find({}).toArray()
//               console.log('Found documents =>', findResult)

  return 'done.'
}

async function mainLoad() {
              // Use connect method to connect to the server
              await client.connect()
              console.log('Connected successfully to server')
              const db = client.db(dbName)
              const collection = db.collection(colName)
            
              // the following code examples can be pasted here...
              // const insertResult = await collection.insertOne({user:user, message:message})
              // console.log('Inserted documents =>', insertResult)
            
              const findResult = await collection.find({}).toArray()
              //             console.log('Found documents =>', findResult)
            mis = {result: findResult}
              return mis
            }




app.listen(2700, function() {
              console.log('listening on 2700')
            })