var SP = (function(El,Ev,SG,P) {
  var em=El.fbi("email"),
    ag=El.fbi("alabel"),
    ss=El.fbi("ss");
  P.start();
  Ev.a(em, "blur", SG.blurValidation);
  Ev.a(em, "input", SG.validation);
  Ev.a(em, "input", SG.toggle);
  Ev.a(ag, "click", SG.toggle);
  Ev.a(ss, "click", SG.submit);
})(elm,evnt,SG,page);