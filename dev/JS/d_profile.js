var PF = (function (GO,R,Ev,S,MW,El,M,V,DT) {
  "use strict";
  var profileDataHandler=function(d) {
      return {
        un:d.un,em:d.em,ph:d.ph,pl:d.pl,pd:d.pd==1?"Enabled":"Disabled",pdc:d.pd==1?"s_ok":"s_false",pa:d.pa?d.pa:"",sm:stringify(d.sm),es:stringify(d.es),ca:DT.format(d.ca),tz:timeZoneOptionsGenerator(d.tz)
      };
    },
    updateProfileRenderHandler=function(d) {
      var un,em,ph,sm;
      hop(d,"un")?(
        un=El.fbi("pr_un"),
        un.value=d.un,
        un.placeholder=d.un,
        M.handler({d:"Profile Username "+d.un+" has been saved."},10)):
      void 0;
      hop(d,"em")?(
        em=El.fbi("pr_em"),
        em.value=d.em,
        em.placeholder=d.em,
        M.handler({d:"Profile Email "+d.em+" has been saved."},10)):
      void 0;
      hop(d,"ph")?(
        ph=El.fbi("pr_ph"),
        ph.value=d.ph,
        ph.placeholder=d.ph,
        M.handler({d:"Profile Phone number "+d.ph+" has been saved."},10)):
      void 0;
      hop(d,"tz")?(
        El.fbi("pr_tz").value=d.tz,
        GO.tz=d.tz,
        M.handler({d:"Profile Timezone "+d.tz+" has been saved."},10)):
      void 0;
      hop(d,"sm")?(
        El.fbi("pr_fs")?
          El.fbi("pr_fs").value=d.sm:
        void 0,
        El.html(El.fbi("sms"),""+d.sm),
        M.handler({d:d.sm+" SMS left"},10)):
      void 0;
    },
    timeZoneOptionsGenerator=function(tz) {
      return GO._tz.map(function(e){
        return{t:"option",v:e,a:e,s:e===tz?true:false};
      });
    },
    profileModalWindowTemplate=function(d) {
      return [{
        t:"h1",
        c:"mh tac bold ttu",
        a:"Profile"
      },{
        t:"button",
        i: "cmw",
        c: "cmw pa",
        a: {
          t: "svg",
          vb:"0 0 13 13",
          par:"xMinYMin slice",
          a: {
            t: "use",
            xlink: "#cross"
          }
        }
      },{
        t:"div",
        c:"pr_box group pr",
        a:[{
          t:"h2",
          c:"mh2 bold",
          a:"Account Details"
        },{
          t:"div",
          c:"pfme_row fl pr",
          a:{
            t:"p",
            i:"pfme",
            c:"orange tac bold",
            a:""
          }
        },{
          t:"div",
          c:"pr_row pr fr group",
          a:[{
            t:"label",
            c:"pr_l bold fl db tar",
            f:"pr_pt",
            a:"Account status"
          },{
            t:"p",
            i:"pr_pd",
            c:"pr_p fl bold ttu db tal " + d.pdc,
            a:d.pd
          }]
        },{
          t:"div",
          c:"pr_row pr fl group",
          a:[{
            t:"label",
            c:"pr_l bold fl db tar",
            f:"pr_un",
            a:"Username"
          },{
            t:"input",
            p:"text",
            i:"pr_un",
            c:"pr_i rd bold fl db tal",
            v:d.un,
            r:d.un
          }]
        },{
          t:"div",
          c:"pr_row pr fl group",
          a:[{
            t:"label",
            c:"pr_l bold fl db tar",
            f:"pr_em",
            a:"Email"
          },{
            t:"input",
            p:"text",
            i:"pr_em",
            c:"pr_i rd bold fl db tal",
            v:d.em,
            r:d.em
          }]
        },{
          t:"div",
          c:"pr_row pr fl group",
          a:[{
            t:"label",
            c:"pr_l bold fl db tar",
            f:"pr_ph",
            a:"Phone"
          },{
            t:"input",
            p:"text",
            i:"pr_ph",
            c:"pr_i rd bold fl db tal",
            v:d.ph,
            r:d.ph
          }]
        },{
          t:"div",
          c:"pr_row pr fl group",
          a:[{
            t:"label",
            c:"pr_l bold fl db tar",
            f:"pr_tz",
            a:"Timezone"
          },{
            t:"select",
            i:"pr_tz",
            c:"pr_tz rd db tal bold",
            a:d.tz
          },{
            t:"div",
            c:"selectlabel plabel pa zi1",
            a:{
              t:"svg",
              vb:"0 0 9 6",
              par:"xMinYMin slice",
              a:{
                t:"use",
                xlink:"#s_arr"
              }
            }
          }]
        },{
          t:"div",
          c:"pr_row pr fl group",
          a:{
            t:"button",
            i:"pr_ed",
            c:"pr_ed btn btn_blue rd bold pa",
            a:"Save"
          }
        }]
      },{
        t:"div",
        c:"pr_box group pr",
        a:[{
          t:"h2",
          c:"mh2 bold",
          a:"Account Details"
        },{
          t:"div",
          c:"pr_row pr fl group",
          a:[{
            t:"label",
            c:"pr_l bold fl db tar",
            f:"pr_pl",
            a:"Current plan"
          },{
            t:"p",
            i:"pr_pl",
            c:"pr_p fl bold ttu db tal",
            a:d.pl + " " + d.pa
          }]
        },{
          t:"div",
          c:"pr_row pr fl group",
          a:[{
            t:"label",
            c:"pr_l bold fl db tar",
            f:"pr_fs",
            a:"Available SMS"
          },{
            t:"p",
            i:"pr_fs",
            c:"pr_p fl bold ttu db tal",
            a:d.sm
          }]
        },{
          t:"div",
          c:"pr_row pr fl group",
          a:[{
            t:"label",
            c:"pr_l bold fl db tar",
            f:"pr_ca",
            a:"Created at"
          },{
            t:"p",
            i:"pr_ca",
            c:"pr_p fl bold ttu db tal",
            a:d.ca
          }]
        },{
          t:"div",
          c:"pr_row pr fl group",
          a:[{
            t:"label",
            c:"pr_l bold fl db tar",
            f:"pr_es",
            a:"Extra slots"
          },{
            t:"p",
            i:"pr_es",
            c:"pr_p fl bold ttu db tal",
            a:d.es
          }]
        }]
      },{
        t:"div",
        c:"pr_box group pr",
        a:[{
          t:"h2",
          c:"mh2 bold",
          a:"Password reset"
        },{
          t:"div",
          c:"prme_row pr",
          a:{
            t:"p",
            i:"pwrme",
            c:"orange tac bold",
            a:""
          }
        },{
          t:"div",
          c:"pr_row pr group",
          a:[{
            t:"label",
            c:"pr_l bold fl db tar",
            f:"pr_cp",
            a:"Current password"
          },{
            t:"input",
            p:"password",
            i:"pr_cp",
            c:"pr_i rd bold fl db tal"
          }]
        },{
          t:"div",
          c:"pr_row pr group",
          a:[{
            t:"label",
            c:"pr_l bold fl db tar",
            f:"pr_np",
            a:"New Password"
          },{
            t:"input",
            p:"password",
            i:"pr_np",
            c:"pr_i rd bold fl db tal"
          }]
        },{
          t:"div",
          c:"pr_row pr group",
          a:[{
            t:"label",
            c:"pr_l bold fl db tar",
            f:"pr_np2",
            a:"Repeat new Password"
          },{
            t:"input",
            p:"password",
            i:"pr_np2",
            c:"pr_i rd bold fl db tal"
          }]
        },{
          t:"button",
          i:"pr_rp",
          c:"pr_rp rd btn btn_blue bold disabled",
          d:true,
          a:"Reset Password"
        }]
      }];
    },
    editProfileEmiter=function() {
      var un=El.fbi("pr_un"),
        unv=un.value,
        unp=un.placeholder,
        ph=El.fbi("pr_ph"),
        phv=ph.value,
        php=ph.placeholder,
        em=El.fbi("pr_em"),
        emv=em.value,
        emp=em.placeholder,
        tzv=El.fbi("pr_tz").value;
      S.emit("edit profile",{un:unv!==unp?unv:void 0,em:emv!==emp?emv:void 0,ph:phv!==php?phv:void 0,tz:tzv!==GO.tz?tzv:void 0});
    },
    resetPasswordEmiter=function(e) {
      var te=Ev.t(e),
        cp=El.fbi("pr_cp").value,
        np=El.fbi("pr_np").value;
      Ev.s(te.e);
      (cp!==""&&V.tpw(np))?S.emit("edit profile",{cp:cp,ps:np}):void 0;
    },
    clearProfileEvents=function() {
      Ev.r(El.fbi("pr_un"),"blur",profileValidationHandler);
      Ev.r(El.fbi("pr_un"),"input",profileAllowHandler);
      Ev.r(El.fbi("pr_em"),"blur",profileValidationHandler);
      Ev.r(El.fbi("pr_em"),"input",profileAllowHandler);
      Ev.r(El.fbi("pr_ph"),"blur",profileValidationHandler);
      Ev.a(El.fbi("pr_ph"),"input",profileAllowHandler);
      Ev.r(El.fbi("pr_ed"),"click",editProfileEmiter);
      Ev.r(El.fbi("pr_cp"),"blur",passwordValidationHandler);
      Ev.r(El.fbi("pr_cp"),"input",passwordAllowHandler);
      Ev.r(El.fbi("pr_np"),"blur",passwordValidationHandler);
      Ev.r(El.fbi("pr_np"),"input",passwordAllowHandler);
      Ev.r(El.fbi("pr_np2"),"blur",passwordValidationHandler);
      Ev.r(El.fbi("pr_np2"),"input",passwordAllowHandler);
      Ev.r(El.fbi("pr_rp"),"click",resetPasswordEmiter);
      Ev.r(El.fbi("cmw"),"click",clearProfileEvents);
    },
    profileEventHandler=function() {
      Ev.a(El.fbi("pr_un"),"blur",profileValidationHandler);
      Ev.a(El.fbi("pr_un"),"input",profileAllowHandler);
      Ev.a(El.fbi("pr_em"),"blur",profileValidationHandler);
      Ev.a(El.fbi("pr_em"),"input",profileAllowHandler);
      Ev.a(El.fbi("pr_ph"),"blur",profileValidationHandler);
      Ev.a(El.fbi("pr_ph"),"input",profileAllowHandler);
      Ev.a(El.fbi("pr_ed"),"click",editProfileEmiter);
      Ev.a(El.fbi("pr_cp"),"blur",passwordValidationHandler);
      Ev.a(El.fbi("pr_cp"),"input",passwordAllowHandler);
      Ev.a(El.fbi("pr_np"),"blur",passwordValidationHandler);
      Ev.a(El.fbi("pr_np"),"input",passwordAllowHandler);
      Ev.a(El.fbi("pr_np2"),"blur",passwordValidationHandler);
      Ev.a(El.fbi("pr_np2"),"input",passwordAllowHandler);
      Ev.a(El.fbi("pr_rp"),"click",resetPasswordEmiter);
      Ev.a(El.fbi("cmw"),"click",clearProfileEvents);
    },
    profileAllowHandler=function(e){
      var te=Ev.t(e),
        t=te.t,
        id=t.id,
        val=t.value,
        pl=t.placeholder,
        ed=El.fbi("pr_ed");
      id==="pr_un"?
        (val==="")?
          (V.i(t),V.db(ed)):
        (V.c(t),V.eb(ed)):
      id==="pr_em"?
        (!V.tem(val)||val==="")?
          (V.i(t),V.db(ed)):
        (V.c(t),V.eb(ed)):
      id==="pr_ph"?
        (!V.tph(val)&&val!=="")?
          (V.i(t),V.db(ed)):
        (V.c(t),V.eb(ed)):
      void 0;
    },
    profileValidationHandler=function(e) {
      var te=Ev.t(e),
        t=te.t,
        id=t.id,
        val=t.value,
        pl=t.placeholder,
        me=El.fbi("pfme");
      Ev.s(te.e);
      t.value=((id==="pr_un"||id==="pr_em")&&val==="")?pl:t.value;
      id==="pr_em" ?
        !V.tem(val) ?
          V.e(me,t,"Enter proper contact email address."):
        val.length>254 ?
          V.e(me,t,"Contact email should not be longer than 254 characters."):
        void 0:
      void 0;
      id==="pr_ph" ?
        (!V.tph(val)&&val!=="")?
          (V.e(me,t,"Phone number should start with '+' sign."),
           t.value=val.replace(/[^0-9\+]/g,"")):
        void 0:
      void 0;
      (V.tem(val)&&val.length<=254) ?
        V.c(t):
      V.i(t);
    },
    passwordAllowHandler=function(e){
      var te=Ev.t(e),
        t=te.t,
        id=t.id,
        val=t.value,
        cp=El.fbi("pr_cp"),
        np=El.fbi("pr_np"),
        np2=El.fbi("pr_np2"),
        rp=El.fbi("pr_rp");
      (val===""||!V.tpw(val))?
        V.i(t):
      V.c(t);
      (V.tpw(cp.value)&&V.tpw(np.value)&&V.tpw(np2.value))?
        V.eb(rp):V.db(rp);
      ((np.value===np2.value)&&V.tpw(np.value))?(V.c(np),V.c(np2)):(V.i(np),V.i(np2));
    },
    passwordValidationHandler=function (e) {
      var te=Ev.t(e),
      t=te.t,
      id=t.id,
      val=t.value,
      cp=El.fbi("pr_cp"),
      np=El.fbi("pr_np"),
      np2=El.fbi("pr_np2"),
      me=El.fbi("pwrme");
      (val==="")?
        (id===cp.id)?
          V.e(me,t,"Password field should not be empty."):
        (id===np.id)?
          V.e(me,t,"New Password field should not be empty."):
        (id===np2.id)?
          V.e(me,t,"Repeat Password field should not be empty."):
        void 0:
      void 0;
      ((id===np.id||id===np2.id||id===cp.id)&&!V.tpw(val))?
        V.e(me,t,"Password is not strong enough. Password should contain: lowercase uppercase number special characters and length minimum 12 characters."):
      void 0;
      (id===np2.id&&np2.value!==np.value)?
        (V.e(me,t,"Password and Repeat password fields doesn't match."),
         V.a(np)):
      void 0;
      (id===cp.id&&val!=="")?
        V.c(t):
      V.i(t);
    };
  return {
    emit:function(e) {
      var te=Ev.t(e);
      Ev.s(te.e);
      GO.mw ?
        MW.close():
      void 0;
      GO.mw=true;
      V.db(El.fbi("pr"));
      S.emit("get profile",{});
    },
    render:function(d) {
      R.r(mw,false,profileModalWindowTemplate(profileDataHandler(d)));
      profileEventHandler();
      MW.open();
    },
    update:function(d) {
      var un,em,ph,sm;
      hop(d,"un")?(
        un=El.fbi("pr_un"),
        un.value=d.un,
        un.placeholder=d.un,
        M.handler({d:"Profile Username "+d.un+" has been saved."},10)):
      void 0;
      hop(d,"em")?(
        em=El.fbi("pr_em"),
        em.value=d.em,
        em.placeholder=d.em,
        M.handler({d:"Profile Email "+d.em+" has been saved."},10)):
      void 0;
      hop(d,"ph")?(
        ph=El.fbi("pr_ph"),
        ph.value=d.ph,
        ph.placeholder=d.ph,
        M.handler({d:"Profile Phone number "+d.ph+" has been saved."},10)):
      void 0;
      hop(d,"tz")?(
        El.fbi("pr_tz").value=d.tz,
        GO.tz=d.tz,
        M.handler({d:"Profile Timezone "+d.tz+" has been saved."},10)):
      void 0;
      hop(d,"sm")?(
        El.fbi("pr_fs")?
          El.fbi("pr_fs").value=d.sm:
        void 0,
        El.html(El.fbi("sms"),""+d.sm),
        M.handler({d:d.sm+" SMS left"},10)):
      void 0;
    }
  };
})(GO,render,evnt,SIO,MW,elm,msg,VAL,DT);