import { globals } from './globals.mjs';
import { x, xrender } from './xscript.mjs';
import { xviews } from './xviews.mjs';
import { xdata } from './xdata.mjs';
import { tpl } from './tpl.mjs';
import { utils } from './utils.mjs';
import { db } from './enc.mjs';

let navigate = {},
paths = [];

let app_main = x('div');

// app default functions
let defaults = Object.assign(xdata.default, {
  app_main: app_main,
  each: {
    before: function(dest) {
      // return false;  cancel rout
      return true; // continue to rout
    },
    after: function(dest) {
      document.title = dest.slice(1);
    }
  },
  init: function(){

    let item = [
      tpl.navbar(xdata, router, db),
      tpl.mainmenu(xdata, router, ls),
      tpl.appmain(app_main),
      tpl.infotab()
    ]

    xutils.build(xdata, item);
    return this;
  },
  render: function(stream, path, data, cb){
    xrender(stream, xviews[path], data, xdata[path], cb);
    return this;
  }
})

const xutils = {
  build(xdata, main){
    let doc = document,
    css = xdata.default.styles,
    js_head = xdata.default.js_head,
    js_body = xdata.default.js_body,
    head_args = [],
    body_args = main,
    delete_meta = xdata.default.delete_meta;

    doc.scripts.namedItem(xdata.default.base_script_name).remove()

    if(xdata.default.webmanifest){

      head_args.push(x('link', {
        href: xdata.default.webmanifest,
        rel: 'manifest'
      }))

    }

    if(css && css.length){
      for (let i = 0; i < css.length; i++) {
        head_args.push(x('link', css[i]))
      }
    }

    if(js_head && js_head.length){
      for (let i = 0; i < js_head.length; i++) {
        head_args.push(x('script', js_head[i]))
      }
    }

    doc.head.append(...head_args)

    if(js_body && js_body.length){
      for (let i = 0; i < js_body.length; i++) {
        body_args.push(x('script', js_body[i]))
      }
    }

    doc.body.append(...body_args);

    if(delete_meta){
      let meta = doc.head.childNodes;
      setTimeout(function(){
        for (let i = 0; i < meta.length; i++) {
          if(meta[i].tagName === 'META'){
            meta[i].remove();
          }
        }
      }, delete_meta)

    }

  },
  ls: {
    get(i) {
      return JSON.parse(localStorage.getItem(i))
    },
    set(i, e) {
      localStorage.setItem(i, JSON.stringify(e))
      return;
    },
    del(i) {
      localStorage.removeItem(i);
    }
  },
  ss: {
    get(i) {
      return JSON.parse(sessionStorage.getItem(i))
    },
    set(i, e) {
      sessionStorage.setItem(i, JSON.stringify(e))
      return;
    },
    del(i) {
      sessionStorage.removeItem(i);
    }
  },
  url: {
    add(text, type, charset){
      return URL.createObjectURL(xutils.blob(text, type, charset))
    },
    del(item){
      URL.revokeObjectURL(item);
    },
    parse(i){
      return new URL(i)
    }
  },
  parse_params(str){
    str = str.split('?');
    let obj = {
      dest: str[0]
    }
    if(str[1]){
      obj.params = new URLSearchParams(str[1])
    }
    return obj;
  },
  blob(text, type, charset){
    return new Blob([text], {
      type: [type +";"+ charset].join(';')
    })
  },
  empty(settings, i){
    if(!i){
      i = settings.app_main
    }
    while(i.firstChild){
      i.removeChild(i.firstChild);
    }
  },
  fetch(settings, src, options, cb){
    let cnf = settings.fetch
    if(typeof options === 'function'){
      cb = options;
      options = cnf;
    } else {
      options = Object.assign(cnf, options);
    }

    let headers = {}
    fetch(src, options).then(function(res){

      if (res.status >= 200 && res.status < 300) {
        headers.status = res.status;
        headers.statusText = res.statusText;
        res.headers.forEach(function(x,y){
          headers[y] = x;
        })
        return res.text();
      } else {
        return Promise.reject(new Error(res.statusText))
      }
    }).then(function(data){
      let ctype = headers['content-type'],
      obj = {
        headers: headers,
        body: data
      }

      if (ctype && ctype.includes('application/json')) {
        obj.json = JSON.parse(data);
      }

      cb(false, obj);

      headers = data = null;
    }).catch(function(err){
      cb(err)
    })
  },
  path(src){
    try {
      src = src.split('/');
      let len = src.length,
      fileName = src.pop(),
      base = fileName.split('.');

      return {
        fileName: fileName,
        baseName: base[0],
        ext: base.pop(),
        dirName: src.join('/')
      }
    } catch (err) {
      return null;
    }
  }
}

