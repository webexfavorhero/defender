var page = (function (El,L,M,C,Ev,LG,SG,SC) {
  "use strict";
  return {
    l: El.fbi("login"),
    s: El.fbi("signup"),
    d: El.fbi("dash"),
    o: El.fbi("logout"),
    m: El.fbi("mwr"),
    open: function() {
      Ev.a(window,"scroll",SC.set);
      El.hide(this.m,El.fbi("bld"), El.fbi("ld"));
    },
    start:function() {
      (L&&L.getItem("msg"))?
        [].forEach.call(L.getItem("msg").split(","),function(e){
          (M.fill(e),M.handler(false,false,Jp(L.getItem(e))));
        }):
      void 0;
      (L&&L.getItem("loggedIn"))?
        L.getItem("loggedIn")?
          (this.l?
            El.hide(this.l):
          void 0,
          this.s?
            El.hide(this.s):
          void 0,
          this.d?
            (El.show(this.d),
             Ev.a(this.d,
                 "click",function(){
                  location.replace("https://www.trafficdefender.net/dashboard");
                })):
            void 0,
          this.o?
            (El.show(this.o),
            Ev.a(this.o,
                 "click",function(){
                  this.logout();
                })):
            void 0):
          void 0:
        void 0;
        this.l?
          Ev.a(this.l,"click",LG.open.bind(LG)):
        void 0;
        this.s?
          Ev.a(this.s,"click",SG.open.bind(SG)):
        void 0;
        this.open();
    },
    logout:function(){
      (L&&L.getItem("msg"))?
        (L.getItem("msg").split(",").map(function(e){L.removeItem(e);}),
        L.removeItem("msg"),
        L.removeItem("loggedIn")):
      void 0;
      El.show(this.m);
      location.replace("https://www.trafficdefender.net/logout");
    }
  };
})(elm,localStorage,msg,cls,evnt,LG,SG,scroll);