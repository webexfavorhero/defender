var SC = (function (B,C) {
  var to;
  return {
    set:function(){
      clearTimeout(this.to);
      !C.f(B,'nohover')?
        C.a(B,'nohover'):
      void 0;
      this.to = setTimeout(function(){
        C.r(B,'nohover');
      },1000);
    }
  };
})(document.body,cls);