Object.freeze(xutils)

function Router(cnf) {
  this.settings = cnf;

  let settings = this.settings,
  i = ls.get(settings.storage.prefix)
  if (!i || i === '') {
    ls.set(settings.storage.prefix, {})
  }

  let init = settings.init;
  if(init){
    this.init = settings.init
  }

}

Router.prototype = {
  on(dest, fn) {
    navigate[dest] = fn;
    return this;
  },
  off(dest, cb) {
    delete navigate[dest];
    return this;
  },
  back() {
    let pf = this.settings.storage.prefix,
    r = ls.get(pf),
    current = ls.get(pf +'_current'),
    prev = ls.get(pf +'_prev');

    if(current === prev || !prev || typeof prev !== 'string' || !r[prev]){
      return;
    }

    this.rout(prev, r[prev])
  },
  rout(dest, data){
    let pf = this.settings.storage.prefix,
    next = dest;

    ls.set(pf +'_state', data || {});
    ls.set(pf +'_current', next);
    location.hash = dest;
    return this
  },
  routfn() {
    let settings = this.settings,
    pf = settings.storage.prefix,
    dest = location.hash.slice(1),
    data = ls.get(pf +'_state'),
    params;
    data = {data: data};
    if(settings.params){
      params = xutils.parse_params(dest);
      dest = params.dest;
      data.params = params.params;
    }

    if (dest === settings.error) {
      navigate[dest](data, stream)
      return;
    }

    if (dest === settings.base_path && !data) {
      data = {data: settings.base_data};
    }

    let before = settings.each.before,
    after = settings.each.after,
    r = ls.get(settings.storage.prefix),
    current = ls.get(pf +'_current');

    if (before && typeof before === 'function') {
      if (!before(dest)) {
        return;
      };
    }

    let loc = location;

    data.href = loc.href;
    data.host = loc.host;
    data.path = loc.hash.slice(1);

    try {
      navigate[dest](data, stream);
      r[dest] = {
        date: Date.now() + settings.storage.max_age,
        data: data
      }

      ls.set(pf, r);
      ls.set(pf +'_prev', current);

    } catch (err) {
      if(this.settings.verbose){
        console.error(err)
      }
      return navigate[this.settings.error]({data:{
        dest: dest,
        msg: 'not found',
        code: 404
      }}, stream);

    }

    if (after && typeof after === 'function') {
      after(dest);
    }
  },
  listen() {
    let settings = this.settings,
    routfn = this.routfn;

    let dest = location.hash.slice(1),
    pf = settings.storage.prefix,
    params;

    if(settings.params){
      params = xutils.parse_params(dest);
      dest = params.dest;
      params = params.params;
    }



    ls.set(pf +'_current', dest);

    if (location.href !== settings.origin) {
      let r = ls.get(pf),
      dnow = Date.now();

      if (r[dest]) {
        if (r[dest].date && typeof r[dest].date === 'number' && r[dest].date > dnow) {
          if(settings.params && params){
            r[dest].data.params = params
          }
          navigate[dest](r[dest].data, stream);
        } else {
          this.rout(settings.base_path, settings.base_data, stream);
          delete r[dest];
          ls.set(pf, r);
        }
      } else {
        this.rout(settings.base_path, settings.base_data, stream);
      }
    } else {
      this.rout(settings.base_path, settings.base_data, stream);
    }

    return this;
  },
  validate() {
    let pf = this.settings.storage.prefix,
    r = ls.get(pf),
    dnow = Date.now();
    try {
      Object.keys(r).forEach(function(key) {
        if (key.date < dnow){delete r[key];}
      });
      ls.set(pf, r);
    } catch (err) {
      console.error(err)
    } finally {
      return this;
    }
  }
};

function Stream(){
  this.settings = defaults
}

Stream.prototype = {
  render(item, data, cb){
   this.settings.render(this, item, data,cb);
   return this;
  },
  renderErr(){
    navigate[this.settings.error]({data:{
      msg: 'render error',
      code: 500
    }}, this);
    return this;
  },
  replace(src, data){
    navigate[src]({data:data}, this, cb);
    return this;
  },
  redirect(src, data){
    router.rout(src, data);
    return this;
  },
  download(filename, text, type, charset){
    xutils.download(this.settings.download, filename, text, type, charset);
    return this;
  },
  empty(x){
    xutils.empty(this.settings, x);
    return this;
  },
  append(x){
    this.settings.app_main.append(x);
    return this;
  },
  fetch(src, options, cb){
    xutils.fetch(this.settings, src, options, cb);
    return this;
  },
  setCookie(key,val,obj){
    xutils.cookie.set(key,val,obj);
    return this;
  },
  getCookie(key){
    return xutils.cookie.get(key);
  },
  delCookie(key){
    xutils.cookie.del(key);
    return this;
  },
  lsSet(key,val){
    ls.set(key,val);
    return this;
  },
  lsGet(key){
    return ls.get(key);
  },
  lsDel(key){
    ls.del(key);
    return this;
  },
  ssSet(key,val){
    xutils.ss.set(key,val);
    return this;
  },
  ssGet(key){
    return xutils.ss.get(key);
  },
  ssDel(key){
    xutils.ss.del(key);
    return this;
  },
  path: xutils.path,
  js: JSON.stringify,
  jp: JSON.parse,
  blob: xutils.blob,
  url: xutils.url
}



