module.exports = {
  redisHost: process.env.REDIS_HOST, // URL/Hostname from the envirnoment variables 
  redisPort: process.env.REDIS_PORT, // Port to connect from the envirnoment variables
  pgUser: process.env.PGUSER,
  pgHost: process.env.PGHOST,
  pgDatabase: process.env.PGDATABASE,
  pgPassword: process.env.PGPASSWORD,
  pgPort: process.env.PGPORT
};
