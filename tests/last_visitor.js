//var d = new Date('2015-07-23T07:25:50.053Z');
var d = new Date('2015-07-08T21:15:45.379Z');

var is = {
  a: function(o) {
    return (typeof o === "object" && o.length);
  },
  o: function(o) {
    return (typeof o === "object");
  },
  s: function(o) {
    return (typeof o === "string");
  },
  b: function(o) {
    return (typeof o === "boolean");
  },
  u: function(o) {
    return (typeof o === "undefined");
  }
};

function stringify(d) {
  return is.s(d)?d:""+d;
}

function dateFormater(date,flag) {
  var d;
  date?d=new Date(date):void 0;
  return (flag&&!date)?"No events.":date?
  [dateFormatCorrector(d.getMonth()),
  "/",
  dateFormatCorrector(d.getDate()),
  "/",
  d.getFullYear(),
  " | ",
  dateFormatCorrector(d.getHours()),
  ":",
  dateFormatCorrector(d.getMinutes())].join(""):" ";
}

function dateFormatCorrector(d) {
  return stringify(d).length === 1 ? "0"+d :d;
}

var lastVisitorTimer=function(d) {
  var diff;
  return d?
    (diff=Date.now()-new Date(d),
      [(diff>=86400000?
        [Math.floor(diff/86400000),":"].join(""):
        ""),
       (diff>=3600000?
        [dateFormatCorrector(Math.floor(diff/3600000%24)),":"].join(""):
        ""),
       (diff>=60000?
        [dateFormatCorrector(Math.floor(diff/60000%60)),":"].join(""):
        "00:"),
       (diff>=1000?
        dateFormatCorrector(Math.floor(diff/1000%60)):
        "00")
      ].join("")
  ):void 0;
};

var x = lastVisitorTimer(d);
console.log('x: ', x);

