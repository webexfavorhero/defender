var RS=(function(El,Ev,V,P){
  var rp = El.fbi("rp"),
    pw = El.fbi("pw"),
    pw2 = El.fbi("pw2"),
    rf =  El.fbi("rf"),
    passwordValidationHandler=function (e) {
      var te=Ev.t(e),
        t=te.t,
        id=t.id,
        val=t.value;
      V.msg((val===""&&(id===pw.id||id===pw2.id))?
        (V.a(t),"Password field should not be empty."):
        (!V.tpw(val)&&(id===pw.id||id===pw2.id))?
          (V.a(t),"Password is not strong enough. Password should contain: lowercase uppercase number special characters and length minimum 12 characters."):
          (id===pw2.id&&pw2.value!==pw.value)?
            (V.a(pw),V.a(pw2),"Password and Repeat password fields doesn't match."):
        void 0,
      t);
    },
    passwordAllowHandler=function(e){
      var te=Ev.t(e),
        t=te.t,
        val=t.value;
      (val===""||!V.tpw(val))?
        V.i(t):
      V.c(t);
      (V.tpw(pw.value)&&(pw.value===pw2.value))?
        V.eb(rp):
      V.db(rp);
    },
    submitResetPassword=function(e) {
      var te=Ev.t(e),
        id=te.t.id;
      Ev.s(te.e);
      (id==="rf"&&V.tpw(pw.value)&&(pw.value===pw2.value))?
        (rf.submit(),pw.value="",pw2.value=""):
      void 0;
    };
  Ev.r(El.fbi("pw"),"blur",passwordValidationHandler);
  Ev.r(El.fbi("pw"),"input",passwordAllowHandler);
  Ev.r(El.fbi("pw2"),"blur",passwordValidationHandler);
  Ev.r(El.fbi("pw2"),"input",passwordAllowHandler);
  Ev.a(El.fbi("rp"),"click",submitResetPassword);
  P.start();
})(elm,evnt,VAL,page);