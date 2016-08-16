var SRV = (function (R,MW,El) {
  var data=function(d) {
      return d.map(function(e){
        return {cs:e.cs,nm:e.nm,pc:e.pc+"$",pd:e.pd,ln:e.ln};
      });
    },
    template=function (d) {
      return d.map(function(e){
        return {
          t:"div",
          c:"service rd group",
          a:[{
            t:"div",
            c:"p_icon "+e.cs
          },{
            t:"p",
            c:"sr_nm tac bold fl",
            a:e.nm
          },{
            t:"p",
            c:"sr_pc tac bold fl",
            a:"Price "+e.pc
          },{
            t:"p",
            c:"sr_pd tac bold fl",
            a:"Period "+e.pd
          },{
            t:"a",
            c:"sr_buy btn btn_grn tac rd bold fl db",
            l:e.ln,
            a:"Buy"
          }]
        };
      });
    },
    windowTemplate=function(d) {
      return [{
        t:"h1",
        c:"mh tac bold ttu",
        a:"Buy Extra slot"
      },{
        t:"button",
        i: "cmw",
        c: "cmw pa",
        a: {
          t: "svg",
          vb:"0 0 13 13",
          par:"xMinYMin slice",
          a: {
            t: "use",
            xlink: "#cross"
          }
        }
      },{
        t:"div",
        c:"services",
        a:d
      }];
    };
  return {
    handler:function(d){
      R.r(El.fbi("mw"),false,windowTemplate(template(data(d))));
      MW.open();
    }
  };
})(render,MW,elm);