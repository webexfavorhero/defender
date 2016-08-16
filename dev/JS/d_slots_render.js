var SR = (function (GO,R,El,Ev,MW,DT,SH,UH) {
  var dataHandler=function(o,c) {
      console.log("dataHandler fms: ",o.fms," tms: ",o.tms);
      return {
        _id:o._id,
        _nm:o._nm,
        _url:o._url,
        _ad:DT.format(o._ad),
        msw:o.msw,
        fsw:o.fsw,
        fsc:(GO.pg==="starter")?" disabled":"",
        fcb:SH.flagBlockLists(o.fms,o.ftb),
        fsb:SH.flagBlockListClass(o.fms),
        fst:SH.statusClassToggle(o.fms),
        fms:SH.flagStatusRenderer(o.fms),
        ssw:o.ssw,
        sst:SH.serverStatusToggle(o.sms),
        sms:stringify(o.sms),
        tsw:o.tsw,
        tst:SH.statusClassToggle(o.tms),
        tms:SH.trafficStatusRenderer(o.tc,o.tsw),
        _co:SH.contactsOptionsRenderer(c,o._co),
        _to:SH.trafficOptionsRenderer(o._to),
        _lv:SH.lastVisitorRenderer(o._lv,o._id),
        nti:SH.notificationClassToggle(o.nti),
        ntd:DT.format(o.ntd,1)
      };
    },
    template=function(d) {
      return {
        t:"div",
        i:"slot"+d._id,
        c:"us rd group",
        a:[{
          t:"div",
          c:"ust group",
          a:[{
            t:"div",
            c:"bc cp_col fl pr",
            a:[{
              t:"input",
              p:"checkbox",
              i:"bch"+d._id,
              c:"bulkcheck pa zi1",
              f:"bulkForm",
              n:"bch"+d._id,
              h:false
            },{
              t:"label",
              c:"bulk_cb pa",
              f:"bch"+d._id
            }]
          },{
            t:"div",
            c:"cpn fl group",
            a:[{
              t:"div",
              c:"cp_main_sw cp_col fl pr",
              a:[{
                t:"input",
                p:"checkbox",
                i:"msw"+d._id,
                c:"slotSwChk",
                h:d.msw,
                n:"msw"+d._id,
              },{
                t:"div",
                c:"slotSw rd pa"
              },{
                t:"label",
                f:"msw"+d._id,
                c:"rd pa db"
              }]
            },{
              t:"div",
              c:"cp_module_sw cp_col fl pr",
              a:[{
                t:"input",
                p:"checkbox",
                i:"fsw"+d._id,
                c:"fSwChk",
                h:d.fsw,
                n:"fsw"+d._id,
                d:GO.pg==="starter"?true:false
              },{
                t:"div",
                i:"f_sw"+d._id,
                c:"f_sw rd pa"+d.fsc
              },{
                t:"label",
                f:"fsw"+d._id,
                c:"rd pa db"
              },{
                t:"div",
                c:"f_icon pa "+d.fsc,
                a:{
                  t:"svg",
                  vb:"0 0 20 18",
                  par:"xMinYMin slice",
                  a:{
                    t:"use",
                    xlink:"#block"
                  }
                }
              },{
                t:"span",
                i:"fst"+d._id,
                c:"f_s status pa bold ttu "+d.fst,
                a:d.fms
              },{
                t:"button",
                c:"f_b btn_red rd pa bold tar "+d.fsb,
                i:"fcb"+d._id,
                a:d.fcb?d.fcb:""
              },{
                t:"input",
                p:"checkbox",
                i:"ssw"+d._id,
                c:"sSwChk",
                h:d.ssw,
                n:"ssw"+d._id
              },{
                t:"div",
                i:"s_sw"+d._id,
                c:"s_sw rd pa"
              },{
                t:"label",
                f:"ssw"+d._id,
                c:"rd pa db"
              },{
                t:"div",
                c:"s_icon pa",
                a:{
                  t:"svg",
                  vb:"0 0 20 18",
                  par:"xMinYMin slice",
                  a:{
                    t:"use",
                    xlink:"#server"
                  }
                }
              },{
                t:"span",
                i:"sst"+d._id,
                c:"s_s status pa bold ttu "+d.sst,
                a:d.sms
              },{
                t:"input",
                p:"checkbox",
                i:"tsw"+d._id,
                c:"tSwChk",
                h:d.tsw,
                n:"tsw"+d._id
              },{
                t:"div",
                i:"t_sw"+d._id,
                c:"t_sw rd pa"
              },{
                t:"label",
                f:"tsw"+d._id,
                c:"rd pa db"
              },{
                t:"div",
                c:"t_icon pa",
                a:{
                  t:"svg",
                  vb:"0 0 20 18",
                  par:"xMinYMin slice",
                  a:{
                    t:"use",
                    xlink:"#traffic"
                  }
                }
              },{
                t:"span",
                i:"tst"+d._id,
                c:"t_s status pa bold ttu "+d.tst,
                a:d.tms
              }]
            }]
          },{
            t:"div",
            c:"dt fl pr",
            a:[{
              t:"div",
              c:"dt_row group",
              a:[{
                t:"p",
                c:"dt_l bold fl tal",
                a:"Name "
              },{
                t:"p",
                i:"_nm"+d._id,
                c:"dt_d bold fl oh",
                a:d._nm
              },{
                t:"input",
                p:"text",
                i:"nme"+d._id,
                c:"usi rd dt_d dn fl oh",
                v:d._nm,
                r:d._nm
              }]
            },{
              t:"div",
              c:"dt_row group",
              a:[{
                t:"p",
                c:"dt_l bold fl tal",
                a:"URL "
              },{
                t:"p",
                c:"dt_d bold fl oh",
                a:{
                  t:"a",
                  i:"_url"+d._id,
                  l:d._url,
                  g:"_blank",
                  a:d._url
                }
              },{
                t:"input",
                p:"text",
                i:"urle"+d._id,
                c:"usi rd dt_d dn fl oh",
                v:d._url,
                r:d._url
              }]
            },{
              t:"div",
              c:"dt_row group",
              a:[{
                  t:"p",
                  c:"dt_l bold fl tal",
                  a:"Added "
                },{
                  t:"p",
                  i:"_ad"+d._id,
                  c:"dt_a fl",
                  a:d._ad
                }
              ]
            },{
              t:"div",
              i:"fade"+d._id,
              c:"fade pa"
            }]
          },{
            t:"div",
            c:"to fl",
            a:[{
              t:"div",
              c:"to_row group pr",
              a:[{
                t:"p",
                c:"to_l dib bold",
                a:"Last visitor"
              },{
                t:"p",
                i:"_lv"+d._id,
                c:"to_c dib tac bold",
                a:d._lv
              }]

            },{
              t:"div",
              c:"to_row group pr",
              a:[{
                t:"p",
                c:"to_l dib to_n bold",
                a:"Alarm"
              },{
                  t:"select",
                  c:"tnselect rd bold tal",
                  i:"_to"+d._id,
                  n:"_to"+d._id,
                  a:d._to
                },{
                  t:"div",
                  c:"selectlabel tlabel pa zi1",
                  a:{
                    t:"svg",
                    vb:"0 0 9 6",
                    par:"xMinYMin slice",
                    a:{
                      t:"use",
                      xlink:"#s_arr"
                    }
                  }
                }]
            }]
          },{
            t:"div",
            c:"nt fl",
            a:[{
              t:"div",
              c:"nt_row group",
              a:[{
                t:"p",
                c:"nt_l tac to_n fl bold db",
                a:"Most rescent event"
              },{
                t:"span",
                c:"nt_time tac fl bold",
                a:[{
                  t:"span",
                  i:"nti"+d._id,
                  c:"nt_icon fl db "+d.nti
                },{
                  t:"span",
                  c:"ntd dib",
                  i:"ntd"+d._id,
                  a:d.ntd
                }]
              }]
            }]
          },{
            t:"div",
            c:"st fl",
            a:{
              t:"button",
              i:"slide"+d._id,
              c:"slide",
              a:{
                t:"svg",
                vb:"0 0 21 21",
                par:"xMinYMin slice",
                a:{
                  t:"use",
                  xlink:"#settings"
                }
              }
            }
          }]
        },{
          t:"div",
          i:"usb"+d._id,
          c:"usb group slider oh",
          a:[{
            t:"div",
            c:"statuses fl group pr",
            a:{
              t:"button",
              i:"mch"+d._id,
              c:"mch bold btn btn_blue rd",
              a:"Manual check "
            }
          },{
            t:"div",
            c:"contactselect fl group pr",
            a:[{
              t:"p",
              c:"nts_l bold fl",
              a:"Contacts"
            },{
              t:"select",
              i:"_co"+d._id,
              n:"_co"+d._id,
              c:"ntselect rd zi1 bold tal",
              m:true,
              a:d._co
            },{
              t:"div",
              c:"selectlabel nlabel pa zi1",
              a:{
                t:"svg",
                vb:"0 0 9 6",
                par:"xMinYMin slice",
                a:{
                  t:"use",
                  xlink:"#s_arr"
                }
              }
            },{
              t:"button",
              i:"use"+d._id,
              c:"use bold btn btn_blue rd pa",
              a:"Edit"
            },{
              t:"button",
              i:"uss"+d._id,
              c:"uss bold btn btn_blue rd dn pa",
              d:true,
              a:"Save"
            }]
          },{
            t:"div",
            c:"trafficscript fl group pr",
            a:[{
              t:"button",
              c:"scriptgen bold btn btn_blue rd fl",
              i:"_sg"+d._id,
              a:"Generate script"
            },{
              t:"button",
              i:"stat"+d._id,
              c:"stat bold btn btn_blue rd fr",
              a:"statistic"
            }]
          },{
            t:"div",
            c:"remove fl",
            a:{
              t:"button",
              i:"usr"+d._id,
              c:"usr ma",
              a:{
                t:"svg",
                vb:"0 0 16 21",
                par:"xMinYMin slice",
                a:{
                  t:"use",
                  xlink:"#bin"
                }
              }
            }
          }]
        }]
      };
    },
    preselectFocus=function(t) {
      t.onfocus = function() {
        t.select();
        t.onmouseup = function() {
          t.onmouseup = null;
          return false;
        };
      };
      t.onblur = function() {
        t.focus();
      };
      t.focus();
    },
    scriptTemplate=function(s) {
      return [{
        t:"h1",
        c:"mh tac bold ttu",
        a:"Generated Javascript"
      },{
        t:"button",
        i:"cmw",
        c:"cmw pa",
        a:{
          t:"svg",
          vb:"0 0 13 13",
          par:"xMinYMin slice",
          a:{
            t:"use",
            xlink:"#cross"
          }
        }
      },{
        t:"textarea",
        i:"_gs",
        c:"msgw",
        o:1,
        a:s.s
      },{
        t:"p",
        c:"gsp",
        a:[
          "Press ",{
            t:"span",
            c:"bold",
            a:"Ctrl + C"
          }," on Windows or ",{
            t:"span",
            c:"bold",
            a:"\u2318 + C"
          }," on Mac,to copy the script to the Clipboard."
        ]
      },{
        t:"p",
        c:"gsp",
        a:["Paste the script on your page,into the top of your ",{
          t:"span",
          c:"bold",
          a:"<head>"
        }," tag."]
      }];
    },
    handler=function(d,f) {
      GO.addUrl(d);
      R.r(El.fbi("uc"),f,template(dataHandler(d,GO._cos)));
      SH.disableSwitch(d._id);
      Ev.a(El.fbi("nme"+d._id),"blur",UH.editValidationHandler);
      Ev.a(El.fbi("urle"+d._id),"blur",UH.editValidationHandler);
      Ev.a(El.fbi("_co"+d._id),"blur",UH.multipleContactSelectHandler);
      Ev.a(El.fbi("slot"+d._id),"click",UH.urlClicktHandler);
      Ev.a(El.fbi("slot"+d._id),"change",UH.urlChangeHandler);
    },
    render=function(d) {
      d.map(handler);
    },
    generateScript=function(d) {
      R.r(El.fbi("mw"),false,scriptTemplate(d));
      MW.open();
      preselectFocus(El.fbi("_gs"));
    };
  return {
    generateScript:generateScript,
    render:render,
    handler:handler
  };
})(GO,render,elm,evnt,MW,DT,SH,UH);