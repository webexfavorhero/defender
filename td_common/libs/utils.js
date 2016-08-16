var crypto = require('crypto');

function randomToken (len) {
  if (!len) {
    len = 16;
  }
  return crypto.randomBytes(Math.ceil(len * 3 / 4))
      .toString('base64')   // convert to base64 format
      .slice(0, len)        // return required number of characters
      .replace(/\+/g, '0')  // replace '+' with '0'
      .replace(/\//g, '0'); // replace '/' with '0'
}
exports.randomToken = randomToken;

function getRandomItem (items) {
  return items[Math.floor(Math.random()*items.length)];
}
exports.getRandomItem = getRandomItem;

function removeAnsiColors (string) {
  return string.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}
exports.removeAnsiColors = removeAnsiColors;

