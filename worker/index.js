// This is initiated and configured in package.json

// Require express and redis libraries
const keys = require('./keys'); // Used to connect to Redis
const redis = require('redis');

// Setup connection to redis server
const redisClient = redis.createClient({
  host: keys.redisHost, 
  port: keys.redisPort,
  retry_strategy: () => 1000 // Says if a connection to redis is lost, try to reconnect every 1000ms (1 sec)
});

const sub = redisClient.duplicate();

// Formula to calculate 
function fib(index) {
  // if the index is less than 2 return a fib value of 1
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2); 
}

// Any time we get a new message run this callback function
// message = index value submitted
sub.on('message', (channel, message) => {
  //hset hash value  
  redisClient.hset('values', message, fib(parseInt(message)));  
});

// Anytime someone inserts a new value to redis
sub.subscribe('insert');