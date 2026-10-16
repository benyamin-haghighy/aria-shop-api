const {Redis} = require('ioredis')
const config = require('./config.app')
const redis = new Redis(config.redis.uri)

module.exports = redis