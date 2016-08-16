var evnt = (function(W) {
  return {
    a: function(o, e, fn, c) {
      W.attachEvent ? o.attachEvent("on" + e, fn) : c = !c ? false : void 0;
      o.addEventListener(e, fn, c);
    },
    r: function(o, e, fn) {
      o.removeEventListener ? o.removeEventListener(e, fn, false) : void 0;
      o.detachEvent ? o.detachEvent('on' + e, fn) : void 0;
    },
    t: function(e) {
      return {
        e: e || W.event,
        t: e ? e.target : W.event.srcElement
      };
    },
    s: function(e) {
      !e ? e = W.event: void 0;
      e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }
  };
})(window);