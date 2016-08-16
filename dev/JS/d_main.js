var DB = (function(GO,S,L,Ev,El,M,P,TB,W,SU,PF,PK,PD,SRV,CO,SR,V) {
  "use strict";
  S.emit('get dashboard', {});
  S.emit("get timezones", {});
  (L&&(!L.getItem("loggedIn")))?
    L.setItem("loggedIn",Js(true)):
  void 0;
  Ev.a(El.fbi("lg"),"click",P.logout.bind(P));
  Ev.a(El.fbi("tb"),"click",TB.handler);
  Ev.a(El.fbi("co"),"click",CO.handler);
  Ev.a(El.fbi("tb2"),"click",TB.bulkEmiter);
  Ev.a(El.fbi("pr"),"click",PF.emit);
  setInterval(SH.updateVisitorCounter,1000);
  S.on('error',function(d) {
    M.handler({e: "Unable to connect to the server. Page has been reloaded!"});
    location.reload();
  });
  S.on("profile updates",function(d) {
    PF.update(d);
  });
  S.on("profile",function(d) {
    GO.tz = d.tz;
    PF.render(d);
    GO.mw = true;
  });
  S.on('connect',function() {
    setTimeout(M.handler, 5000,{i:"Connection successfull"},5);
  });
  S.on('message',function(d) {
    M.handler(d);
  });
  S.on("packages",function(d) {
    PK.handler(d);
  });
  S.on("products",function(d) {
    PD.handler(d);
  });
  S.on("services",function(d) {
    SRV.handler(d);
  });
  S.on("remove contacts",function(d) {
    d.map(function(e){
      M.handler({i: "Contact "+e.nm+" was removed!"});
      CO.remove(e._id);
    });
  });
  S.on("remove slots",function(d) {
    SU.removeUrl(d);
  });
  S.on("traffic script",function(d) {
    SR.generateScript(d);
    GO.mw = true;
  });
  S.on("timezones",function(d) {
    GO._tz = d;
  });
  S.on("flags",function (d) {
    SH.flagBlockListHandler(d);
  });
  S.on('dashboard',function(d) {
    GO.addCos(d.co);
    GO.pg = d.tb.cp;
    TB.render(d.tb);
    SR.render(d.s);
    P.start();
    S.on("update dashboard",function(d) {
      console.log("update dashboard S incoming : ",Js(d));
      d.s?SU.handler(d.s):void 0;
      d.co?CO.update(d.co):void 0;
    });
  });
})(GO,SIO,localStorage,evnt,elm,msg,page,TB,window,SU,PF,PK,PD,SRV,CO,SR,VAL);