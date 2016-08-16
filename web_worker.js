var debug = require('debug')('web_worker');
debug('start');

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var flash = require('connect-flash');
var favicon = require('serve-favicon');
var path = require('path');
var nconf = require('nconf');
var async = require('async');
var compression = require('compression');

var log = require('./td_common/libs/log');
require('./td_common/libs/config');

// process

process.on('uncaughtException', function(err) {
  log.error('Caught exception: ' + err);
});

process.on('exit', function(code) {
  log.info('Exit with code:', code);
});

function sigExit () {
  log.info('signal -> exit');
  process.exit(0);
}

process.on('SIGTERM', sigExit);
process.on('SIGINT' , sigExit);

// app

var app = express();

app.use(compression());     // gzip compression
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
                      // for parsing application/x-www-form-urlencoded
app.use(multer());          // for parsing multipart/form-data

// request logging
app.use(require('morgan')("dev", {stream: log.stream} ));

// static folders
app.use(express.static(path.join(__dirname, 'public')));

// favicon
app.use(favicon(__dirname + '/public/favicon.ico'));

// redirect from non-www to www
function wwwRedirect (req, res, next) {
  var redirectTo;
  if (req.headers.host.match(/^localhost/) || req.headers.host.match(/^127./)){
    return next();
  } else if (req.headers.host.match(/^\d*\.\d*\.\d*\.\d*/)) {
    var site = nconf.get('app:site');
    if (site.match(/\d*\.\d*\.\d*\.\d*/)) {
      return next();
    } else {
      redirectTo = site + req.originalUrl;
    }
  } else if (!req.headers.host.match(/^www\./)) {
    redirectTo = req.protocol + '://www.' + req.headers.host + req.originalUrl;
  } else {
    return next();
  }
  res.redirect(301, redirectTo);
}
if (nconf.get('app:wwwRedirect')) {
  app.use(wwwRedirect);
}

// views engine: mustache
var mustachex = require('mustachex');
app.engine('html', mustachex.express);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// connect to DB
var db = require('./td_common/libs/db');
db.connectToDb();

// connect to redis
var redis = require('./libs/redis');

// authentication (passport.js)
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var sessionStore = new RedisStore({ client: redis });
app.use(session({
  key: nconf.get('app:sessionKey'),
  secret: nconf.get('app:sessionSecret'),
  cookie: { maxAge: 30*24*60*60*1000 }, // 30 days
  resave: true,
  saveUninitialized: true,
  store: sessionStore
}));
app.use(flash());

require('./libs/auth')(app);

// headers
var cacheResponseDirective = require('express-cache-response-directive');
app.use(cacheResponseDirective()); // for cacheControl

app.use(function setHeaders (req, res, next) {
  res.cacheControl('no-cache');
  return next();
});

////////////////////////////
// Create or update admins
var User = require('./models/user');

var admins = nconf.get('admins');
async.eachSeries(admins, function iterator (admin, eachSeriesCallback) {
  log.info('Admin ' + admin.email);
  User.findOne({ email: admin.email }, function (err, user) {
    if (err) { return eachSeriesCallback(err); }
    if (!user) {
      user = new User({ email: admin.email,
                        createdAt: Date.now(),
                        contacts: [{
                          name: "Me",
                          email: admin.email }]
                      });
    }
    for (var key in admin) {
      if (user.get(key) != admin[key]) {
        user.set(key, admin[key]);
      }
    }
    if (user.isModified()) {
      user.save(function(err) {
        eachSeriesCallback(err);
      });
    } else {
      eachSeriesCallback(null);
    }
  });
}, function finish (err) {
  if (err) { log.error(err.message); }
});

// Specific code
if (process.env.SPECIFIC_CODE) {
  require(process.env.SPECIFIC_CODE);
}

///////////
// routes

// common routes
app.use('/', require('./routes/index'));
app.use('/index2', require('./routes/index2'));
app.use('/signup', require('./routes/signup'));
app.use('/login', require('./routes/login'));
app.use('/forgot', require('./routes/forgot'));
app.use('/privacy', require('./routes/privacy'));
app.use('/tos', require('./routes/tos'));

// user routes
app.use('/dashboard', require('./routes/dashboard'));
app.use('/logout', require('./routes/logout'));

// user hidden routes
app.use('/package', require('./routes/package'));
app.use('/products', require('./routes/products'));
app.use('/services', require('./routes/services'));

// external routes
app.use('/reset', require('./routes/reset'));
app.use('/resolve', require('./routes/resolve'));
app.use('/paypal', require('./routes/paypal'));

app.use('/status.json', require('./routes/status.json'));
// admin routes
if (app.get('env') === 'development') {
  app.use('/admin/agenda', require('./routes/admin/agenda'));
}

 // test routes
if (app.get('env') === 'development') {
  app.use('/test', require('./routes/test'));
  app.use('/json', require('./routes/json'));
}


// websockets

function handleWebsockets(server) {
  var websockets = require('./libs/websockets');
  var dashboard = require('./controllers/dashboard');
  var contacts = require('./controllers/contacts');
  var profile = require('./controllers/profile');
  var timezones = require('./controllers/timezones');
  var packages = require('./controllers/packages');
  var products = require('./controllers/products');
  var services = require('./controllers/services');

  websockets.createOnServer(server);
  websockets.setAuthentication(sessionStore);
  websockets.addHandlers(dashboard.websocketHandlers);
  websockets.addHandlers(contacts.websocketHandlers);
  websockets.addHandlers(profile.websocketHandlers);
  websockets.addHandlers(timezones.websocketHandlers);
  websockets.addHandlers(packages.websocketHandlers);
  websockets.addHandlers(products.websocketHandlers);
  websockets.addHandlers(services.websocketHandlers);
  websockets.applyHandlers();
}

// sockets

function handleSockets() {
  var socket = require('./td_common/libs/socket');
  var txTrdfCo = require('./messages/tx_trdf_co');

  socket.bindPull();
  socket.addMessageHandlers(txTrdfCo.messageHandlers);
  socket.applyMessageHandlers();
}


function afterCreateServer (server) {
  handleWebsockets(server);
  handleSockets();
}
exports.afterCreateServer = afterCreateServer;


exports.app = app;

