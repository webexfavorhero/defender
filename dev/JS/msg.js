var msg=(function(C,Ev,L,El,R,DT,I) {
  "use strict";
  var mmb=El.fbi("mmb"),
    mms=El.fbi("mms"),
    camm=El.fbi("camm"),
    i=0,
    f=0,
    j=0,
    ids=[],
    l=function() {
     ids.map(function(e) {
        remove(e);
      });
      Ev.r(camm,"click",l);
      El.hide(camm);
    },
    g=function() {
      i > 1 ? C.f(mms,"oh") ? (C.r(mms,"oh"),Ev.a(camm,"click",l),El.show(camm)) :C.a(mms,"oh") :void 0;
      e();
    },
    a=function() {
      El.html(mmb,i);
      i > 1 ? Ev.a(mmb,"click",g) :Ev.r(mmb,"click",g);
    },
    e=function() {
      [].map.call(f,function(e) {
        j += e.clientHeight;
      });
      C.f(mms,"oh")?
        (mms.style.height=(mms.firstChild?
          mms.firstChild.clientHeight + 6 + "px":
          0),
        C.r(mms,"scroll")):
        (mms.removeAttribute('style'),C.a(mms,"scroll"));
    },
    close=function(e) {
      var te=Ev.t(e),
        t=te.t;
      Ev.s(te.e);
      Ev.r(t,"click",close);
      remove(idss(t.id,3));
      i<2?(Ev.r(camm,"click",l),El.hide(camm)):(Ev.a(camm,"click",l),El.show(camm));
    },
    template=function(o,flag) {
      var a=[o.m];
      (hop(o,"a")&&o.a) ?
        (o.l=!hop(o,"l")?o.a:o.l,
        a.push({
          t:"a",
          c:"mma",
          l:o.a,
          a:o.l,
          g:"_blank"
        })):
      void 0;
      I.u(flag) ?
        (a.push({
          t:"p",
          c:"mtime tar",
          a:DT.format(o.id)
        })) :
      void 0;
      return {
        t:"div",
        i:"" + o.id,
        c:"mmw zi2 rd " + o.c,
        a:[{
          t:"button",
          i: "cmm" + o.id,
          c: "cmm zi2 m_cross",
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
          t:"svg",
          c:"m_icon",
          vb:"0 0 29 29",
          par:"xMinYMin slice",
          a:{
            t:"use",
            xlink:"#" + o.c
          }
        },{
          t:"p",
          c:"mm tal rd bold",
          a:a
        }]
      };
    },
    show=function(o,flag,b) {
      (L && L.getItem("msg")) ?
        ids=L.getItem("msg").split(","):
      void 0;
      o.id=!b?+new Date():o.i;
      El.show(mms,mmb);
      (!flag && ids.indexOf(o.id) === -1) ?
        ids.push(o.id):
      void 0;
      R.r(mms,true,!b?template(o,flag):o);
      e();
      Ev.a(El.fbi("cmm" + o.id),"click",close);
      (!b && !flag && L) ?
        L.setItem(o.id,Js(template(o,flag))):
      void 0;
      L ?
        L.setItem("msg",ids) :
      void 0;
      i=mms.childElementCount;
      a();
      f=El.fbc("mmw");
      flag ?
        setTimeout(remove,flag * 1000,o.id) :void 0;
    },
    remove=function(id) {
      El.remove(El.fbi(id));
      i=mms.childElementCount;
      f=El.fbc("mmw");
      (L && L.getItem(id)) ? L.removeItem(id):void 0;
      ids=ids.filter(function(e) {
        return e != id;
      });
      (L && L.getItem("msg")) ? L.setItem("msg",ids):void 0;
      a();
      i === 0 ? El.hide(mms,mmb,camm) :void 0;
      e();
    };
  return {
    fill:function(id){
      ids.push(id);
    },
    handler:function(d,f,k) {
      show(
           k?
            k:
            {
              c:hop(d,"e")?
                "m_err":
                hop(d,"w")?
                  "m_wrn":
                  hop(d,"i")?
                    "m_inf":
                    hop(d,"d")?
                      "m_log":
                    void 0,
              m:hop(d,"e")?
                  d.e:
                  hop(d,"w") ?
                    d.w:
                    hop(d,"i")?
                      d.i:
                      hop(d,"d")?
                        d.d:
                      void 0,
              a:hop(d,"a")?
                  d.a:
                  false,
              l:hop(d,"l")?
                  d.l:
                  false
            },f,k?true:false);
    }
  };
})(cls,evnt,localStorage,elm,render,DT,is);