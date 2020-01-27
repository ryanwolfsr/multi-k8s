//Connect to redis
module.exports = {
  redisHost: process.env.REDIS_HOST, // URL/Hostname from the envirnoment variables 
  redisPort: process.env.REDIS_PORT  // Port to connect from the envirnoment variables
};
