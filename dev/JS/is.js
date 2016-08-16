var is = (function() {
  return {
    a: function(o) {
      return(typeof o === "object" && o.length);
    },
    o: function(o) {
      return(typeof o === "object");
    },
    s: function(o) {
      return(typeof o === "string");
    },
    b: function(o) {
      return(typeof o === "boolean");
    },
    u: function(o) {
      return(typeof o === "undefined");
    }
  };
})();