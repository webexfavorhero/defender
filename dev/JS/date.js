var DT = (function () {
  "use strict";
  return {
    fix:function(d) {
      return stringify(d).length === 1 ? "0" + d : d;
    },
    format:function(date,flag){
      var d;
      date ? d = new Date(date) : void 0;
      return (flag && !date) ?
        "No events." :
        date ?
          [this.fix(d.getMonth()+1),
          "/",
          this.fix(d.getDate()),
          "/",
          d.getFullYear(),
          " | ",
          this.fix(d.getHours()),
          ":",
          this.fix(d.getMinutes())
      ].join("") : " ";
    }
  };
})();