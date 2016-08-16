var PD = (function (R,MW,El) {
  var data=function (d) {
      return d.map(function(e){
        return {cs:e.cs,nm:e.nm,pc:e.pc+"$",ln:e.ln};
      });
    },
    template=function (d) {
      return d.map(function(e){
        return {
          t:"div",
          c:"product fl rd",
          a:[{
          t:"div",
          c:"p_icon "+e.cs
        },{
            t:"p",
            c:"pd_nm tac bold",
            a:e.nm
          },{
            t:"p",
            c:"pd_pc tac bold",
            a:"Price "+e.pc
          },{
            t:"a",
            c:"pd_buy tac bold btn btn_grn rd db",
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
        a:"Buy SMS"
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
        c:"products group",
        a:d
      }];
    };
    return {
      handler:function (d) {
        R.r(El.fbi("mw"),false,windowTemplate(template(data(d))));
        MW.open();
      }
    };
})(render,MW,elm);