render = (function(is,D) {
  var append = function(p,c){
      p.appendChild(c);
    },
    fragment=function(d){
      var fragment=D.createDocumentFragment();
      is.a(d)?
        d.forEach(function(e){append(fragment,node(e));}):
        (is.o(d)&&!is.a(d))?
          append(fragment,node(d)):
          is.s(d)?
            append(fragment,D.createTextNode(d)):
            void 0;
      return fragment;
    },
    insert=function(target,flag,fragment){
      flag===true?
        target.insertBefore(fragment,target.firstChild):
        target.appendChild(fragment);
    },
    node=function(d){
      var el,svgns,xlinkns;
      (is.a(d))?
        d.forEach(function(e,i){
          return node(e[i]);
        }):
      void 0;
      return (is.s(d))?
        D.createTextNode(d):
        (is.o(d)&&!is.a(d))?
          ((d.t==="svg"||d.t==="use")?
            svgns="http://www.w3.org/2000/svg":
          void 0,
          el=(d.t==="svg")?
            D.createElementNS(svgns,d.t):
            (d.t==="use")?
              (xlinkns="http://www.w3.org/1999/xlink",
              D.createElementNS(svgns,d.t)):
            D.createElement(d.t),
          (d.i&&is.s(d.i))?
            el.id=d.i:
          void 0,
          (hop(d,"c")&&is.s(d.c))?
            (d.t==="svg"||d.t==="use")?
              el.setAttribute("class",d.c):
            el.className=d.c:
          void 0,
          (hop(d,"n")&&is.s(d.n))?
            el.name=d.n:
          void 0,
          (hop(d,"f")&&is.s(d.f))?
            el.htmlFor=d.f:
          void 0,
          (hop(d,"p")&&is.s(d.p))?
            el.type=d.p:
          void 0,
          (hop(d,"v")&&is.s(d.v))?
            el.value=d.v:
          void 0,
          (hop(d,"h")&&!!d.h)?
            el.checked=true:
          void 0,
          (hop(d,"d")&&is.b(d.d))?
            el.disabled=d.d:
          void 0,
          (hop(d,"r")&&!!d.r)?
            el.placeholder=d.r:
          void 0,
          (hop(d,"l")&&is.s(d.l))?
            el.href=d.l:
          void 0,
          (hop(d,"g")&&is.s(d.g))?
            el.target=d.g:
          void 0,
          (hop(d,"s")&&!!d.s)?
            el.selected="selected":
          void 0,
          (hop(d,"o")&&!!d.o)?
            el.readOnly=true:
          void 0,
          (hop(d,"q")&&!!d.q)?
            el.required=true:
          void 0,
          (hop(d,"m")&&d.t==="select")?
            el.multiple=true:
          void 0,
          (hop(d,"mt")&&d.t==="form")?
            el.method=d.mt:
          void 0,
          (hop(d,"ac")&&d.t==="form")?
            el.action=d.ac:
          void 0,
          (hop(d,"ac")&&d.t==="form")?
            el.action=d.ac:
          void 0,
          d.t==="a"?
            el.setAttribute("rel","noreferrer"):
          void 0,
          (d.t==="svg"||d.t==="use")?
            ((hop(d,"vb"))?
              el.setAttribute("viewBox",d.vb):
            void 0,
            (hop(d,"par"))?
              el.setAttribute("preserveAspectRatio",d.par):
            void 0,
            (hop(d,"width"))?
              el.setAttribute("width",d.width):
            void 0,
            (hop(d,"height"))?
              el.setAttribute("height",d.height):
            void 0,
            (hop(d,"xlink"))?
              el.setAttributeNS(xlinkns,"xlink:href",d.xlink):
            void 0,
            (hop(d,"trf"))?
              el.setAttribute("transform",d.trf):
            void 0):
          void 0,
          (hop(d,"a"))?
            ((is.s(d.a))?
              append(el,node(d.a)):
            void 0,
            (is.a(d.a))?
              d.a.forEach(function(e){append(el,node(e));}):
            void 0,
            (is.o(d.a)&&!is.a(d.a))?
              append(el,node(d.a)):
            void 0):
          void 0,
          el):
        void 0;
    };
  return {
    r:function(tg,fl,d){
      insert(tg,fl,fragment(d));
    }
  };
})(is,document);