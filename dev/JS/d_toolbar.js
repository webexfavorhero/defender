var TB = (function (R,El,Ev,S,MW,SH,V,W) {
  var toolbarData=function(o) {
      return {as:stringify(o.as),ts:stringify(o.ts),cp:o.cp,ap:o.ap,sms:stringify(o.sms)};
    },
    saveUrlEmiter=function(e) {
      var te=Ev.t(e),
        nmv=El.fbi("_nm").value,
        urlv=El.fbi("_url").value;
      Ev.s(te.e);
      (te.t.id==="_surl"&&nmv!==""&&!SH.repitedName(nmv,te.t.placeholder)&&nmv.length <= 140&&urlv.length <= 2000&&urlv!==""&&V.turl(urlv)&&!SH.repitedUrl(urlv,te.t.placeholder))?
      (S.emit("add slot",{_nm:nmv,_url:urlv}),Ev.r(El.fbi("_surl"),"click",saveUrlEmiter),removeValidationEventHandler(),MW.close()):void 0;
    },
    toolbarTemplate=function(s) {
      return [{
        t:"div",
        c:"newurl tb_box rd fl",
        a:[{
          t:"button",
          i:"addurl",
          c:"addurl bold btn btn_blue rd tb_btn dib",
          a:"Add URL"
        },{
          t:"span",
          i:"as",
          c:"bold",
          a:"Used "+s.as
        },{
          t:"span",
          c:"bold",
          a:" from "
        },{
          t:"span",
          i:"ts",
          c:"bold",
          a:s.ts+" slots"
        },{
          t:"button",
          i:"buyslot",
          c:"buyslot bold btn tb_btn btn_blue rd dib",
          a:"Buy Slots"
        }]
      },{
        t:"div",
        c:"buyproducts tb_box rd fl group",
        a:[{
          t:"div",
          c:"up fl",
          a:[{
            t:"span",
            i:"sms",
            c:"sms_s bold dib",
            a:s.sms
          },{
            t:"span",
            c:"sms_s bold dib",
            a:" SMS available"
          },{
            t:"button",
            i:"buysms",
            c:"buysms bold fr btn tb_btn btn_blue rd dib",
            a:"Buy SMS"
          },{
            t:"br"
          }]
        }]
      },{
        t:"div",
        c:"upgrades tb_box rd fr group",
        a:[{
          t:"span",
          c:"upgrade bold",
          a:"Current Package "
        },{
          t:"span",
          i:"cp",
          c:"bold ttu",
          a:" "+s.ap+" "+s.cp
        },{
          t:"button",
          i:"upgpackage",
          c:"upgpackage btn tb_btn btn_blue rd bold dib",
          a:"Upgrade Package"
        }]
      }];
    },
    addUrlWindowTemplate=function() {
      return [{
        t:"h1",
        c:"mh tac bold ttu",
        a:"Add new URL"
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
        c:"mirow",
        a:{
          t:"input",
          p:"text",
          i:"_nm",
          c:"mi rd bold",
          r:"Name"
        }
      },{
        t:"div",
        c:"merow",
        a:{
          t:"p",
          i:"me",
          c:"orange bold tac",
          a:""
        }
      },{
        t:"div",
        c:"mirow",
        a:{
          t:"input",
          p:"text",
          i:"_url",
          c:"mi rd bold",
          r:"URL"
        }
      },{
        t:"button",
        i:"_surl",
        c:"msb btn btn_blue rd bold disabled",
        d:true,
        a:"Save"
      }];
    },
    saveUrlAllow=function (e) {
      var te=Ev.t(e),
        t=te.t,
        id=t.id,
        val=t.value,
        n=SH.repitedName(val,t.placeholder),
        u=SH.repitedUrl(val,t.placeholder),
        nm=El.fbi("_nm"),
        url=El.fbi("_url"),
        b=El.fbi("_surl");
      Ev.s(te.e);
      (id==="_nm")?((val!==""&&!n)?V.c(t):V.i(t)):void 0;
      (id==="_url")?((V.turl(url.value)&&!u)?V.c(t):V.i(t)):void 0;
      (V.turl(url.value)&&!u&&!n&&nm.value!=="")?V.eb(b):V.db(b);
    },
    addUrlValidationHandler=function(e) {
      var te=Ev.t(e),
        t=te.t,
        id=t.id,
        v=t.value,
        n=SH.repitedName(v,t.placeholder),
        u=SH.repitedUrl(v,t.placeholder),
        me = El.fbi("me"),
        met,
        m,
        nm=El.fbi("_nm"),
        url=El.fbi("_url"),
        b=El.fbi("_surl"),
        c=v.length;
      id===nm.id?
        v==="" ?
          (El.html(me,"Slot name should not be empty."),
          V.a(nm),
          El.show(me),
          met?W.clearTimeout(met):void 0,
          met=W.setTimeout(function(){El.clear(me);El.hide(me);W.clearTimeout(met);},10000)):
        n ?
          (El.html(me,"Slot name "+n+" should be unique."),
          V.a(nm),
          El.show(me),
          met?W.clearTimeout(met):void 0,
          met=W.setTimeout(function(){El.clear(me);El.hide(me);W.clearTimeout(met);},10000)):
        c>=141 ?
          (El.html(me,"Slot name "+n+" should be unique."),
          V.a(nm),
          El.show(me),
          met?W.clearTimeout(met):void 0,
          met=W.setTimeout(function(){El.clear(me);El.hide(me);W.clearTimeout(met);},10000)):
        (v!==""&&!n&&c<=140) ?
          V.c(te.t):
          void 0:
        void 0;
      id===url.id ?
        v==="" ?
          (El.html(me,"URL should not be empty."),
          V.a(url),
          El.show(me),
          met?W.clearTimeout(met):void 0,
          met=W.setTimeout(function(){El.clear(me);El.hide(me);W.clearTimeout(met);},10000)):
        u ?
          (El.html(me,"Url "+u+" should be unique."),
          V.a(url),
          El.show(me),
          met?W.clearTimeout(met):void 0,
          met=W.setTimeout(function(){El.clear(me);El.hide(me);W.clearTimeout(met);},10000)):
        (v!==""&&!V.turl(v)) ?
          (El.html(me,"Enter correct URL starting with http:// or https://."),
          V.a(url),
          El.show(me),
          met?W.clearTimeout(met):void 0,
          met=W.setTimeout(function(){El.clear(me);El.hide(me);W.clearTimeout(met);},10000)):
        c>=2001 ?
          (El.html(me,"This URL is "+c+" characters. 2000 is the limit."),
          V.a(url),
          El.show(me),
          met?W.clearTimeout(met):void 0,
          met=W.setTimeout(function(){El.clear(me);El.hide(me);W.clearTimeout(met);},10000)):
        (v!==""&&V.turl(v)&&c<=2000&&!u) ?
          V.c(t):
          void 0:
        void 0;
    },
    addUrlvalidationEventHandler=function() {
      Ev.a(El.fbi("_nm"),"blur",addUrlValidationHandler);
      Ev.a(El.fbi("_nm"),"keyup",saveUrlAllow);
      Ev.a(El.fbi("_url"),"blur",addUrlValidationHandler);
      Ev.a(El.fbi("_url"),"keyup",saveUrlAllow);
    },
    removeValidationEventHandler=function() {
      Ev.r(El.fbi("_nm"),"blur",addUrlValidationHandler);
      Ev.r(El.fbi("_nm"),"keyup",saveUrlAllow);
      Ev.r(El.fbi("_url"),"blur",addUrlValidationHandler);
      Ev.r(El.fbi("_url"),"keyup",saveUrlAllow);
    };
  return {
    render:function (d) {
      R.r(El.fbi("tb"),false,toolbarTemplate(toolbarData(d)));
    },
    handler:function(e) {
      var te=Ev.t(e),
      id=te.t.id;
      Ev.s(te.e);
      (id==="addurl"&&!GO.mw)?
        (GO.mw=true,
        R.r(mw,false,addUrlWindowTemplate()),
        addUrlvalidationEventHandler(),
        Ev.a(El.fbi("_surl"),"click",saveUrlEmiter),
        MW.open(),
        El.fbi("_nm").focus()):
      (id==="buysms"&&!GO.mw)?
        (GO.mw=true,S.emit("get products",{})):
      (id==="buyslot"&&!GO.mw)?
        (GO.mw=true,S.emit("get services",{})):
      (id ==="upgpackage"&&!GO.mw)?
        (GO.mw=true,S.emit("get packages",{})):void 0;
    },
    bulkEmiter:function(e) {
      var te=Ev.t(e),
        t=te.t,
        x=GO._bch,
        bsl=El.fbi("bsl"),
        ids=[],
        o={};
      Ev.s(te.e);
      t.id==="bulkChk"?x.map(function(e){El.fbi(e).checked=(t.checked)?true:false;}):void 0;
      cls.f(t,"bulksubmit")?
        (x.map(function(e){ids[ids.length]=El.fbi(e).checked===true?idss(e,3):void 0;}),
        ids.length>0?
          bsl.value==="2"?S.emit("actions",{action:"activate",ids:ids}):
          bsl.value==="1"?S.emit("actions",{action:"deactivate",ids:ids}):
          bsl.value==="3"?S.emit("generate script",{ids:ids}):void 0:void 0):void 0;
    }
  };
})(render,elm,evnt,SIO,MW,SH,VAL,window);