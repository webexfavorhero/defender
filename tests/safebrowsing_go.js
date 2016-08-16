var debug = require('debug')('request');

var request = require('request');

function doSF (urls, uss, callback) {
  var body = 'urls=' + JSON.stringify(urls) + '&block=false';
  debug("body: " + body);

  request.post({ uri: "http://localhost:8080/",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body },
    function (err, res, body){
      if (err) {
        return callback(err);
      }
      debug("res.headers: " + JSON.stringify(res.headers));
      debug("res.statusCode: " + JSON.stringify(res.statusCode));
      debug('body: ' + body);
      var results = JSON.parse(body);
      debug('obj: ' + JSON.stringify(results));
      return callback(null, results);
  });
}


var urls = [ "http://windows-crash-report.info/Error/",
             "http://winsetupcostotome.easthamvacations.info/answered-polynomial-eccentricity-unserviceable/029287718218614814",
             "http://www.takhnatouna.com/Paypal/Paypal/" ];
doSF (urls, null, function (err, results) {
  for (var url in results) {
    var result = results[url];
    var status;
    if (result.hasOwnProperty('list')) {
      if (result.list === 'googpub-phish-shavar') {
        status = 'phishing';
      } else if (result.list === 'goog-malware-shavar') {
        status = 'malware';
      } else {
        status = result.list;
      }
    } else if (result.hasOwnProperty('isListed') && result.isListed) {
      status = 'listed';
    } else if (result.hasOwnProperty('fullHashRequested') &&
               result.fullHashRequested) {
      status = 'maybe';
    }
    var details = result;
    debug('url: ' + url + ', status: ' + status +
          ', details: ' + JSON.stringify(details));
  }
});

