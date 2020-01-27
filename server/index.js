// This is initiated and configured in package.json
// Require keys
const keys = require('./keys'); // Used to connect to Redis

// ###########################################################################
// Express App Setup
// ###########################################################################
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Setup App that will respond to any HTTP requests coming or going back to the REACT application
const app = express(); 

app.use(cors());            // Setup Cross Origin Resource Sharing (CORS) requests from one domain to different domain/port that express API is on.
app.use(bodyParser.json()); // Parse incoming requests from the REACT application and turn the body of the POST request into a JSON value   

// ###########################################################################
// Postgres Client Setup - Express App to Postgres Communication
// ###########################################################################
const { Pool } = require('pg');

const pgClient = new Pool ({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

// Error listening
pgClient.on('error', () => console.log('Lost PG connection'));

// Create table inside database 
pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(err => console.log(err)); // catch any errors

// ###########################################################################  
// Redis Client Setup
// ###########################################################################
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

// According to redis documentation duplicates are required to perform multiple actions ie listen, publish, etc 
const redisPublisher = redisClient.duplicate();

// ###########################################################################  
// Express Route Handler 
// ###########################################################################

// When user requests root, respond Hi
app.get('/', (req, res) => {
  res.send('Hi');
});

// Used to query postgres for all values ever submitted
app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');
  
  // Send only row results back to user:
  res.send(values.rows);
});

// Used to query redis for values
app.get('/values/current', async (req, res) => {
  // Get all hash values from redis
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

// Used for submit button 
app.post('/values', async (req, res) => {
  // get the index entered by the user
  const index = req.body.index;
  
  // Cap the user to 40
  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }
  
  // Add index to redis and use place holder for fib value
  redisClient.hset('values', index, 'Nothing yet!');
  // Engage worker process to calculate value
  redisPublisher.publish('insert', index);
  // Add user input (index) to postgres
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  // Loading
  res.send({ working: true });
});

// Assign listening port
app.listen(5000, err => {
  console.log('Listening');
});