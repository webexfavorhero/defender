var SG2 = (function (El,Ev,C,V,M,L,P) {
  var un=El.fbi("username"),
    em=El.fbi("email"),
    pw=El.fbi("pw"),
    pw2=El.fbi("pw2"),
    ph=El.fbi("ph"),
    tz=El.fbi("tz"),
    beta=El.fbi("beta-standard-0.1"),
    str=El.fbi("starter-0.1"),
    std=El.fbi("standard-0.1"),
    pro=El.fbi("pro-0.1"),
    pg=El.fbi("packages"),
    su=El.fbi("su"),
    me=El.fbi("s2me"),
    valPw=function(t,v){
      return V.tpw(v)?V.c(t):V.i(t);
    },
    valPh=function(t,v){
      return (v===""||V.tph(v))?V.c(t):V.i(t);
    },
    valUn=function(t,v){
      (v!==""||v.length>40)?V.c(t):V.i(t);
    },
    signup2Allow=function(e){
      var te=Ev.t(e),
        t=te.t,
        id=t.id;
      Ev.s(te.e);
      C.f(t,"radiolabel")?
        !El.fbi(t.htmlFor).checked?
          El.fbi(t.htmlFor).checked=true:
        El.fbi(t.htmlFor).checked=false:
      void 0;
      (C.f(t,"radiolabel")||id===un.id||id===pw.id||id===pw2.id||id===ph.id)?
         (pw.value===pw2.value&&
        V.tpw(pw2.value)&&
        (ph.value===""||V.tph(ph.value))&&
        (str.checked||std.checked||pro.checked||beta.checked)&&
        un.value!==""&&un.value.length<41)?
          V.eb(su):
        V.db(su):
      void 0;
    },
    signup2InputValidation=function (e) {
      var te=Ev.t(e),
        t=te.t,
        id=t.id,
        val=t.value;
      id===pw.id?
        valPw(pw,val):
      id===pw2.id?
        valPw(pw2,val):
      id===ph.id?
        (L?
          (ph.value!==""?
            L.setItem("ph",ph.value):
          void 0):
        void 0,
        ph.value=val.replace(/[^0-9\+]/g,""),
        valPh(ph,val)):
      id===un.id?
        (L?
          L.setItem("un",un.value):
        void 0,
        valUn(un,val)):
      void 0;
    },
    signup2Validation=function(e) {
      var te=Ev.t(e),
        t=te.t,
        id=t.id,
        val=t.value;
      (id===pw.id ||id===pw2.id) ?
        val==="" ?
          V.e(me,"Password field should not be empty."):
        !V.tpw(val) ?
          V.e(me,t,"Password is not strong enough. Password should contain: lowercase uppercase number special characters and length minimum 12 characters."):
        V.c(t):
      void 0;
      (id===pw2.id&&val!==pw.value) ?
        V.e(me,t,"Password and Repeat password fields doesn't match."):
      V.c(t);
      id===un.id ?
        val==="" ?
          V.e(me,t,"Password field should not be empty."):
        val.length>40 ?
          V.e(me,t,"Username should not be longer than 40 characters."):
        void 0:
      void 0;
      id===ph.id ?
        (val!==""&&!V.tph(val)) ?
          V.e(me,t,"Phone number should start with '+' sign and contain only digits"):
        (val===""||V.tph(val)) ?
          V.c(t):
        void 0:
      void 0;
    },
    signup2Submit=function(e) {
      var te=Ev.t(e);
      Ev.s(te.e);
      (V.tpw(pw.value)&&pw.value===pw2.value&&(ph.value===""||V.tph(ph.value))&&(str.checked||std.checked||pro.checked||beta.checked)&&un.value!==""&&un.value.length<41)?
        (su.submit(),
        L?
          (L.removeItem("tz"),
          L.removeItem("un"),
          L.removeItem("ph")):
        void 0):
        ((ph.value!==""&&V.tph(ph.value))?
          (ph.focus(),
          V.a(ph)):
        void 0,
        (un.value===""||un.value.length>40)?
          (un.focus(),
          V.a(un)):
        void 0,
        !V.tpw(pw.value)?
          (pw.focus(),
          V.a(pw)):
        void 0,
        !V.tpw(pw2.value)?
          (pw2.focus(),
          V.a(pw2)):
        void 0,
        V.e(me,false,"Please, Fill the SignUp form."));
    };
    P.start();
    V.c(em);
    Ev.a(pw,"blur",signup2Validation);
    Ev.a(pw2,"blur",signup2Validation);
    Ev.a(ph,"blur",signup2Validation);
    Ev.a(un,"blur",signup2Validation);
    Ev.a(pw,"input",signup2InputValidation);
    Ev.a(pw,"input",signup2Allow);
    Ev.a(pw2,"input",signup2InputValidation);
    Ev.a(pw2,"input",signup2Allow);
    Ev.a(ph,"input",signup2InputValidation);
    Ev.a(ph,"input",signup2Allow);
    Ev.a(un,"input",signup2InputValidation);
    Ev.a(un,"input",signup2Allow);
    Ev.a(tz,"change",function (e) {
      var te=Ev.t(e),
        t=te.t;
      V.c(t);
      L?
        L.setItem("tz",tz.value):
      void 0;
    });
    L?
      (L.getItem("ph")?
        (ph.value=L.getItem("ph"),
        valPh(ph, ph.value)):
      void 0,
      L.getItem("un")?
        (un.value=L.getItem("un"),
        valUn(un, un.value)):
      void 0,
      L.getItem("tz")?
        (tz.value=L.getItem("tz"),
        V.c(tz)):
      void 0):
    void 0;
    Ev.a(pg,"click",signup2Allow);
    Ev.a(su,"click",signup2Submit);
})(elm,evnt,cls,VAL,msg,localStorage,page);