var MW=(function(GO,Ev,El,B,V) {
  "use strict";
  var w = El.fbi("mwr"),
    m = El.fbi("mw"),
    b=function(e){
      var te=Ev.t(e);
      Ev.s(te.e);
      (te.t.id==="cmw"||(e.which||e.keyCode)==27)?
        c():
      void 0;
    },
    c=function(){
      Ev.r(El.fbi("cmw"),"click",b);
      Ev.r(B,"keydown",b);
      V.eb(El.fbi("co"));
      V.eb(El.fbi("pr"));
      El.hide(w,m);
      El.clear(m);
      GO.mw=false;
    },
    o=function(){
      Ev.a(El.fbi("cmw"),"click",b);
      Ev.a(B,"keydown",b);
      El.show(w,m);
    };
  return {
    open:o,
    close:c
  };
})(GO,evnt,elm,document.body,VAL);