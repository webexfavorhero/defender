var UH = (function (GO,S,El,Ev,SH,V,C,W,MW) {
  var notificationEmiter=function(t) {
      var id=idss(t.id,3),
        nt=t.options[t.selectedIndex].value;
      GO._tosst[id] !== nt?
      (GO.editNt(nt,id),S.emit("edit slot",{_id:id,_to:nt})):void 0;
    },
    editSlotToggle=function (t) {
      var id=idss(t.id,3),
        fd=El.fbi("fade"+id),
        uss=El.fbi("uss"+id),
        nm=El.fbi("_nm"+id),
        url=El.fbi("_url"+id),
        nme=El.fbi("nme"+id),
        urle=El.fbi("urle"+id);
      El.hide(t,nm,url,fd);
      V.db(t);
      V.eb(uss);
      El.show(nme,urle,uss);
      nme.focus();
    },
    saveSlotToggle=function (t) {
      var id=idss(t.id,3),
        fd=El.fbi("fade"+id),
        use=El.fbi("use"+id),
        nm=El.fbi("_nm"+id),
        url=El.fbi("_url"+id),
        nme=El.fbi("nme"+id),
        urle=El.fbi("urle"+id),
        nmev=nme.value,
        urlev=urle.value;
      (SH.repitedName(nmev,nme.placeholder)||SH.repitedUrl(urlev,urle.placeholder))?
        M.handler({w:["You are trying to save repeating name ",nmev," or Url ",urlev,". This is not allowed."].join("")},10):
      (El.show(nm,url),
       El.hide(t,nme,urle),
      V.db(t),V.eb(use),
      El.show(use,fd),
      editUrlEmiter(t,id));
    },
    editUrlEmiter=function(t,id) {
      var nme=El.fbi("nme"+id),
        urle=El.fbi("urle"+id),
        nmev=nme.value,
        urlev=urle.value,
        nmep=nme.placeholder,
        urlep=urle.placeholder,
        o={_id:id};
      nmev!==nmep&&nmev!==""&&!SH.repitedName(nmev,nmep)?
      (GO.rmNm(id),o._nm=nmev):void 0;
      urlev!==urlep&&urlev!==""&&V.turl(urlev)&&!SH.repitedUrl(urlev,urlep)?
      (GO.rmUrl(id),o._url=urlev):void 0;
      (o._nm||o._url)?S.emit("edit slot",o):void 0;
    },
    toggleHiddenArea=function(t) {
      var id=idss(t.id,5),
        usb=El.fbi("usb"+id),
        use=El.fbi("use"+id),
        uss=El.fbi("uss"+id);
      !C.f(usb,"slider")?
        (C.a(usb,"oh"),
        C.a(usb,"slider"),
        C.f(use,"dn")?
          (El.show(use,El.fbi("_nm"+id),El.fbi("_url"+id)),
          El.hide(uss,El.fbi("nme"+id),El.fbi("urle"+id)),
          V.db(uss),
          V.eb(use)):
        void 0):
      (C.r(usb,"slider"),
      W.setTimeout(C.r,500,usb,"oh"));
    },
    scriptEmiter=function(t) {
      GO.mw ?
        MW.close():
      void 0;
      GO.mw=true;
      V.db(t);
      W.setTimeout(V.eb,10000,t);
      S.emit("generate script",{ids:[idss(t.id,3)]});
    },
    urlSwitchEmiter=function(t) {
      var id=t.id,
        sw=idss(id,3,0),
        o={_id:idss(id,3)};
      o[sw]=+t.checked;
      S.emit("edit slot",o);
    },
    flagListEmiter=function (id) {
      GO.mw!==true?
        S.emit("get flags",is.a(id)?{ids:id}:{ids:[id]}):
      GO.mw=true;
    };
  return {
    urlClicktHandler:function(e) {
      var te=Ev.t(e),
        t=te.t,
        id=t.id;
      Ev.s(te.e);
      C.f(t,"slotSwChk")||(C.f(t,"fSwChk")&&GO.pg!=="starter")||C.f(t,"sSwChk")||C.f(t,"tSwChk")?
        urlSwitchEmiter(t):
      void 0;
      C.f(t,"scriptgen")?scriptEmiter(t):void 0;
      C.f(t,"slide")?toggleHiddenArea(t):void 0;
      C.f(t,"uss")?saveSlotToggle(t):void 0;
      C.f(t,"use")?editSlotToggle(t):void 0;
      C.f(te.t,"usr")?SH.confirmWindow({
        i:id,
        m:["Do you really want to remove URL '",GO._nms[idss(id,3)],"' from the dashboard?\nThis action could not be undone!"].join(""),
        a:"Remove URL"
      }):void 0;
      C.f(t,"mch")?SH.manualTest(t,id):void 0;
      C.f(t,"f_b")?flagListEmiter(idss(id,3)):void 0;
    },
    urlChangeHandler:function(e) {
      var t=Ev.t(e).t;
      C.f(t,"tnselect")?notificationEmiter(t):void 0;
    },
    multipleContactSelectHandler:function (e) {
      var t=Ev.t(e).t;
      C.f(t,"ntselect")?CO.emiter(t):void 0;
    },
    removeContactEmiter:function (id){
      S.emit("remove contact",{_id:id});
    },
    editValidationHandler:function(e) {
      var te=Ev.t(e),
        t=te.t,
        id=t.id,
        val=t.value,
        l=val.length,
        pl=t.placeholder,
        m;
      idss(id,3,0)==="nme"?
      (val===""?
       m="Slot name should not be empty":
       void 0,
      SH.repitedName(val,pl)&&val!==pl?
       m="Slot name "+val+" should be unique":
       void 0,
      l>=141?
       m="Slot name "+val+" is "+l+". Maximum length is 140 characters":
       void 0):
      idss(id,4,0)==="urle"?
      (val===""?
       m="Slot URL should not be empty":
       void 0,
      SH.repitedUrl(val,pl)&&val!==pl?
       m="URL "+val+" should be unique":
       void 0,
      l>=2001?
       m="Slot name "+val+" is "+l+". Maximum URL length is 2000 characters":
       void 0):
      void 0;
      V.msg(m,t);
    },
    removeUrlEmiter:function(id) {
      S.emit("remove slot",{_id:id});
      Ev.r(El.fbi("nme"+id),"blur",this.editValidationHandler);
      Ev.r(El.fbi("urle"+id),"blur",this.editValidationHandler);
      Ev.r(El.fbi("_co"+id),"blur",this.multipleContactSelectHandler);
      Ev.r(El.fbi("slot"+id),"click",this.urlClicktHandler);
      Ev.r(El.fbi("slot"+id),"change",this.urlChangeHandler);
    }
  };
})(GO,SIO,elm,evnt,SH,VAL,cls,window,MW);