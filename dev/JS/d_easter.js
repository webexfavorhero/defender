var EE = (function (GO,C,Ev,El) {
  "use strict";
  var hl = El.fbi("hl");
  Ev.a(El.fbi("easter"),"click",function(){
    (C.f(hl,"dn"))?El.show(hl):El.hide(hl);
  });
  Ev.a(El.fbi("global"), "click", function() {
    console.log("Global Object Log : ", Js(GO));
  });
  Ev.a(El.fbi("global_mw"), "click", function() {
    console.log("Global Object mw Log : ", Js(GO.mw));
  });
  Ev.a(El.fbi("global_cosnf"), "click", function() {
    console.log("Global Object _cosnf Log : ", Js(GO._cosnf));
  });
  Ev.a(El.fbi("global_cosid"), "click", function() {
    console.log("Global Object _COSID Log : ", Js(GO._cosid));
  });
  Ev.a(El.fbi("global_nms"), "click", function() {
    console.log("Global Object _NMS Log : ", Js(GO._nms));
  });
  Ev.a(El.fbi("global_cosnm"), "click", function() {
    console.log("Global Object _COSNM Log : ", Js(GO._cosnm));
  });
})(GO,cls,evnt,elm);