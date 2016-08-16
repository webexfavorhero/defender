var SG = (function(GO,Ev,R,El,MW,M,V) {
  var template=function() {
      return [{
        t:"h1",
        c:"mh tac bold ttu",
        a:"SignUp"
      },{
        t:"button",
        i:"cmw",
        c:"cmw pa",
        a:{
          t:"svg",
          vb:"0 0 13 13",
          par:"xMinYMin slice",
          a:{
            t:"use",
            xlink:"#cross"
          }
        }
      },{
        t:"form",
        i:"sf",
        c:"sf",
        mt:"POST",
        ac:"/signup/activate",
        a:[{
          t:"div",
          c:"merow",
          a:{
            t:"p",
            i:"me",
            c:"me orange bold tac dn",
            a:""
          }
        },{
          t:"div",
          c:"mirow pr",
          a:[{
            t:"input",
            p:"email",
            n:"email",
            i:"email",
            c:"mi rd bold",
            r:"Email"
          }]
        },{
          t:"div",
          c:"mirow pr",
          a:[{
            t:"input",
            p:"checkbox",
            i:"agree",
            n:"agree",
            c:"agree pa",
            h:false
          },{
            t:"label",
            f:"agree",
            c:"alabel pa",
            i:"alabel",
            a:{
              t:"svg",
              vb:"0 0 18 14",
              par:"xMinYMin slice",
              a:{
                t:"use",
                xlink:"#check"
                }
            }
          },{
            t:"a",
            c:"terms pa bold",
            l:"/tos",
            g:"_blank",
            a:"Terms and conditions"
          },{
            t:"button",
            i:"ss",
            c:"c_btn m_btn pa rd bold disabled",
            a:"signup",
            d:true
          }]
        }]
      }];
    },
    validation=function (e) {
      var te=Ev.t(e),
        t=te.t;
      V.tem(t.value)?
        V.c(t):
      V.i(t);
    },
    submit=function(e) {
      var te=Ev.t(e),
        emv=El.fbi("email").value,
        me = El.fbi("me");
      Ev.s(te.e);
      (emv !== "" && V.tem(emv))?
        (El.fbi("sf").submit(),
         V.e(me,false,"Please, check your email box.")):
        void 0;
    },
    open=function (e) {
      var te=Ev.t(e);
      Ev.s(te.e);
      !GO.mw?
      (GO.mw=true,R.r(El.fbi("mw"),false,template()),
        Ev.a(El.fbi("email"),"blur",blurValidation),
        Ev.a(El.fbi("email"),"input",validation),
        Ev.a(El.fbi("email"),"input",toggle),
        Ev.a(El.fbi("alabel"),"click",toggle),
        Ev.a(El.fbi("ss"),"click",submit),
        MW.open()):
      void 0;
    },
    toggle=function (e) {
      var te=Ev.t(e),
        t=te.t,
        id=t.id,
        ss=El.fbi("ss"),
        ag=El.fbi("agree").checked,
        val=El.fbi("email").value;
      Ev.s(te.e);
      (id==="email")?
        V.tem(val)?
          V.c(t):
        V.i(t):
      void 0;
      (id==="alabel")?
        ag=(!ag?
          true:
        false):
      void 0;
      (V.tem(val)&&ag)?
        V.eb(ss):
      V.db(ss);
    },
    bv=function (e) {
      var te = Ev.t(e),
        t=te.t,
        id=t.id,
        val=t.value,
        me=El.fbi("me");
      if(id==="email"){
        if(val!==""&&V.tem(val)){
          V.c(t);
        }
        if(val === ""){
          V.e(me,t,"Email should not be empty.");
        } else if(!V.tem(val)){
          V.e(me,t,"Please enter correct email.");
        }
      }
    };
  return {
    validation:validation,
    toggle:toggle,
    blurValidation:bv,
    submit:submit,
    open:open
  };
})(GO,evnt,render,elm,MW,msg,VAL);