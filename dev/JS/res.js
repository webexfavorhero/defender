var UI = (function(W){
  var wu=function(){
      return W.innerWidth;
    },
    hu=function () {
      return W.innerHeight;
    };
  return{
    wu:wu,
    hu:hu,
  };
})(window),
br = (function(W){
  var a,
    WN = W.navigator,
    WNU = WN.userAgent,
    isChromium = W.chrome,
    isOpera = WNU.indexOf("OPR") > -1;
  if(isChromium !== null && isChromium !== undefined && WN.vendor === "Google Inc." && isOpera === false) {
    a = "C";
  } else if (isOpera) {
    a = "O";
  } else if (typeof InstallTrigger !== 'undefined'){
    a = "F";
  } else if (Object.prototype.toString.call(W.HTMLElement).indexOf('Constructor') > 0){
    a = "S";
  } else if (/*@cc_on!@*/false || !!document.documentMode){
    a = "I";
  } else if (WNU.indexOf("Edge") > -1){
    a = "E";
  } else {
    a = "unknown";
  }
  return a;
})(window),
href = function(w, h){
  return (w<h&&w<=640)?
    "/css/mobile.css":
    (w<h&&w>640&&w<1200)?
      "/css/tablet.css":
      (w>h&&w>=1200)?
        "/css/desktop.css":
        void 0;
},
media = function(w){
  return w<=640?"(max-width:640px)":(w>640&&w<1200)?"(min-width:641px) and (max-width:1199px)":(w>=1200)?"(min-width:1200px)":void 0;
},
applyCss = function (w,h,m){
  var df,link,media,r_c=document.getElementById("r_c");
  r_c?
    r_c.parentElement.removeChild(r_c):
  void 0;
  df = document.createDocumentFragment();
  link = document.createElement("link");
  link.type="text/css";
  link.id = "r_c";
  link.href= href(w,h);
  link.setAttribute("media","none");
  link.setAttribute("onload","if(media=='none')media="+m);
  df.appendChild(link);
  document.head.appendChild(df);
},
fl = function(pr){
  var df,link,media;
  df = document.createDocumentFragment();
  link = document.createElement("link");
  link.type="text/css";
  link.id = "fnt1";
  link.href= "/fonts/"+pr+((br==="C"||br==="F"||br==="O")?
    "woff2":
    (br==="S")?
      "svg":
      "woff")+".css";
  link.setAttribute("media","none");
  link.setAttribute("onload","if(media=='none')media=all");
  df.appendChild(link);
  document.head.appendChild(df);
};
applyCss(UI.wu(),UI.hu(),media(UI.wu()));
window.onresize = function(){
  applyCss(UI.wu(),UI.hu(),media(UI.wu()));
};