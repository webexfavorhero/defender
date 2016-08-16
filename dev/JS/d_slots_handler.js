var SH = (function (GO,M,C,I,El,R,Ev,W,S,V,DT) {
  "use strict";
  var swsDisable=function () {
      Array.prototype.slice.call(arguments,0).map(function(e){
        C.a(e[1],"disabled");
        e[0].disabled=true;
      });
    },
    swsEnable=function () {
      Array.prototype.slice.call(arguments,0).map(function(e){
        C.r(e[1],"disabled");
        e[0].disabled=false;
      });
    },
    confirmTemplate=function (d) {
      return {
        t:"div",
        c:"confmw rd group pf zi2",
        i:"confmw",
        a:[{
          t:"input",
          p:"hidden",
          i:"confid",
          v:d.i
        },{
          t:"h2",
          c:"confh tac bold fl",
          a:d.m
        },{
          t:"button",
          i:"confirm",
          c:"confirm bold btn btn_red rd fl",
          a:d.a
        },{
          t:"button",
          i:"cancel",
          c:"cancel bold btn btn_grn rd fr",
          a:"cancel"
        }]
      };
    },
    closeConfirmWindow=function (e) {
      var te=Ev.t(e),
        t=te.t,
        v=El.fbi("confid").value,
        id=t.id,
        usr=idss(v,3,0)==="usr";
      Ev.s(te.e);
      id==="confirm"?
        (usr?
          UH.removeUrlEmiter(idss(v,3)):
        void 0,
        idss(v,5,0)==="co_rm"?
          UH.removeContactEmiter(idss(v,5)):
        void 0):
      void 0;
      (id==="cancel"||id==="confirm")?(El.remove(t.parentElement),usr?El.hide(El.fbi("mwr")):void 0):void 0;
    },
    lastVisitorTimer=function(d) {
      var diff;
      return d?
        (diff=Date.now()-new Date(d),
          [(diff>=86400000?
            [Math.floor(diff/86400000),":"].join(""):
            ""),
           (diff>=3600000?
            [DT.fix(Math.floor(diff/3600000%24)),":"].join(""):
            ""),
           (diff>=60000?
            [DT.fix(Math.floor(diff/60000%60)),":"].join(""):
            "00:"),
           (diff>=1000?
            DT.fix(Math.floor(diff/1000%60)):
            "00")
          ].join("")
      ):void 0;
    },
    manualTestTimer=function (d,t) {
      var s = d,
      i = W.setInterval(function () {
        t.textContent=(--s < 1)?
          (clearInterval(i),
          "manual check"):
          (parseInt(s % 60,10)<10)?
            "0"+parseInt(s % 60,10):
            parseInt(s % 60,10);
      },1000);
    },
    flagSlotTemplate=function (e) {
      return e.ms.map(function (f) {
        return {
          t:"div",
          i:"fbg"+e._id,
          c:"fbg fl group" + ((f.st==="ok")?" s_ok":" s_false"),
          a:[{
            t:"div",
            i:"fbn"+e._id,
            c:"fbn fl",
            a:f.nm
          },{
            t:"div",
            i:"fbs"+e._id,
            c:"fbs fl tac",
            a:f.st
          },{
            t:"div",
            i:"fbd"+e._id,
            c:"fbd tac fl",
            a:DT.format(f.dt)
          }]
        };
      });
    },
    flagSlotTemplateGenerator=function (d,f) {
      return d.map(function (e) {
        return {
          t:"div",
          c:"fls rd bold group",
          i:"fs"+e._id,
          a:[{
            t:"div",
            i:"fsn"+e._id,
            c:"fsn fl",
            a:GO._nms[e._id]
          },{
            t:"div",
            c:"fsbs fl",
            a:flagSlotTemplate(e)
          }]
        };
      });
    },
    flagBlockListWindowTemplate=function (d) {
      return [{
        t:"h1",
        c:"mh tac rd bold",
        a:"Flagged slots"
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
        c:"fbl rd group bold tac",
        a:[{
            t:"p",
            c:"fl fblsn",
            a:"Slot name"
          },{
            t:"p",
            c:"fl fblbn",
            a:"Base name"
          },{
            t:"p",
            c:"fl fblbs",
            a:"Status"
          },{
            t:"p",
            c:"fl fblbd",
            a:"Change date"
          }]
      },{
        t:"div",
        i:"flsg",
        c:"flsg tal group",
        a:d
      }];
    };
  return {
    manualTest:function(t,id) {
      S.emit("check slot",{_id:idss(id,3)});
      V.db(t);
      W.setTimeout(V.eb,60000,t);
      manualTestTimer(60,t);
    },
    statusClassToggle:function(n) {
      console.log("statusClassToggle n: ", n);
      return !n ? "s_ok" :"s_false";
    },
    flagStatusRenderer:function(n) {
      console.log("flagStatusRenderer n: ", n);
      return !n?"OK":"Flagged";
    },
    serverStatusToggle:function(n) {
      console.log("serverStatusToggle n: ", n);
      return n==="ok"?"s_ok":"s_false";
    },
    trafficStatusRenderer:function(a,b) {
      return a===0||!!b===false?"No traffic":stringify(a);
    },
    contactsOptionsRenderer:function(co,arr_id) {
      return co.map(function(e) {
        return {t:"option",c:"bold tal",v:e._id,a:e.nm,s:(arr_id.indexOf(e._id)!= -1 ?true:false)};
      });
    },
    trafficOptionsRenderer:function(num) {
      var to=[],
        t,
        i=0;
      for (i; i < 16; i++) {
        t={t:"option",v:stringify(i)};
        t.a=i===0?"Snooze":stringify(i)+" min";
        t.c="bold tal";
        num==i?t.s=true:t.s=false;
        to.push(t);
      }
      return to;
    },
    lastVisitorRenderer:function(d,id) {
      return d?(GO.editLv(d,id),lastVisitorTimer(d)):"Disabled";
    },
    updateVisitorCounter:function() {
      var id,
        u,
        lv = GO._lv;
      for(id in lv) {
        u = lastVisitorTimer(lv[id]);
        (El.fbi("_lv" + id).innerHTML !== u && !I.u(u)) ? El.html(El.fbi("_lv" + id), u): void 0;
      }
    },
    notificationClassToggle:function(a) {
      return a?a===0?"nt_f":a===1?"nt_s":a===2?"nt_t":"nt_empty":"nt_empty";
    },
    disableSwitch:function(id,xsw,f) {
      var msw=El.fbi("msw"+id),
        fsw=El.fbi("fsw"+id),
        ssw=El.fbi("ssw"+id),
        tsw=El.fbi("tsw"+id),
        f_sw=El.fbi("f_sw"+id),
        s_sw=El.fbi("s_sw"+id),
        t_sw=El.fbi("t_sw"+id),
        fst=El.fbi("fst"+id),
        fcb=El.fbi("fcb"+id),
        sst=El.fbi("sst"+id),
        tst=El.fbi("tst"+id),
        _lv=El.fbi("_lv"+id),
        nm=El.fbi("_nm"+id).innerHTML;
      msw.checked===false?
        (GO.pg!=="starter"?
          swsDisable([fsw,f_sw],[ssw,s_sw],[tsw,t_sw]):
          swsDisable([ssw,s_sw],[tsw,t_sw]),
        (f&&xsw==="msw"?
          M.handler({w:"Slot "+nm+" has been disabled."}):
          void 0)):
        (GO.pg!=="starter"?
            swsEnable([fsw,f_sw],[ssw,s_sw],[tsw,t_sw]):
            swsEnable([ssw,s_sw],[tsw,t_sw]),
        (f&&xsw==="msw"?
          M.handler({i:"Slot "+nm+" has been enabled."}):
        void 0));
      fsw.checked===false?
        (C.a(fst,"disabled"),
        V.db(fcb),
        f&&xsw==="fsw"?M.handler({w:"Flag checking has been disabled for slot "+nm+"."},30):
      void 0):
      (C.r(fst,"disabled"),
      V.eb(fcb,"disabled"),
      f&&xsw==="fsw"?M.handler({i:"Flag checking has been enabled for slot "+nm+"."},30):void 0);
      ssw.checked===false?
      (C.a(sst,"disabled"),f&&xsw==="ssw"?M.handler({w:"Server checking has been disabled for slot "+nm+"."},30):void 0):
      (C.r(sst,"disabled"),f&&xsw==="ssw"?M.handler({i:"Server checking has been enabled for slot "+nm+"."},30):void 0);
      tsw.checked===false?
      (C.a(tst,"disabled"),C.a(_lv,"disabled"),(f&&xsw==="tsw"?M.handler({w:"Traffic checking has been disabled for slot "+nm+"."},30):void 0)):
      (C.r(tst,"disabled"),C.r(_lv,"disabled"),(f&&xsw==="tsw"?M.handler({i:"Traffic checking has been enabled for slot "+nm+"."},30):void 0));
    },
    confirmWindow:function (d) {
      R.r(El.fbi("mwr"),true,confirmTemplate(d));
      Ev.a(El.fbi("confmw"),"click",closeConfirmWindow);
      El.show(El.fbi("mwr"));
      El.fbi("cancel").focus();
    },
    flagBlockLists:function(f,t) {
      return f>0?stringify(f)+" / "+stringify(t):false;
    },
    flagBlockListClass:function (f) {
      return f?"":" dn";
    },
    flagBlockListHandler:function(d){
      R.r(El.fbi("mw"),false,flagBlockListWindowTemplate(flagSlotTemplateGenerator(d)));
      GO.mw=true;
      MW.open();
    },
    repitedName:function(nn,cn) {
      var nms=GO._nms,
        k;
      if(cn!==nn) {
        for(k in nms) {
          if(nms[k]===nn){
            return nn;
          }
        }
      }
    },
    repitedUrl:function (nu,cu) {
      var urls=GO._urls,
        k;
      if(cu!==nu) {
        for(k in urls) {
          if(urls[k]===nu) {
            return nu;
          }
        }
      }
    }
  };
})(GO,msg,cls,is,elm,render,evnt,window,SIO,VAL,DT);