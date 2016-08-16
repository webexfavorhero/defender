! function(t, e, n) {
  function o(t) {
    return JSON.stringify(t);
  }

  function r(t) {
    var e = 0;
    for(e; e < t.length; e++)
      if(t[e].u === w) return t[e];
    return {
      u: "",
      k: ""
    };
  }

  function a(t) {
    return x = new XMLHttpRequest(), "withCredentials" in x ? x.open("POST", t, !0) : "undefined" != typeof XDomainRequest() ? (x = new XDomainRequest(), x.open("POST", t)) : x = null, x.setRequestHeader("Content-Type", "application/json;charset=UTF-8", "X-Requested-With", "XMLHttpRequest"), x;
  }

  function u(t, e) {
    return t.length === e.u.indexOf("/") ? !0 : void 0;
  }
  function s(t) {
    a(v + "//trdf.co").send(t);
  }
  var x, c = "1.6.0",
    f = +new Date(),
    k = (Math.random() + 1).toString(36).substr(2),
    v = n.protocol,
    h = n.pathname,
    l = "1" == e.doNotTrack || "yes" == e.doNotTrack || "1" == e.msDoNotTrack || "1" == t.doNotTrack ? "DNT" : document.referrer,
    p = [{
      u: "https://www.trafficdefender.net/dashboard",
      k: "kOKN4b2WUv5sH0xy"
    }],
    w = v + "//" + n.hostname + ("/" !== h ? h : ""),
    T = r(p),
    K = T.k,
    U = T.u,
    g = u(v, T);
  "" !== U && (g ? s(o({
      v: c,
      r: k,
      k: K,
      t: f,
      q: l,
      d: t.innerWidth+"x"+t.innerHeight
    })):void 0),
  t.onload = function() {
    U !== "" && (g ? s(o({
      v: c,
      r: k,
      k: K,
      l: +new Date() - f
    })) : void 0);
  }, t.onbeforeunload = function() {
    U !== "" && (g ? s(o({
      v: c,
      r: k,
      k: K,
      e: +new Date() - f
    })) : void 0);
  };
}(window, navigator, location);