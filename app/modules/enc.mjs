import { xcrypt } from './xcrypt.mjs';
import { xdata } from './xdata.mjs';

var verifyorigin = function(){
  if(location.hash !== '#/vault'){
    router.rout('vault', xdata.vault);
    location.reload;
  } else {
    window.removeEventListener('load', verifyorigin, false);
    verifyorigin = null;
  }
}

window.addEventListener('load', verifyorigin, false);
window.basekey = xcrypt.generateKey('hex');

const enc = {
  encrypt(data, key){
    try {
      let ctext = xcrypt.enc(data, key, 'SERPENT', 'hex');
      return ctext;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  decrypt(data, key){
    try {
      let ptext = xcrypt.dec(data, key, 'SERPENT', 'hex');
      return ptext;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  encdb(cb){

    pouch.get('store', function(err, doc) {
      if (err) {
        cb(err)
      } else {

        doc.updated = Date.now();

        try {

          let detail = enc.tpmGet(),
          newsalt = enc.saltGen(),
          newkey = enc.pbkdf2(detail.keys, newsalt),
          cipher = detail.cipher;

          if(!newkey){
            return cb('pbkdf2 failed')
          }

          doc.ctext = xcrypt.enc(js(doc.ptext), newkey, detail.cipher, 'hex');
          doc.salt = newsalt;

          pouch.put(doc, function(err, response) {
            if (err) {return cb(err);}
            pouch.compact(function (err, result) {
              if (err) { return cb(err); }

              cb(false);
            });
          })

        } catch (err) {
          cb(err)
        }

      }
    })


  },
  decdb(cb){
    pouch.get('store', function(err, doc) {
      if (err) {
        cb(err)
      } else {

        let dt = Date.now();
        doc.lastaccess = dt;
        doc.login.prior.unshift(dt)
        doc.login.prior.pop()
        ss.set('user', doc.user);
        try {

          let detail = enc.tpmGet(),
          newkey = enc.pbkdf2(detail.keys, doc.salt),
          cipher = detail.cipher;

          if(!newkey){
            return cb('pbkdf2 failed')
          }

          doc.ptext = jp(xcrypt.dec(doc.ctext, newkey, detail.cipher, 'hex'));

          if(typeof doc.ptext !== 'object'){
            return (cb('invalid password'))
          }
          pouch.put(doc, function(err, response) {
            if (err) {return cb(err);}
            pouch.compact(function (err, result) {
              if (err) { return cb(err); }

              cb(false);
            });
          })

        } catch (err) {
          cb(err)
        }

      }
    })
  },
  cascadeEnc(data, obj){

    try {
      let ctext = xcrypt.enc3x(data, obj.key3x, obj.algo3x, 'hex');
      return ctext
    } catch (err) {
      console.log(err);
      return false
    }

  },
  cascadeDec(data, obj){

    try {
      let ptext = xcrypt.dec3x(data, obj.key3x, obj.algo3x, 'hex');
      return ptext
    } catch (err) {
      console.log(err);
      return false
    }

  },
  sha3_512(i,e){

    try {
      var hash = CryptoJS.SHA3(i, { outputLength: e /* 256/512 */ });
      return hash.toString(CryptoJS.enc.Hex);
    } catch (err) {
      console.log(err);
      return false
    }

  },
  saltGen(){

    try {
      let salt = CryptoJS.lib.WordArray.random(128 / 8);
      return salt;
    } catch (err) {
      console.log(err);
      return false;
    }

  },
  saltList(){

    return enc.words2hex(enc.saltGen());

  },
  hex2text(hex){

    try {
      let res = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Hex.parse(hex))
      return res;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  text2hex(text){

    try {
      let res = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(text))
      return res;
    } catch (err) {
      console.log(err);
      return false;
    }

  },
  hex2words(hex){

    try {
      let res = CryptoJS.enc.Hex.parse(hex);
      return res;
    } catch (err) {
      console.log(err);
      return false;
    }

  },
  words2hex(words){

    try {
      let res = CryptoJS.enc.Hex.stringify(words);
      return res;
    } catch (err) {
      console.log(err);
      return false;
    }

  },
  pbkdf2(secret, salt){

    try {
      let key = CryptoJS.PBKDF2(secret, salt, {
        keySize: 256 / 32,
        iterations: 10
      });
      return enc.words2hex(key);
    } catch (err) {
      console.log(err);
      return false;
    }

  },
  tpmSet(obj){
    return ss.set('tpm', enc.encrypt(js(obj), basekey))
  },
  tpmGet(){
    return jp(enc.decrypt(ss.get('tpm'), basekey));
  }

}

Object.freeze(enc)

const pouch = new PouchDB('xcrypto');

const db = {
  get(cb){

    pouch.get('store', function(err, doc) {
      if (err) {
        return cb(err)
      }
      cb(false, doc);
    })

  },
  logout(cb){

    enc.encdb(function(err){
       if(err){return cb(err)};
       pouch.get('store', function(err, doc) {
         if (err) {
           cb(err)
         } else {

           doc.updated = Date.now();
           doc.ptext = false;

           pouch.put(doc, function(err, response) {
             if (err) {return cb(err);}
             pouch.compact(function (err, result) {
               if (err) { return cb(err); }
               cb(false);
             });
           })
         }
       })
    })



  },
  loginDb(obj, router, cb){

    pouch.get('store', function(err, doc) {

      if(err){
        console.log(err);
      } else {

        if(doc.ctext !== false){
          enc.decdb(function(err){
             if(err){return cb(err)};
             ss.set('isLoggedIn', true);
             ss.del('cipher');
             console.log('data decrypted, routing...');
             router.rout('/home', xdata.home);
          })
        } else {

          doc.login.prior.unshift(Date.now())
          doc.login.prior.pop()
          doc.user = obj.user;
          ss.set('user', obj.user);
          pouch.put(doc, function(err, response) {
            if (err) {return cb(err);}
            pouch.compact(function (err, result) {
              if (err) { return cb(err); }
              ss.set('isLoggedIn', true);
              console.log('New data store loading...');
              router.rout('/home', xdata.home);
              cb(false);
            });
          })

        }


      }
    })
  },
  checkDb(cb){


    pouch.get('store', function(err, doc) {
      let ele = document.getElementById('dbCheck')
      if (err) {
        console.log('no db found, creating...');
        setTimeout(function(){
          ele.textContent = 'Creating new DB'
          document.getElementById('su').classList.remove('hidden');
          document.getElementById('sc').classList.remove('hidden');
          ss.set('firstrun', 1);
        },1500)
        db.addIndex(xdata.schema, function(err,res){
          if(err){
            console.log(err);
            cb(err);
          } else {
            console.log('db created.');
            pouch.get('store', function(err, doc) {
              if (err) {
                console.log(err)
                cb(err);
              } else{
                setTimeout(function(){
                  ele.textContent = 'DB loaded';
                  ele.classList.add('txt-lime');
                  setTimeout(function(){
                    ele.classList.remove('txt-lime');
                  },1000)
                },2500)
                console.log('db found, loading...');

                cb(false, doc);
              }
            })
          }
        })
      } else {

        if(!doc.ctext){
          document.getElementById('su').classList.remove('hidden');
          document.getElementById('sc').classList.remove('hidden');
          ss.set('firstrun', 1);
        } else {
          console.log('db found, loading...');
          ss.set('firstrun', 0)
        }
        setTimeout(function(){
          ele.textContent = 'DB loaded';
          ele.classList.add('txt-lime');
          setTimeout(function(){
            ele.classList.remove('txt-lime');
          },1000)
        },2000)
        cb(false, doc);

      }
    });

  },
  addIndex(obj, cb) {

    let dtime = Date.now(),
    item = {
      _id: 'store',
      title: 'encData',
      salt: enc.saltList(),
      user: '',
      login: {
        prior: [0, 0],
        failed: 0
      },
      logout: {
        enabled: true,
        mins: 60
      },
      attempts: {
        enabled: true,
        limit: 1,
        duration: 5
      },
      destruct: {
        enabled: false,
        limit: 10
      },
      reset: {
        enabled: true,
        limit: 1,
        pin: false
      },
      ctext: false,
      ptext: obj,
      created: dtime,
      updated: dtime,
      appkey: {
        id: false,
        premium: false,
        sync: false,
        server: false
      },
      completed: false
    };

    pouch.put(item, function(err, res) {
      if(err){
        console.log(err);
        return cb(err);
      }
      cb(false, res)
    });

  },
  updateIndex(obj, cb) {

    pouch.get('store', function(err, doc) {
      if (err) {
        console.log(err)
        cb(true);
      } else{

        doc.updated = Date.now();

        let secrets = obj.salt;
        obj.salt = enc.pbkdf2(secret, obj.salt)



        pouch.put(doc, function(err, response) {
          if (err) { return console.log(err); }

          pouch.compact(function (err, result) {
            if (err) { return console.log(err); }
            cb(false, doc);
          });

        })

      }
    })

  },
  deleteIndex(obj, cb) {

  },
  fetch(cb){
    pouch.get('store', function(err, doc) {
      if (err) {
        cb(err)
      } else {
        cb(false, doc)
      }
    })
  },
  addobj(sect, obj, cb){

    pouch.get('store', function(err, doc) {
      if (err) {
        cb(err)
      } else {

        try {

          let detail = enc.tpmGet(),
          newsalt = enc.saltGen(),
          newkey = enc.pbkdf2(detail.keys, newsalt),
          cipher = detail.cipher;

          doc.updated = Date.now();

          if(!doc.ptext[sect] || !Array.isArray(doc.ptext[sect])){
            doc.ptext[sect] = [];
          }

          doc.ptext[sect].unshift(obj);

          if(!newkey){
            return cb('pbkdf2 failed')
          }

          doc.ctext = xcrypt.enc(js(doc.ptext), newkey, detail.cipher, 'hex');
          doc.salt = newsalt;

        } catch (e) {
          return cb(e)
        }


        pouch.put(doc, function(err, response) {
          if (err) {return cb(err);}

          pouch.compact(function (err, result) {
            if (err) { return cb(err); }

            cb(false, doc);
          });

        })

      }
    })

  },
  delobj(sect, obj, cb){

    pouch.get('store', function(err, doc) {
      if (err) {
        cb(err)
      } else {

        doc.updated = Date.now();

        doc.ptext[sect] = doc.ptext[sect].filter(function(item){
          return item.id !== obj.id
        });

        pouch.put(doc, function(err, response) {
          if (err) {return cb(err);}

          pouch.compact(function (err, result) {
            if (err) { return cb(err); }

            cb(false, doc);
          });

        })

      }
    })

  },
  restore(obj, cb){

    pouch.get('store', function(err, doc) {
      if (err) {
        cb(err)
      } else {

        doc.updated = Date.now();
        doc.ptext = obj;

        pouch.put(doc, function(err, response) {
          if (err) {return cb(err);}
          pouch.compact(function (err, result) {
            if (err) { return cb(err); }

            cb(false);
          });
        })
      }
    })

  },

  addattempt(cb){

    pouch.get('store', function(err, doc) {
      if (err) {
        cb(err)
      } else {
        if(typeof doc.login.failed !== 'number'){
          doc.login.failed = 0;
        }
        doc.login.failed++
        pouch.put(doc, function(err, response) {
          if (err) {return cb(err);}
          pouch.compact(function (err, result) {
            if (err) { return cb(err); }
            cb(false);
          });
        })
      }
    })

  },
  addlogin(){

  },
  destroy(cb){
    pouch.destroy(function (err, res) {
      if (err) {
        cb(err);
      } else {
        cb(false, res)
      }
    });
  }
}

Object.freeze(db)

export { enc, db }
