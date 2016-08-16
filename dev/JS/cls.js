var cls = (function() {
  return {
    l:function(z) {
      return z.className.split(" ");
    },
    i:function(z, y) {
      return z.indexOf(y) !== -1;
    },
    f:function(z, y) {
      return z.classList?
        z.classList.contains(y):
        z.className?
          this.i(this.l(z), y):
          z.getAttribute("class")?
            this.i(z.getAttribute("class").split(" ")):
          void 0;
    },
    a: function(z, y) {
      z.classList ? z.classList.add(y) : z.className ? this.f(z, y) ? void 0 : z.className += " " + y : z.setAttribute("class", y);
    },
    r: function(z, y) {
      z.classList ? z.classList.remove(y) : z.className ? !this.f(z, y) ? void 0 : z.className = (this.l(z).splice(this.l(z).indexOf(y), 1).join(" ")) : z.removeAttribute("class");
    }
  };
})();