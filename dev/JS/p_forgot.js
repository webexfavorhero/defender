var FG = (function (GO,Ev,El,V,M,P) {
  var fs = El.fbi("forgotsubmit"),
    em = El.fbi("email"),
    ff = El.fbi("ff"),
    forgotPassword=function(e) {
      var te=Ev.t(e),
        emv=em.value;
      Ev.s(te.e);
      (emv!==""&&V.tem(emv))?
        ff.submit():
      M.handler({w:"Please, Fill the Forgot password form."},10);
    },
    forgotValidation=function(e) {
      var te=Ev.t(e),
        t=te.t,
        id=te.t.id,
        val=te.t.value;
      id==="email"?
        (val!==""&&V.tem(val))?
          V.c(t):
          V.msg(val===""?
            "Email should not be empty.":
            !V.tem(val)?
              "Please enter correct email.":
              void 0,
              te.t):
          void 0;
      V.tem(val)?
        V.eb(fs):
      V.db(fs);
    },
    forgotInputValidation = function (e) {
      var te=Ev.t(e),
        t=te.t,
        val=te.t.value;
      V.tem(val)?
        (V.eb(fs),V.c(t)):
      (V.db(fs),V.i(t));
    },
    resetAllow=function (e) {
      var te=Ev.t(e),
        t=te.t,
        val=t.value;
      Ev.s(te.e);
      (t.id==="email")?
        (V.tem(val)?V.c(t):V.i(t)):
      void 0;
      V.tem(val)?
        V.eb(fs):
      V.db(fs);
    };
  Ev.a(em,"blur",forgotValidation);
  Ev.a(em,"input",forgotInputValidation);
  Ev.a(em, "keyup", resetAllow),
  Ev.a(fs,"click",forgotPassword);
  P.start();
})(GO,evnt,elm,VAL,msg,page);