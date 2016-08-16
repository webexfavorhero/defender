var url = require('url');


// TODO:
function canonicalize(uri) {
  return uri;
}
exports.canonicalize = canonicalize;

// // TODO:
// function equal(uriA, uriB) {
//   return uriA === uriB;
// }
// exports.equal = equal;

function stripQuery (uri) {
  return uri.split("?")[0].split("#")[0];
}
exports.stripQuery = stripQuery;

function extractDomain (uri) {
  return url.parse(uri).host.split(':')[0];
}
exports.extractDomain = extractDomain;

