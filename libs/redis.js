var Redis = require('ioredis');
var nconf = require('nconf');

var log = require('../td_common/libs/log');
log.info('Connecting to Redis...');

var redis = new Redis(nconf.get('app:redis'));

module.exports = redis;

