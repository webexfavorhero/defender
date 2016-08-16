var elm = (function(C,D) {
  return {
    hide:function(){
      Array.prototype.slice.call(arguments,0).map(function(e){C.a(e,"dn");});
    },
    show:function(){
      Array.prototype.slice.call(arguments,0).map(function(e){C.r(e,"dn");});
    },
    fbi:function(i){
      return i ? D.getElementById(i) : void 0;
    },
    fbc:function(c){
      return c ? D.getElementsByClassName(c) : void 0;
    },
    html:function(t,d){
      t.innerHTML=d;
    },
    content:function(t) {
      return t.innerHTML;
    },
    clear:function (t) {
      t.innerHTML="";
    },
    remove:function(t){
      t ? t.parentElement.removeChild(t) : void 0;
    }
  };
})(cls,document);