var debug = require('debug')('products');

var nconf = require('nconf');
var _ = require('lodash');

function getProducts (userId, callback) {
  var message = {};
  var prds = [];
  var products = nconf.get('products');
  for (var productKey in products) {
    var product = products[productKey];
    var prd = {
      id: product.id,
      tp: product.type,
      nm: product.name,
      sm: product.sms,
      pc: product.price,
      cs: product.css,
      ln: '/products?productId=' + product.id,
    };
    prds.push(prd);
  }
  debug('prds: ' + JSON.stringify(prds));
  callback (prds, message);
}

exports.websocketHandlers = [

  function getProductsHandler (socket, userId) {
    socket.on('get products', function () {
      debug('get products');
      getProducts(userId, function (products, message) {
        socket.emit('products', products);
        if (!_.isEmpty(message)) {
          socket.emit('message', message);
        }
      });
    });
  },

];

