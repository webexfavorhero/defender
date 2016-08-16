var GO = (function(){
  return {
    pg: "",
    mw:false,
    tz:false,
    _tz:[],
    _bch:[],
    _eds:[],
    _cos:[],
    _ids:[],
    _coids:[],
    _msw:{},
    _nms:{},
    _urls:{},
    _lv:{},
    _cosid:{},
    _tosst:{},
    _cosnf:{},
    _cosnm:{},
    rmNm:function(id) {
      delete this._nms[id];
    },
    rmUrl:function(id) {
      delete this._urls[id];
    },
    rmLv:function(id){
      delete this._lv[id];
    },
    addUrl:function(d) {
      this._ids.push(d._id);
      this._bch.push("bch" + d._id);
      this._eds.push("edit" + d._id);
      this._nms[stringify(d._id)] = d._nm;
      this._urls[stringify(d._id)] = d._url;
      this._lv[stringify(d._id)] = d._lv;
      this._cosid[stringify(d._id)] = d._co;
      this._tosst[stringify(d._id)] = d._to;
      this._msw[stringify(d._id)] = d.msw;
    },
    removeUrl:function (id) {
      this.rmNm(id);
      this.rmUrl(id);
      this.rmLv(id);
      this._bch=this._bch.filter(function(e){return e!=="bch"+id;});
      this._eds=this._eds.filter(function(e){return e!=="edit"+id;});
      this._ids=this._ids.filter(function(e){return e!==id;});
      delete this._cosid[id];
      delete this._tosst[id];
      delete this._msw[id];
    },
    edMsw:function(id, msw) {
      this._msw[id] = msw;
    },
    cMsw:function() {
      var c = 0,
        msw = this._msw,
        k;
      for (k in msw) {
        msw[k] == 1 ? c++ :void 0;
      }
      return c;
    },
    findId:function(id) {
      return this._ids.indexOf(id)!== -1?id:void 0;
    },
    findCoId:function(id) {
      return this._coids.indexOf(id) !== -1?id:void 0;
    },
    findCoNm:function(n) {
      Object.keys(this._cosnm).map(function(e) {
        return this._cosnm[e]===n?this._cosnm[e]:false;
      },this);
    },
    addCos:function(cos) {
      this._cos = cos;
      cos.forEach(function(e){
        this._coids.push(e._id);
        this._cosnm[e._id]=e.nm;
        this._cosnf[e._id]=e.nf;
      },this);
    },
    addNewCo:function(co) {
      this._cos.push(co);
      this._coids.push(co._id);
      this._cosnm[co._id]=co.nm;
      this._cosnf[co._id]=co.nf;
    },
    rmCo:function(id) {
      this._cos=this._cos.filter(function(e){if(e._id!==id){return e;}});
      this._coids=this._cos.map(function(e){return e._id;});
      delete this._cosnm[id];
      delete this._cosnf[id];
    },
    rmCoNm:function(n) {
      Object.keys(this._cosnm).map(function(e) {
        this._cosnm[e]===n?delete this._cosnm[e]:void 0;
      },this);
    },
    editCo:function(co, id) {
      this._cosid[stringify(id)] = co;
    },
    editNt:function(nt, id) {
      this._tosst[stringify(id)] = nt;
    },
    editLv:function(d, id) {
      this._lv[id]=d;
    }
  };
})();