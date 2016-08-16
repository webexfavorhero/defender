var debug = require('debug')('config');

var nconf = require('nconf');
var fs = require('fs');
var _ = require('lodash');

var log = require('./log');

nconf.argv();

var config = {};
var configFiles = [
  'config.json',
  'business.json',
  'admins.json',
  'local_config.json'
];
if (process.env.CONFIG) {
  configFiles.push(process.env.CONFIG);
}
if (nconf.get('config')) {
  configFiles.push(nconf.get('config'));
}

for (var i in configFiles) {
  var configFile = configFiles[i];
  if (!fs.existsSync(configFile)) {
    log.warn('Can not open config file ' + configFile);
  } else {
    debug('configFile: ' + configFile);
    var fileContent = fs.readFileSync(configFile, 'utf8');
    debug('fileContent: ' + fileContent);
    try {
      var json = JSON.parse(fileContent);
    } catch (err) {
      log.error('Parse config json error: ' + err.message);
      process.exit(1);
    }
    debug('json: ' + JSON.stringify(json));
    log.info((i++ === 0 ? 'Load' : 'Merge') +
             ' config from file ' + configFile);
    config = _.merge(config, json);
  }
}

nconf.argv()
     .env('__')
     .defaults(config);

exports.nconf = nconf;

