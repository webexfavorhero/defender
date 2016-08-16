var express = require('express');
var router = express.Router();

var os = require('os');
var gitRev = require('git-rev');
var shelljs = require('shelljs');

var utils = require('../td_common/libs/utils');
var db = require('../td_common/libs/db');

var redis = require('../libs/redis');


var packageJson = require('../package.json');

var git = {
  'short': '',
  'branch': '',
  'tag': '',
};

gitRev.short(function (short) {
  gitRev.branch(function (branch) {
    gitRev.tag(function (tag) {
      git.short = short;
      git.branch = branch;
      git.tag = tag;
    });
  });
});


router.get('/', function (req, res) {

  shelljs.exec('grep "error" ' + __dirname + '/../logs/log | tail -n 1',
               function (exitcode, logOutput) {
    var lastError = utils.removeAnsiColors(logOutput);
    var lastErrorTimestamp = Math.round((new Date(lastError.split(' ')[0])).
                                        getTime()/1000);

    res.send(JSON.stringify({
      hostname: os.hostname(),
      uptime: os.uptime(),
      loadavg: os.loadavg(),
      totalmem: os.totalmem(),
      freemem: os.freemem(),

      processUptime: process.uptime(),
      mongoConnect: db.isConnect(),
      redisConnect: redis.status === "ready" ? true : false,
      lastError: lastError,
      lastErrorTimestamp: lastErrorTimestamp,

      gitShort: git.short,
      gitBranch: git.branch,
      gitTag: git.tag,

      version: packageJson.version,
    }));

  });
});

module.exports = router;

