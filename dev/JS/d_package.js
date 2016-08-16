var PK = (function (R,MW) {
  var packagesData = function(d) {
      return d.map(function(e,i){
        return {
          id:e.id,
          nm:e.nm,
          pc:"$"+e.pc+"/month",
          sl:""+e.sl,
          fl:moduleAvailable(e.fl),
          sr:moduleAvailable(e.sr),
          tr:moduleAvailable(e.tr),
          cf:e.cf,
          sm:""+e.sm,
          sp:"$"+e.sp+"/month",
          pr:e.pr,
          cp:packageButtonClass(i),
          bt:i===0?"current package":"choose package",
          ln:i===0?"#":e.ln
        };
      });
    },
    moduleAvailable = function(d) {
      return d?"Yes":"No";
    },
    packageButtonClass = function(d) {
      return(d<2)?
        "pst":"ppr";
    },
    packageTemplate = function(d) {
      return d.map(function(e,i){
        return{
          t:"div",
          i:"package" + i,
          c:"package fl " + e.nm.toLowerCase(),
          a:[{
            t:"p",
            c:"bold white",
            a:e.nm
          },{
            t:"p",
            c:"bold white",
            a:e.pc
          },{
            t:"p",
            c:"bold white",
            a:e.sl
          },{
            t:"p",
            c:"cfl bold "+e.fl,
            a:{
              t:"svg",
              vb:"0 0 22 15",
              par:"xMinYMin slice",
              a:{
                t:"use",
                xlink:"#"+e.fl.toLowerCase()
              }
            }
          },{
            t:"p",
            c:"csr bold "+e.sr,
            a:{
              t:"svg",
              vb:"0 0 22 15",
              par:"xMinYMin slice",
              a:{
                t:"use",
                xlink:"#"+e.sr.toLowerCase()
              }
            }
          },{
            t:"p",
            c:"ctr bold "+e.tr,
            a:{
              t:"svg",
              vb:"0 0 22 15",
              par:"xMinYMin slice",
              a:{
                t:"use",
                xlink:"#"+e.tr.toLowerCase()
              }
            }
          },{
            t:"p",
            c:"bold white",
            a:e.cf
          },{
            t:"p",
            c:"bold white",
            a:e.sm
          },{
            t:"p",
            c:"bold white",
            a:e.sp
          },{
            t:"a",
            c:"pck_btn bold btn btn_blue rd ttu " + e.cp,
            l:e.ln,
            a:e.bt
          }]
        };
      });
    },
    packagesWindowTemplate = function(d) {
      return [{
        t:"h1",
        c:"mh tac bold ttu",
        a:"Upgrade Package"
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
        i:"packages",
        c:"mwpackages tac group",
        a:[{
          t:"div",
          c:"packagelabels bold fl",
          a:[{
            t:"p",
            c:"tar white",
            a:"Package: "
          },{
            t:"p",
            c:"tar white",
            a:"Price: "
          },{
            t:"p",
            c:"tar white",
            a:"Slots: "
          },{
            t:"p",
            c:"cfl tar",
            a:"Blacklist Monitor: "
          },{
            t:"p",
            c:"csr tar",
            a:"Server Monitor: "
          },{
            t:"p",
            c:"ctr tar",
            a:"Traffic Monitor: "
          },{
            t:"p",
            c:"tar white",
            a:"Checking Frequency: "
          },{
            t:"p",
            c:"tar white",
            a:"SMS included: "
          },{
            t:"p",
            c:"tar white",
            a:"Extra slots: "
          }]
        },{
          t:"div",
          c:"packages fl group",
          a:d
        }]
      }];
    };
  return {
    handler: function(d) {
      R.r(mw,false,packagesWindowTemplate(packageTemplate(packagesData(d))));
      MW.open();
    }
  };
})(render,MW);