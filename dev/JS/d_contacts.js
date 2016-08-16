var CO = (function (GO,El,R,M,C,Ev,MW,V,S,SH) {
  "use strict";
  var nfv=["Once per problem","Every 5 minutes","Every 15 minutes","Every 30 minutes","Once per hour"],
    updateContactsSelectInSlots=function() {
      var co;
      GO._ids.forEach(function(e){
        co=El.fbi("_co"+e);
        El.clear(co);
        R.r(co,false,SH.contactsOptionsRenderer(GO._cos,GO._cosid[e]));
      });
    },
    editContactHandler=function(d){
      hop(d,"nm")?
        (El.fbi("co_nm"+d._id)?
          (El.fbi("co_nm"+d._id).value=d.nm,
           El.fbi("co_nm"+d._id).placeholder=d.nm):
        void 0,
        M.handler({d:"Contact name "+d.nm+" has been changed"},10)):
      void 0;
      hop(d,"em")?
        (El.fbi("co_em"+d._id)?
          (El.fbi("co_em"+d._id).value=d.em,
          El.fbi("co_em"+d._id).placeholder=d.em):
        void 0,
        M.handler({d:"Contact email "+d.em+" has been changed"},10)):
      void 0;
      hop(d,"ph")?
        (El.fbi("co_ph"+d._id)?
          (El.fbi("co_ph"+d._id).value=d.ph,
          El.fbi("co_ph"+d._id).placeholder=d.ph):
        void 0,
        M.handler({d:"Contact phone number "+d.ph+" has been changed"},10)):
      void 0;
      hop(d,"nf")?
        (El.fbi("co_nf"+d._id)?
          El.fbi("co_nf"+d._id).value=d.nf:
        void 0,
        M.handler({d:"Contact notification frequency has been changed"},10)):
      void 0;
      GO._cos.forEach(function(e){
        e._id===d._id?
          (hop(d,"nm")?
            (GO._cosnm.push(d.nm),e.nm=d.nm):
          void 0,
          hop(d,"em")?
            e.em=d.em:
          void 0,
          hop(d,"ph")?
            e.ph=d.ph:
          void 0,
          hop(d,"nf")?
            e.nf=d.nf:
          void 0,
          updateContactsSelectInSlots()):
        void 0;});
    },
    contactUpdateHandler=function(d){
      var o={};
      o[d._id]=d.nm;
      GO.addNewCo(d);
      El.fbi("cl")?
        (R.r(El.fbi("cl"),false,contactsData(d,nfv)),
        El.hide(El.fbi("co_"+d._id)),
        R.r(El.fbi("cnms"),false,contactNamesTemplate(o)),
        toggleArrows(),
        addContactEventModalWindowHandler(d._id)):
      void 0;
      M.handler({i:"Contact "+d.nm+" with email "+d.em+" has been created!"});
      updateContactsSelectInSlots();
    },
    contactsHandler=function(e){
      var te=Ev.t(e);
      Ev.s(te.e);
      !GO.mw?
        (GO.mw=true,
        R.r(mw,false,contactsTemplate(contactsDataHandler(GO._cos,nfv),contactNamesTemplate(GO._cosnm),nfv)),
        C.a(El.fbc("cnm")[0],"active"),
        Ev.a(El.fbi("co_nm"),"blur",contactValidationHandler),
        Ev.a(El.fbi("co_nm"),"input",contactAllowHandler),
        Ev.a(El.fbi("co_em"),"blur",contactValidationHandler),
        Ev.a(El.fbi("co_em"),"input",contactAllowHandler),
        Ev.a(El.fbi("co_ph"),"blur",contactValidationHandler),
        Ev.a(El.fbi("co_ph"),"input",contactAllowHandler),
        Ev.a(El.fbi("co_sv"),"click",contactEmiter),
        Ev.a(El.fbi("anc"),"click",newContactForm),
        GO._coids.forEach(function(e){addContactEventModalWindowHandler(e);}),
        Ev.a(El.fbi("cmw"),"click",clearContactEvents),
        MW.open()):
      void 0;
    },
    newContactForm=function (e) {
      var te=Ev.t(e);
      Ev.s(te.e);
      El.hide(El.fbi("cl"));
      El.show(El.fbi("nc"));
    },
    contactsDataHandler=function(cos,nfv){
      return cos.map(function(e){
        return contactsData(e,nfv);
      });
    },
    contactNamesTemplate=function (cosnms) {
      return Object.keys(cosnms).map(function(e){
        return {
          t:"button",
          c:"cnm bold rd",
          i:"cnm"+e,
          a:cosnms[e]
        };
      });
    },
    contactsData=function(cos,nfv){
      !GO.findCoId(cos._id)?GO._coids.push(cos._id):void 0;
      return{
        t:"div",
        i:"co_"+cos._id,
        c:"contact fl"+(!!!cos.ed?"":" dn"),
        a:[{
          t:"input",
          p:"hidden",
          i:"co_id"+cos._id,
          v:cos._id
        },{
          t:"div",
          c:"co_row pr",
          a:[{
            t:"label",
            f:"co_nm"+cos._id,
            c:"co_l bold db",
            a:"Name",
            d:!!!cos.ed
          },{
            t:"input",
            p:"text",
            i:"co_nm"+cos._id,
            c:"co_nm rd bold",
            r:cos.nm,
            v:cos.nm,
            o:!!!cos.ed,
            d:!!!cos.ed
          }]
        },{
          t:"div",
          c:"co_row pr",
          a:[{
            t:"label",
            f:"co_em"+ cos._id,
            c:"co_l bold db",
            a:"Email",
            d:!!!cos.ed
          },{
            t:"input",
            p:"email",
            i:"co_em"+cos._id,
            c:"co_em rd bold",
            r:cos.em,
            v:cos.em,
            o:!!!cos.ed,
            d:!!!cos.ed
          }]
        },{
          t:"div",
          c:"co_row pr",
          a:[{
            t:"label",
            f:"co_ph"+cos._id,
            c:"co_l bold db",
            a:"Phone"
          },{
            t:"input",
            p:"phone",
            i:"co_ph"+cos._id,
            c:"co_ph rd bold",
            r:cos.ph,
            v:cos.ph,
            o:!!!cos.ed,
            d:!!!cos.ed
          }]
        },{
          t:"div",
          c:"co_row pr",
          a:[{
            t:"label",
            f:"co_nf"+cos._id,
            c:"co_l bold db",
            a:"Notification frequency"
          },{
            t:"select",
            i:"co_nf"+cos._id,
            c:"co_nf bold",
            a:notificationFrequency(cos.nf,nfv)
          },{
            t:"div",
            c:"selectlabel flabel pa",
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
          c:"co_row group pr",
          a:[{
            t:"button",
            i:"co_sv"+cos._id,
            c:"co_ed fl bold btn btn_blue rd pa",
            a:"Save"
          },{
            t:"button",
            i:"co_rm"+cos._id,
            c:"co_rm fr bold" +(!!!cos.ed?" dn":""),
            d:!!!cos.ed,
            a:{
              t:"svg",
              vb:"0 0 16 21",
              par:"xMinYMin slice",
              a:{
                t:"use",
                xlink:"#bin"
              }
            }
          }]
        },{
          t:"div",
          c:"co_row group pr",
          a:[{
            t:"div",
            c:"co_col fr group",
            a:[{
              t:"button",
              c:"test_i fl",
              i:"co_te"+cos._id,
              a:{
                t:"svg",
                vb:"0 0 22 19",
                par:"xMinYMin slice",
                a:{
                  t:"use",
                  xlink:"#testem"
                }
              }
            },{
              t:"label",
              f:"co_te"+cos._id,
              c:"test tac fl bold db",
              a:"Test"
            }]
          },{
            t:"div",
            c:"co_col fr group",
            a:[{
              t:"button",
              c:"test_i fl",
              i:"co_tp"+cos._id,
              a:{
                t:"svg",
                vb:"0 0 22 19",
                par:"xMinYMin slice",
                a:{
                  t:"use",
                  xlink:"#testph"
                }
              }
            },{
              t:"label",
              f:"co_tp"+cos._id,
              c:"test tac fl bold tb",
              a:"Test"
            }]
          }]
        }]
      };
    },
    contactsTemplate=function(d,b,nfv){
      return [{
        t:"h1",
        c:"mh tac bold ttu",
        a:"Contacts"
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
        c:"co_top group",
        a:[{
          t:"button",
          i:"anc",
          c:"anc bold btn btn_blue rd fl",
          a:"Add new contact"
        },{
          t:"div",
          c:"come_row fl",
          a:{
            t:"p",
            c:"orange tac bold",
            i:"come",
            a:""
          }
        }]
      },{
        t:"button",
        c:"c_arrow pa dn",
        i:"co_ta",
        a:{
          t:"svg",
          vb:"0 0 17 14",
          par:"xMinYMin slice",
          a:{
            t:"use",
            xlink:"#c_arrow",
            trf:"rotate(180 8.5 7)",
          }
        }
      },{
        t:"div",
        i:"cnms",
        c:"contactnames fl",
        a:b
      },{
        t:"button",
        c:"c_arrow pa b_arr dn",
        i:"co_ba",
        a:{
          t:"svg",
          vb:"0 0 17 14",
          par:"xMinYMin slice",
          a:{
            t:"use",
            xlink:"#c_arrow"
          }
        }
      },{
        t:"div",
        i:"cl",
        c:"contactslist fr",
        a:d
      },{
        t:"div",
        i:"nc",
        c:"newcontact fr dn",
        a:[{
          t:"div",
          c:"co_row group pr",
          a:[{
            t:"label",
            f:"co_nm",
            c:"co_l bold db",
            a:"Name"
            },{
            t:"input",
            p:"text",
            i:"co_nm",
            c:"co_nm rd bold",
            r:"Name"
          }]
        },{
          t:"div",
          c:"co_row group pr",
          a:[{
            t:"label",
            f:"co_em",
            c:"co_l bold db",
            a:"Email"
          },{
          t:"input",
          p:"email",
          i:"co_em",
          c:"co_em rd bold",
          r:"enter@contact.email"
         }]
       },{
          t:"div",
          c:"co_row group pr",
          a:[{
            t:"label",
            f:"co_ph",
            c:"co_l bold db",
            a:"Phone"
          },{
            t:"input",
            p:"phone",
            i:"co_ph",
            c:"co_ph rd bold",
            r:"+XXXXXXXXXXX"
          }]
        },{
          t:"div",
          c:"co_row group pr",
          a:[{
            t:"label",
            c:"co_l bold db",
            a:"Notification frequency:"
          },{
            t:"select",
            i:"co_nf",
            c:"co_nf rd bold",
            a:[{
              t:"option",
              v:"0",
              a:nfv[0]
            },{
              t:"option",
              v:"1",
              a:nfv[1]
            },{
              t:"option",
              v:"2",
              a:nfv[2]
            },{
              t:"option",
              v:"3",
              a:nfv[3]
            },{
              t:"option",
              v:"4",
              a:nfv[4]
            }]
          },{
            t:"div",
            c:"selectlabel flabel pa zi1",
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
          c:"co_row group pr",
          a:{
            t:"button",
            i:"co_sv",
            c:"co_sv btn btn_blue bold rd pa",
            a:"Save"
          }
        }]
      }];
    },
    notificationFrequency=function(fr,nfv){
      var arr=[],i=0;
      for(i;i<5;i++){
        arr.push({t:"option",v:stringify(i),a:nfv[i],s:fr==i?true:false});
      }
      return arr;
    },
    contactEmiter=function(e){
      var te=Ev.t(e),
        tid=te.t.id,
        me=El.fbi("come"),
        id,nm,em,ph,nf,o;
      (tid==="co_sv"||idss(tid,5,0)==="co_sv"||idss(tid,5,0)==="co_rm"||idss(tid,5,0)==="co_te"||idss(tid,5,0)==="co_tp")?
        (id=idss(tid,5),
         nm=El.fbi("co_nm"+id).value,
         em=El.fbi("co_em"+id).value,
         ph=El.fbi("co_ph"+id).value,
         nf=El.fbi("co_nf"+id).value):
      void 0;
      Ev.s(te.e);
      tid==="co_sv"?
        (nm!==""&&nm.length<41&&nm!==GO.findCoNm(nm)&&V.tem(em)&&em.length<255&&ph.length<21)?
          (S.emit("add contact",{nm:nm,em:em,ph:ph,nf:nf}),
           El.hide(El.fbi("nc")),
           El.show(El.fbi("cl"))):
        void 0:
      void 0;
      (tid==="co_sv"+id&&id!=="")?
        (o={
          _id:id,
          nm:(nm!==El.fbi("co_nm"+id).placeholder&&nm!==""&&nm.length<41)?
              (GO.rmCoNm(El.fbi("co_nm"+id).placeholder),nm):
              void 0,
          em:(em!==El.fbi("co_em"+id).placeholder&&V.tem(em)&&em.length<255)?
              em:
              void 0,
          ph:(ph!==El.fbi("co_ph"+id).placeholder&&ph.length<21&&(ph===""||V.tph(ph)))?
              ph:
              void 0,
          nf:(nf != GO._cosnf[id])?
              (GO._cosnf[id]=nf,nf):
              void 0
        },
        Object.keys(o).length > 1?
          S.emit("edit contact",o):
        void 0):
      void 0;
      tid==="co_rm"+id?
        SH.confirmWindow({
            i:tid,
            m:"Do you really want to remove contact '"+nm+"' from contacts?\nThs action could not be undone!",
            a:"Remove contact"}):
      void 0;
      tid==="co_te"+id?
        (S.emit("test contact",{_id:id,te:true}),
         V.e(me,false,"Test Email has been sent to "+em+".")):
      void 0;
      tid==="co_tp"+id?
        (S.emit("test contact",{_id:id,tp:true}),
         V.e(me,false,"Test SMS has been sent "+ph+".")):
      void 0;
    },
    getMultipleSelectValues=function(t) {
      return Array.prototype.slice.call(t && t.options,0).map(function(e){if(e.selected){return e.value;}});
    },
    contactPlaceholderToValueEventHandler=function(e){
      var te=Ev.t(e),
        t=te.t,
        tid=t.id,
        id=idss(tid,5);
      Ev.s(te.e);
      (tid==="co_nm"+id||tid==="co_em"+id||tid==="co_ph"+id)?t.value=t.placeholder:void 0;
    },
    contactSelectHandler=function(e) {
      var te=Ev.t(e),
        t=te.t;
        GO._coids.map(function(e) {
          C.r(El.fbi("cnm"+e),"active");
          El.hide(El.fbi("co_"+e));
        });
        El.hide(El.fbi("nc"));
        El.show(El.fbi("cl"));
        C.a(t,"active");
        El.show(El.fbi("co_"+idss(t.id,3)));
    },
    addContactEventModalWindowHandler=function(id){
      Ev.a(El.fbi("co_nm"+id),"blur",contactValidationHandler);
      Ev.a(El.fbi("co_nm"+id),"input",contactAllowHandler);
      Ev.a(El.fbi("co_em"+id),"blur",contactValidationHandler);
      Ev.a(El.fbi("co_em"+id),"input",contactAllowHandler);
      Ev.a(El.fbi("co_ph"+id),"blur",contactValidationHandler);
      Ev.a(El.fbi("co_ph"+id),"input",contactAllowHandler);
      Ev.a(El.fbi("co_nm"+id),"focus",contactPlaceholderToValueEventHandler);
      Ev.a(El.fbi("co_em"+id),"focus",contactPlaceholderToValueEventHandler);
      Ev.a(El.fbi("co_ph"+id),"focus",contactPlaceholderToValueEventHandler);
      Ev.a(El.fbi("cnm"+id),"click",contactSelectHandler);
      Ev.a(El.fbi("co_"+id),"click",contactEmiter);
    },
    clearContactEvents=function(){
      Ev.r(El.fbi("co_nm"),"blur",contactValidationHandler);
      Ev.r(El.fbi("co_nm"),"input",contactAllowHandler);
      Ev.r(El.fbi("co_em"),"blur",contactValidationHandler);
      Ev.r(El.fbi("co_em"),"input",contactAllowHandler);
      Ev.r(El.fbi("co_ph"),"blur",contactValidationHandler);
      Ev.r(El.fbi("co_ph"),"input",contactAllowHandler);
      Ev.r(El.fbi("co_sv"),"click",contactEmiter);
      Ev.r(El.fbi("anc"),"click",newContactForm),
      GO._coids.forEach(function(e){
        removeContactEventModalWindowHandler(e);
      });
      Ev.r(El.fbi("cmw"),"click",clearContactEvents);
    },
    removeContactEventModalWindowHandler=function(id){
      Ev.r(El.fbi("co_nm"+id),"blur",contactValidationHandler);
      Ev.r(El.fbi("co_nm"+id),"input",contactAllowHandler);
      Ev.r(El.fbi("co_em"+id),"blur",contactValidationHandler);
      Ev.r(El.fbi("co_em"+id),"input",contactAllowHandler);
      Ev.r(El.fbi("co_ph"+id),"blur",contactValidationHandler);
      Ev.r(El.fbi("co_ph"+id),"input",contactAllowHandler);
      Ev.r(El.fbi("co_nm"+id),"focus",contactPlaceholderToValueEventHandler);
      Ev.r(El.fbi("co_em"+id),"focus",contactPlaceholderToValueEventHandler);
      Ev.r(El.fbi("co_ph"+id),"focus",contactPlaceholderToValueEventHandler);
      Ev.r(El.fbi("cnm"+id),"click",contactSelectHandler);
      Ev.r(El.fbi("co_"+id),"click",contactEmiter);
    },
    removeContactHandler=function(id){
      El.fbi("cl")?
        (removeContactEventModalWindowHandler(id),El.remove(El.fbi("co_"+id))):
      void 0;
      GO.rmCo(id);
      updateContactsSelectInSlots();
    },
    contactValidationHandler=function(e) {
      var te=Ev.t(e),
        t=te.t,
        val=t.value,
        l=val.length,
        id=idss(t.id,5),
        s=El.fbi("co_sv"+id),
        nm=El.fbi("co_nm"+id),
        em=El.fbi("co_em"+id),
        ph=El.fbi("co_ph"+id),
        me=El.fbi("come");
      Ev.s(te.e);
      t.id===nm.id?
        (val==="") ?
          V.e(me,t,"Contact name should not be empty"):
        (repitedContactName(val,nm.placeholder)) ?
          V.e(me,t,"Contact name "+val+" already exists"):
        (l>40) ?
          V.e(me,t,"Contact name should not be longer than 40 characters"):
        (val!==""&&!repitedContactName(val,nm.placeholder)&&l<=40) ?
          V.c(t):
        V.i(t):
      void 0;
      t.id===em.id?
        val==="" ?
          V.e(me,t,"Email address should not be Empty"):
        !V.tem(val) ?
          V.e(me,t,"Enter correct contact email address"):
        l>254 ?
          V.e(me,t,"Contact email should not be longer than 254 characters"):
        void 0:
      void 0;
      t.id===em.id?
        (val!==""&&V.tem(val)&&l<= 254) ?
          V.c(t):
        V.i(t):
      void 0;
      t.id===ph.id?
        (t.value=val.replace(/[^0-9\+]/g,""),
        l>20 ?
          V.e(me,t,"Contact phone number should not be longer than 20 digits"):
        (val!==""&&!V.tph(val)) ?
          V.e(me,t,"Contact phone number should start with '+' sign."):
        void 0):
      void 0;
      t.id===ph.id?
        (val===""||(val!==""&&V.tph(val)&&l<21))?
          V.c(t):
        V.i(t):
      void 0;
    },
    contactAllowHandler=function (e) {
      var te=Ev.t(e),
        t=te.t,
        val=t.value,
        l=val.length,
        id=idss(t.id,5),
        s=El.fbi("co_sv"+id),
        nm=El.fbi("co_nm"+id),
        em=El.fbi("co_em"+id),
        ph=El.fbi("co_ph"+id);
      t.id===nm.id?
        (repitedContactName(val,nm.placeholder)||val==="")?
          V.i(t):V.c(t):
      t.id===em.id?
        (!V.tem(val)||val==="")?
          V.i(t):V.c(t):
      t.id===ph.id?
        (val!==""&&!V.tph(val))?
          V.i(t):V.c(t):
        void 0;
      !repitedContactName(nm.value,nm.placeholder)&&nm.value!==""&&
       V.tem(em.value)&&em.value!==""&&
       (ph.value===""||V.tph(ph.value)||ph.value===ph.placeholder)?
        V.eb(s):V.db(s);
    },
    repitedContactName=function(nn,cn) {
      var conms=GO._cosnm,
        k;
      if(nn!==cn) {
        for(k in conms) {
          if(conms[k]===nn) {
            return nn;
          }
        }
      }
    },
    toggleArrows=function () {
      var el = El.fbi("cnms"),
        ta=El.fbi("co_ta"),
        ba=El.fbi("co_ba"),
        nh=el.childElementCount*29,
        st=el.scrollTop;
      nh>250?
        (st<(nh-250)?
          El.show(ba):
        El.hide(ba),
        st===0?
          El.hide(ta):
        El.show(ta)):
      El.hide(ta,ba);
    },
    scrollUp=function () {
      var el = El.fbi("cnms"),
        st=el.scrollTop,
        cc=el.childElementCount;
        el.scrollTop=(cc>9&&st>(8*29))?
          (st-(7*29)):
        0;
    },
    scrollDown=function () {
      var el = El.fbi("cnms"),
        st=el.scrollTop,
        cc=el.childElementCount,
        nh=cc*29;
      el.scrollTop=(cc>9&&(st<(nh-250)))?
        (st+(7*29)):
      nh-250;
    };
  return {
    handler:function(e){
      var te=Ev.t(e);
      Ev.s(te.e);
      GO.mw ?
        MW.close():
      void 0;
      GO.mw=true;
      V.db(El.fbi("co"));
      R.r(mw,false,contactsTemplate(contactsDataHandler(GO._cos,nfv),contactNamesTemplate(GO._cosnm),nfv));
      toggleArrows();
      C.a(El.fbc("cnm")[0],"active");
      Ev.a(El.fbi("cnms"),"scroll",toggleArrows);
      Ev.a(El.fbi("co_ta"),"click",scrollUp);
      Ev.a(El.fbi("co_ba"),"click",scrollDown);
      Ev.a(El.fbi("co_nm"),"blur",contactValidationHandler);
      Ev.a(El.fbi("co_nm"),"input",contactAllowHandler);
      Ev.a(El.fbi("co_em"),"blur",contactValidationHandler);
      Ev.a(El.fbi("co_em"),"input",contactAllowHandler);
      Ev.a(El.fbi("co_ph"),"blur",contactValidationHandler);
      Ev.a(El.fbi("co_ph"),"input",contactAllowHandler);
      Ev.a(El.fbi("co_sv"),"click",contactEmiter);
      Ev.a(El.fbi("anc"),"click",newContactForm);
      GO._coids.map(function(e){addContactEventModalWindowHandler(e);});
      Ev.a(El.fbi("cmw"),"click",clearContactEvents);
      MW.open();
    },
    emiter:function(t){
      var id=idss(t.id,3),
        val=getMultipleSelectValues(t);
      GO._cosid[id]!==val?
        (GO.editCo(val,id),
         S.emit("edit slot",{_id:id,_co:val})):
      void 0;
    },
    remove:function(id){
      El.fbi("cl")?
        (removeContactEventModalWindowHandler(id),
        El.remove(El.fbi("co_"+id)),
        El.remove(El.fbi("cnm"+id))):
      void 0;
      GO.rmCo(id);
      updateContactsSelectInSlots();
    },
    update:function (co){
      co.forEach(function(e){
        hop(e,"_id")?
          GO.findCoId(e._id)?
            editContactHandler(e):
            contactUpdateHandler(e):
        void 0;
      });
    },
  };
})(GO,elm,render,msg,cls,evnt,MW,VAL,SIO,SH);