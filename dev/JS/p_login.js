var LP = (function(El,Ev,L,V,LG,P,W) {
  var em=El.fbi("email"),
    pw=El.fbi("pass"),
    rm=El.fbi("rememberme"),
    ls=El.fbi("ls"),
    valPw=function(t,v){
      return V.tpw(v)?V.c(t):V.i(t);
    },
    valEm=function(t,v){
      return V.tem(v)?V.c(t):V.i(t);
    };
  Ev.a(rm,"change",LG.remember);
  Ev.a(em,"blur",LG.validation);
  Ev.a(pw,"blur",LG.validation);
  Ev.a(em,"input",LG.toggle);
  Ev.a(pw,"input",LG.toggle);
  Ev.a(ls,"click",LG.enterDashboard);
  (L && L.getItem("rememberme"))?
    (em.value===""?
      (em.value=L.getItem("email"),
      valEm(em,em.value)):
    void 0,
    rm.checked=L.getItem("rememberme")):
  void 0;
  P.start();
})(elm,evnt,localStorage,VAL,LG,page,window);