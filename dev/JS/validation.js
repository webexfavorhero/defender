var VAL = (function(C,M,El,W) {
  "use strict";
  return {
    a:function (t) {
      C.f(t,"complete")?
        C.r(t,"complete"):
      void 0;
      C.f(t,"incomplete")?
        C.r(t,"incomplete"):
      void 0;
      !C.f(t,"attention")?
        C.a(t,"attention"):
      void 0;
    },
    i:function (t) {
      C.f(t,"attention")?
        C.r(t,"attention"):
      void 0;
      C.f(t,"complete")?
        C.r(t,"complete"):
      void 0;
      !C.f(t,"incomplete")?
        C.a(t,"incomplete"):
      void 0;
    },
    c:function (t) {
      C.f(t,"attention")?
        C.r(t,"attention"):
      void 0;
      C.f(t,"incomplete")?
        C.r(t,"incomplete"):
      void 0;
      !C.f(t,"complete")?
        C.a(t,"complete"):
      void 0;
    },
    db:function (t) {
      !t.disabled?
        (C.a(t,"disabled"),
        t.disabled=true):
      void 0;
    },
    eb:function (t) {
      t.disabled?
        (C.r(t,"disabled"),
        t.disabled=false):
      void 0;
    },
    msg: function (m,t) {
      m?
        (VAL.a(t),
        M.handler({w:m},10)):
      void 0;
    },
    e: function (me,t,m){
      console.log("V.e this: ",this, " t: ", t);
      var err;
      El.html(me,m);
      t?
        this.a(t):
      void 0;
      El.show(me);
      err?
        W.clearTimeout(err):
      void 0;
      err=W.setTimeout(function(){El.clear(me);El.hide(me);W.clearTimeout(err);},10000);
    },
    tem: function(v) {
      return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
    },
    tph: function (v) {
      return /^\+\d+/.test(v);
    },
    tpw:function (v) {
      return /(?=^.{12,}$)(?=.*\d)(?=.*[!@#$%^&*"'?.>,<~`+=)(}{\]\[|/]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(v);
    },
    turl:function (v) {
      return /^https?:\/\/(((www\.)?[a-z0-9@:%.\-_\+~#=]{2,256}\.[a-z]{2,8})|(\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b))(:[1-9]\d{1,4})?(\/[a-zA-Z0-9\_\-\s\.\/\?\%\#\&\=]*)?/.test(v);
    }
  };
})(cls,msg,elm,window);