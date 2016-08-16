var SU = (function(GO, SR, M, El, C, DT, SH) {
  var updateActiveSlots = function() {
      El.html(El.fbi("as"), GO.cMsw());
    },
    switchUpdate = function(id, xsw, state) {
      El.fbi(xsw + id).checked = !!state;
      SH.disableSwitch(id, xsw, true);
    },
    nameUpdateHandler = function(id, name) {
      var nme = El.fbi("nme" + id);
      El.html(El.fbi("_nm" + id), name);
      nme.value = name;
      nme.placeholder = name;
      M.handler({
        i: "Slot name has been changed. New name is " + name
      });
    },
    urlUpdate = function(id, url) {
      var nm = El.fbi("_nm" + id).value,
        urle = El.fbi("urle" + id);
      El.html(El.fbi("_url" + id), url);
      El.fbi("_url" + id).href = url;
      urle.value = url;
      urle.placeholder = url;
      M.handler({
        w: "Slot " + nm + " URL has been changed. Do not forget to regenerate and embed new Traffic script for your page!",
        a: nm,
        l: url
      });
    },
    addedDateUpdateHandler = function(id, date) {
      El.html(El.fbi("_ad" + id), DT.format(date));
    },
    flagStatusUpdateHandler = function(id, status) {
      var span = El.fbi("fst" + id),
        ocls = SH.statusClassToggle(!status),
        ncls = SH.statusClassToggle(status);
      El.html(span, SH.flagStatusRenderer(status));
      C.f(span, ocls) ? (C.r(span, ocls), C.a(span, ncls)) : void 0;
    },
    flagBlockListUpdater=function(id, status,total){
      var span = El.fbi("fcb"+id),
        fcb=SH.flagBlockLists(status,total);
        status?El.show(span):El.hide(span);
        fcb!==El.content(span)?El.html(span,fcb):void 0;
    },
    serverStatusUpdateHandler = function(id, status) {
      var span = El.fbi("sst" + id),
        ocls = SH.serverStatusToggle(!status),
        ncls = SH.serverStatusToggle(status);
      El.html(El.fbi("sst" + id), SH.serverStatusToggle(status));
      El.html(El.fbi("sst" + id), status);
      El.html(span, status);
      C.f(span, ocls) ? (C.r(span, ocls), C.a(span, ncls)) : void 0;
    },
    trafficStatusUpdateHandler = function(id, tc) {
      El.html(El.fbi("tst" + id), (tc === 0) ? "Disabled" : stringify(tc));
    },
    lastVisitorUpdateHandler = function(id, date) {
      SH.lastVisitorRenderer(date, id);
    },
    urlContactsUpdateHandler = function(id, co) {
      Array.prototype.slice.call(El.fbi("_co" + id).options, 0).map(function(e) {
        e.selected = co.indexOf(e.value) != -1 ? true : false;
      });
    },
    notificationUpdateHandler = function(id, to) {
      El.fbi("_to" + id).value = to;
    },
    lastNotificationUpdateHandler = function(id, nti, ntd) {
      var nc = SH.notificationClassToggle(nti),
        iid = El.fbi("nti" + id),
        cc = C.f(iid, "nt_f") || C.f(iid, "nt_s") || C.f(iid, "nt_t");
      nc !== cc ? (C.r(iid, cc), C.a(iid, nc)) : void 0;
      El.html(El.fbi("ntd" + id), DT.format(ntd));
    };
  return {
    handler: function(d) {
      d.forEach(function(e) {
        var id = e._id;
        !GO.findId(id) ?
          (SR.handler(e,true),
           M.handler({
          i: "Url with name " + e._nm + " has been created.",
          a: e._url
          })):
          GO.findId(id) ?
            (hop(e, "msw") ?
              (switchUpdate(id, "msw", parseInt(e.msw, 10)),
               GO.edMsw(id, e.msw),
               updateActiveSlots()) :
            void 0,
            hop(e, "fsw") ?
              switchUpdate(id, "fsw", parseInt(e.fsw, 10)) :
            void 0,
            hop(e, "ssw") ?
              switchUpdate(id, "ssw", parseInt(e.ssw, 10)) :
            void 0,
            hop(e, "tsw") ?
              switchUpdate(id, "tsw", parseInt(e.tsw, 10)) :
            void 0,
            hop(e, "_nm") ?
              nameUpdateHandler(id, e._nm) :
            void 0,
            hop(e, "_url") ?
              urlUpdate(id, e._url) :
            void 0,
            hop(e, "_ad") ?
              addedDateUpdateHandler(id, e._ad) :
            void 0,
            hop(e, "fms") ?
              (flagStatusUpdateHandler(id, e.fms),
               flagBlockListUpdater(id,e.fms,e.ftb)) :
            void 0,
            hop(e, "sms") ?
              serverStatusUpdateHandler(id, e.sms) :
            void 0,
            hop(e, "tc") ?
              trafficStatusUpdateHandler(id, e.tc) :
            void 0,
            hop(e, "_lv") ?
              lastVisitorUpdateHandler(id, e._lv) :
            void 0,
            hop(e, "_co") ?
              urlContactsUpdateHandler(id, e._co) :
            void 0,
            hop(e, "_to") ?
              notificationUpdateHandler(id, e._to) :
            void 0,
            (hop(e, "nti") && hop(e, "ntd")) ?
              lastNotificationUpdateHandler(id, e.nti, e.ntd) :
            void 0)
          :void 0;
      });
    },
    removeUrl: function(d) {
      d.map(function(e) {
        M.handler({
          w: "Url " + e._nm + " has been removed!",
          a: e._url
        });
        El.remove(El.fbi("slot" + e._id));
        GO.removeUrl(e._id);
      });
      El.hide(El.fbi("mwr"));
    }
  };
})(GO, SR, msg, elm, cls, DT, SH);