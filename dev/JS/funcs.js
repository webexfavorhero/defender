function stringify(d) {
  "use strict";
  return is.s(d) ? d : "" + d;
}
function hop(o, p) {
  "use strict";
  return(o && p) ? o.hasOwnProperty(p) : void 0;
}
function Js(s) {
  "use strict";
  return JSON.stringify(s);
}
function Jp(j) {
  "use strict";
  return JSON.parse(j);
}
function idss(s,n,z) {
  "use strict";
  return s.substr(is.u(z)?n:z,is.u(z)?s.length:n);
}