window.ss = xutils.ss;
window.ls = xutils.ls;

window.router = new Router(defaults);
const stream = new Stream(defaults);


window.onhashchange = function(){
  router.routfn()
}


globals.init().listeners().events();

window.onload = function(){
  setTimeout(function(){
    document.documentElement.removeAttribute('style')

  },1000)

  router
  .on('/vault', function(request, stream) {
    stream.render('vault', request.data, function(err){
      if(err){return stream.renderErr();}

    })
  })
  .on('/home', function(request, stream) {
    if(utils.isLoggedIn(router, xdata)){
      stream.render('home', request.data, function(err){
        if(err){return stream.renderErr();}
      })
    }
  })
  .on('/about', function(request, stream) {
    if(utils.isLoggedIn(router, xdata)){
      stream.render('about', request.data, function(err){
        if(err){return stream.renderErr();}
      })
    }
  })
  .on('/birthdays', function(request, stream) {
    if(utils.isLoggedIn(router, xdata)){
      stream.render('birthdays', request.data, function(err){
        if(err){return stream.renderErr();}
      })
    }
  })
  .on('/business', function(request, stream) {
    if(utils.isLoggedIn(router, xdata)){
      stream.render('business', request.data, function(err){
        if(err){return stream.renderErr();}
      })
    }
  })
  .on('/bills', function(request, stream) {
    if(utils.isLoggedIn(router, xdata)){
      stream.render('bills', request.data, function(err){
        if(err){return stream.renderErr();}
      })
    }
  })
  .on('/contacts', function(request, stream) {
    if(utils.isLoggedIn(router, xdata)){
      stream.render('contacts', request.data, function(err){
        if(err){return stream.renderErr();}
      })
    }
  })
  .on('/diary', function(request, stream) {
    if(utils.isLoggedIn(router, xdata)){
      stream.render('diary', request.data, function(err){
        if(err){return stream.renderErr();}
      })
    }
  })
  .on('/emails', function(request, stream) {
    if(utils.isLoggedIn(router, xdata)){
      stream.render('emails', request.data, function(err){
        if(err){return stream.renderErr();}
      })
    }
  })
  .on('/events', function(request, stream) {
    if(utils.isLoggedIn(router, xdata)){
      stream.render('events', request.data, function(err){
        if(err){return stream.renderErr();}
      })
    }
  })
  .on('/locations', function(request, stream) {
    if(utils.isLoggedIn(router, xdata)){
      stream.render('locations', request.data, function(err){
        if(err){return stream.renderErr();}
      })
    }
  })
  .on('/notes', function(request, stream) {
    if(utils.isLoggedIn(router, xdata)){
      stream.render('notes', request.data, function(err){
        if(err){return stream.renderErr();}
      })
    }
  })
  .on('/passwords', function(request, stream) {
    if(utils.isLoggedIn(router, xdata)){
      stream.render('passwords', request.data, function(err){
        if(err){return stream.renderErr();}
      })
    }
  })
  .on('/schedule', function(request, stream) {
    if(utils.isLoggedIn(router, xdata)){
      stream.render('schedule', request.data, function(err){
        if(err){return stream.renderErr();}
      })
    }
  })
  .on('/shopping', function(request, stream) {
    if(utils.isLoggedIn(router, xdata)){
      stream.render('shopping', request.data, function(err){
        if(err){return stream.renderErr();}
      })
    }
  })
  .on('/todos', function(request, stream) {
    if(utils.isLoggedIn(router, xdata)){
      stream.render('todos', request.data, function(err){
        if(err){return stream.renderErr();}
      })
    }
  })

  .on('/settings', function(request, stream) {
    if(utils.isLoggedIn(router, xdata)){
      stream.render('settings', request.data, function(err){
        if(err){return stream.renderErr();}
      })
    }
  })
  .on('/error', function(request, stream) {
    stream.render('error', request.data, function(err){
      if(err){return console.error(err)}
    })
  })
  .init().listen().validate();

  window.onload = null;
}

export { xutils }
