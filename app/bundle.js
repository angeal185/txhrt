(function (exports) {
  'use strict';

  if (navigator.storage && navigator.storage.persist){
    navigator.storage.persist()
    .then(function(persistent) {
      if (persistent){
        console.log("Storage will not be cleared except by explicit user action");
      } else {
        console.log("Storage may be cleared by the UA under storage pressure.");
      }

    });
  }


  const globals = {
    init(){
      window.LS = window.localStorage;
      window.SS = window.sessionStorage;
      window.jp = JSON.parse;
      window.js = JSON.stringify;
      window.isloaded = {
        js:0
      };

      return this;
    },
    listeners(){

      window.addEventListener('infotab', function (e) {
        let data = e.detail,
        ele = document.getElementById('infotab');
        ele.firstChild.textContent = data.msg;
        ele.classList.add('show');
        setTimeout(function(){
          ele.classList.remove('show');
          setTimeout(function(){
            ele.firstChild.textContent = '';
          },500);
        },3000);
      }, false);

      return this;
    },
    events(){


      window.evt = {
        infotab(e){
          let j = new CustomEvent('infotab', {detail: e});
          window.dispatchEvent(j);

        }

      };

    }
  };

  // clone dom object cache

  let cobj = {
    txt: document.createTextNode('')
  };

  const xu = {
    ctxt(l){
      let t = cobj.txt.cloneNode(false);
      t.textContent = l;
      return t;
    },
    isnd(i) {
      return i && i.nodeName && i.nodeType
    }
  };

  function xrender(stre, xpath, data, xdata, cb){
    try {
      if(typeof data === 'object'){
        data = Object.assign({}, xdata, data);
      } else {
        cb = data;
        data = xdata;
      }
      stre.empty().append(xpath(stre, data));
      if(cb){cb(false);}
    } catch (err) {
      if(cb){cb(err);}
    }
  }

  function xfn(e, i) {
    let t = typeof i;
    if (t == 'string') {
      if(!e){
        if(!cobj[i]){
          cobj[i] = document.createElement(i);
        }
        e = cobj[i].cloneNode(false);
      } else {
        e.appendChild(xu.ctxt(i));
      }
    } else if(xu.isnd(i)) {
      e.appendChild(i);
    } else if(t == 'object') {
      let k = Object.keys(i), f;
      for (t = 0; t < k.length; t++){
        f = k[t];
        if(typeof i[f] == 'function') {
          e[f] = i[f];
        } else {
          e.setAttribute(k[t], i[f]);
        }
      }

    } else if(t == 'function') {
      t = i();
      e.appendChild(xu.isnd(t) ? t : xu.ctxt(t));
    } else if(t == 'number' || t == 'boolean') {
      e.appendChild(xu.ctxt(i.toString()));
    }
    return e;
  }

  function x(){
    let arr = [...arguments],
    i = null;
    while (arr.length) {
      i = xfn(i, arr.shift());
    }
    return i;
  }

  const xdata = {
    default:{
      version: '1.0.0',
      title: 'xcrypt-organizer',
      origin: 'http://localhost:8000',
      params: true,
      error: '/error',
      base_path: '/vault',
      delete_meta: 10000,
      webmanifest: './manifest.webmanifest',
      base_script_name: 'main',
      styles:[{
        href: './app/css/ico.css',
        rel: 'stylesheet'
      },{
        href: './app/css/bootstrap.css',
        rel: 'stylesheet'
      },{
        href: './app/css/main.css',
        rel: 'stylesheet'
      }],
      js_head:[],
      js_body:[],
      storage: {
        max_age: 9999999999,
        prefix: 'rt'
      },
      stream: {
        download: {
          type: 'text/plain',
          charset: 'utf-8'
        },
        fetch: {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      }
    },
    cipher: {
      order: ['AES', 'SERPENT', 'TWOFISH']
    },
    schema: {
      birthdays: [],
      business: [],
      bills: [],
      contacts: [],
      diary: [],
      emails: [],
      events: [],
      locations: [],
      notes: [],
      passwords: [],
      schedule: [],
      shopping: [],
      todos: []
    },
    nav: [
      'birthdays', 'business', 'bills', 'contacts', 'diary', 'emails', 'events', 'locations',
      'notes', 'passwords', 'schedule', 'shopping', 'todos'
    ],
    mainmenu: [
      ['home', '/home'],
      ['birthdays', '/birthdays'],
      ['business', '/business'],
      ['bills', '/bills'],
      ['contacts', '/contacts'],
      ['diary', '/diary'],
      ['emails', '/emails'],
      ['events', '/events'],
      ['locations', '/locations'],
      ['notes', '/notes'],
      ['passwords', '/passwords'],
      ['schedule', '/schedule'],
      ['shopping', '/shopping'],
      ['todos', '/todos'],
      ['settings', '/settings'],
      ['about','/about']
    ],
    vault: {
      msg: 'vault page'
    },
    home: {
      msg: 'home page'
    },
    about: {
      msg: 'about page'
    },
    settings: {
      msg: 'settings page'
    },
    birthdays: {
      msg: 'birthdays page'
    },
    business: {
      msg: 'business page'
    },
    bills: {
      msg: 'bills page'
    },
    contacts: {
      msg: 'contacts page'
    },
    diary: {
      msg: 'diary page'
    },
    emails: {
      msg: 'emails page'
    },
    events: {
      msg: 'events page'
    },
    locations: {
      msg: 'locations page'
    },
    notes: {
      msg: 'notes page'
    },
    passwords: {
      msg: 'passwords page'
    },
    schedule: {
      msg: 'schedule page'
    },
    shopping: {
      msg: 'shopping page'
    },
    todos: {
      msg: 'todos page'
    }
  };

  const utils = {
    menu(){
      document.getElementById('mainmenu').classList.toggle('isOpen');
    },
    isLoggedIn(router, xdata){
      let response = JSON.parse(window.sessionStorage.getItem('isLoggedIn'));
      if (typeof response !== 'boolean' || response !== true){
        router.rout('/vault', xdata.vault);
        return false
      } else {
        return true;
      }
    },
    validateInput(i,e){
      if(i.value.length < e){
        i.classList.add('.is-invalid');
        i.classList.remove('.is-valid');
      } else {
        i.classList.remove('.is-invalid');
        i.classList.add('.is-valid');
      }
    },
    ts2date(ts){

      let date = new Date(ts);

      return  date.getDate()+
            "/"+(date.getMonth()+1)+
            "/"+date.getFullYear()+
            " "+date.getHours()+
            ":"+date.getMinutes()+
            ":"+date.getSeconds();
    },
    sortAlpha(i, e){
      return i.sort(function(a, b){
        return a[e].localeCompare(b[e])
      })
    },
    keyupval(arr){
      for (var i = 0; i < arr.length; i++) {
        document.getElementById(arr[i]).keyup();
      }
    },
    empty(div){
      while(div.firstChild){
          div.removeChild(div.firstChild);
      }
    },
    filterByValue(array, string) {
      return array.filter(function(o){
          return Object.keys(o).some(function(k){
            return o[k].toLowerCase().includes(string.toLowerCase());
          })
      })
    }
  };

  const tpl = {
    infotab(){

      let ele = x('div', {id: 'infotab',class: 'd-flex'},
        x('span')
      );

      return ele;
    },
    infopane(){

      let ele = x('div', {
          class: 'offcanvas offcanvas-start show',
          tabindex: '-1'
        },
        x('div', {class: 'offcanvas-header'},
          x('h5', {class: 'offcanvas-title'}, 'Info'),
          x('button', {
            type: 'button',
            class: 'btn-close',
            onclick(){
              this.parentNode.parentNode.classList.toggle('show', 'hide');
            }

          })
        ),
        x('div', {id: 'infopane', class: 'offcanvas-body'})
      );

      return ele;
    },
    navbar(xdata, router){

      let ele = x('nav', {id: 'navmain', class: 'navbar text-bg-dark'},
        x('div', {class: 'container-fluid justify-content-center'},
          x('div', {class: 'row'},
            x('div', {class: 'col-2'},

                x('span', {
                  id: 'navbtn',
                  class: 'material-icons',
                  onclick(){
                    utils.menu();
                  }
                }, 'menu')

            ),
            x('div', {class: 'col-8'},
              x('h5', {id: 'navtext'}, xdata.default.title)
            ),
            x('div', {class: 'col-2'},
              x('span', {
                id: 'lockbtn',
                class: 'material-icons',
                onclick(){
                  router.rout('/vault', xdata.vault);
                }
              }, 'lock')
            )
          )
        )
      );

      return ele;

    },
    mainmenu(xdata, router, ls){

      let list = x('div', {id: 'menulist'}),
      ele = x('div', {id: 'mainmenu'},
        x('nav', {id: 'navmain', class: 'navbar text-bg-dark'},
          x('div', {class: 'container-fluid justify-content-end'},
            x('span', {
              class: 'backico material-icons',
              onclick(){
                utils.menu();
              }
            }, 'arrow_back')
          )
        )
      ),
      arr = ls.get('nav') || [],
      current;

      for (let i = 0; i < xdata.mainmenu.length; i++) {

          current = x('div', {
              class: 'menuitem',
              id: 'lnk-'+ xdata.mainmenu[i][0],
              onclick(){
                utils.menu();
                router.rout(xdata.mainmenu[i][1], xdata[xdata.mainmenu[i][0]]);
              }
            },
            x('span', {class: 'menutxt'}, xdata.mainmenu[i][0]),
            x('span', {class: 'menuico material-icons'}, 'chevron_right')
          );

          if(arr.indexOf(xdata.mainmenu[i][0]) !== -1){
            current.classList.add('hidden');
          }

          list.append(current);
      }

      ele.append(list);
      return ele;
    },
    appmain(app_main){

      let ele = x('main-view',
      x('div', {
          class: 'container'
        }, app_main)
      );

      return ele;
    },
    selgroup(){

      let ele = x('div', {class: 'container mt-4 mb-4'},
        x('div', {class: 'btn-group w-100', role: 'group'},
          x('button', {
            type: 'button',
            class: 'btn btn-outline-dark',
            onclick(){
              document.getElementById('listdiv').classList.add('hidden');
              document.getElementById('searchdiv').classList.add('hidden');
              document.getElementById('creatediv').classList.remove('hidden');
            }
          }, 'Create'),
          x('button', {
            type: 'button',
            class: 'btn btn-outline-dark',
            onclick(){
              document.getElementById('creatediv').classList.add('hidden');
              document.getElementById('searchdiv').classList.add('hidden');
              document.getElementById('listdiv').classList.remove('hidden');
            }
          }, 'List'),
          x('button', {
            type: 'button',
            class: 'btn btn-outline-dark',
            onclick(){
              document.getElementById('creatediv').classList.add('hidden');
              document.getElementById('listdiv').classList.add('hidden');
              document.getElementById('searchdiv').classList.remove('hidden');
            }
          }, 'Search')
        )
      );

      return ele;

    },
    search(db, arr){
      let results = x('div', {id:'searchresults'}),
      errtxt = x('div', {id: 'searcherr'}),
      ele = x('div', {class: 'mt-4 mb-4'},
        x('div', {class: 'input-group mb-3'},
          x('input', {type: 'text', class: 'form-control', placeholder: ['search', arr[0], 'by', arr[1]].join(' ')}),
          x('button', {
            type: 'button',
            class: 'btn btn-outline-dark',
            onclick(){
              let $this = this,
              val = $this.previousSibling.value;

              utils.empty(errtxt);
              utils.empty(results);

              if(val.length){

                db.get(function(err,doc){
                  if(err){return console.log(err)}

                  let eles = doc.ptext[arr[0]] || [],
                  arr2 = [];

                  for (let i = 0; i < eles.length; i++) {
                    if(eles[i][arr[1]].includes(val)){
                      arr2.push(eles[i]);
                    }
                  }

                  if(arr2.length){
                    for (var i = 0; i < arr2.length; i++) {
                      results.append(
                        tpl[arr[2]](arr2[i], db, false, true)
                      );
                    }
                  } else {
                    errtxt.textContent = 'Search returned 0 results.';
                  }
                });

              } else {
                errtxt.textContent = 'Invalid search length.';
              }
              console.log($this.previousSibling.value);
            }
          }, 'Search')
        ),
        errtxt,
        results
      );

      return ele;
    },
    birthdayitem(eles, db, isNew, delbtn){

      let ele = x('div', {
          class: 'card mt-4 mb-4'
        },
        x('div', {class: 'card-body'},
          x('label', {class: 'form-label'}, 'Name'),
          function(){
            if(isNew){
              return x('span', {class: 'badge text-bg-success f-r'}, 'New')
            }
          },
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.name,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Birthday'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.birthday,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Relation'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.relation,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Notes'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.notes,
            disabled: 'disabled'
          }),
          function(){
            if(!delbtn){
              return x('button', {
                class: 'btn btn-outline-danger btn-sm mt-2 f-r',
                type: 'button',
                onclick(){
                  let $this = this;
                  db.delobj('birthdays', eles, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }
                    $this.parentNode.parentNode.remove();
                  });
                },
              }, 'Delete')
            }
          }
        )
      );

      if(!delbtn){
        ele.id = eles.id;
      }

      return ele;
    },
    businessitem(eles, db, isNew, delbtn){

      let ele = x('div', {
          class: 'card mt-4 mb-4'
        },
        x('div', {class: 'card-body'},
          x('label', {class: 'form-label'}, 'Name'),
          function(){
            if(isNew){
              return x('span', {class: 'badge text-bg-success f-r'}, 'New')
            }
          },
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.name,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Phone'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.phone,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Mobile'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.mobile,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Email'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.email,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'URL'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.url,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Address'),
          x('textarea', {
            class:'form-control mb-2',
            type: 'text',
            rows: '5',
            disabled: 'disabled'
          }, eles.address),
          x('label', {class: 'form-label'}, 'Notes'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.notes,
            disabled: 'disabled'
          }),
          function(){
            if(!delbtn){
              return x('button', {
                class: 'btn btn-outline-danger btn-sm mt-2 f-r',
                type: 'button',
                onclick(){
                  let $this = this;
                  db.delobj('business', eles, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }
                    $this.parentNode.parentNode.remove();
                  });
                },
              }, 'Delete')
            }
          }
        )
      );

      if(!delbtn){
        ele.id = eles.id;
      }

      return ele;
    },
    billsitem(eles, db, isNew, delbtn){

      let ele = x('div', {
          class: 'card mt-4 mb-4'
        },
        x('div', {class: 'card-body'},
          x('label', {class: 'form-label'}, 'Title'),
          function(){
            if(isNew){
              return x('span', {class: 'badge text-bg-success f-r'}, 'New')
            }
          },
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.title,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Company'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.company,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Location'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.location,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Price'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.price,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Date'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.date,
            disabled: 'disabled'
          }),

          x('label', {class: 'form-label'}, 'Notes'),
          x('textarea', {
            class:'form-control mb-2',
            type: 'text',
            rows: '5',
            disabled: 'disabled'
          }, eles.notes),
          function(){
            if(!delbtn){
              return x('button', {
                class: 'btn btn-outline-danger btn-sm mt-2 f-r',
                type: 'button',
                onclick(){
                  let $this = this;
                  db.delobj('bills', eles, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }
                    $this.parentNode.parentNode.remove();
                  });
                },
              }, 'Delete')
            }
          }
        )
      );

      if(!delbtn){
        ele.id = eles.id;
      }

      return ele;
    },
    contactitem(eles, db, isNew, delbtn){

      let ele = x('div', {
          class: 'card mt-4 mb-4'
        },
        x('div', {class: 'card-body'},
          x('label', {class: 'form-label'}, 'Name'),
          function(){
            if(isNew){
              return x('span', {class: 'badge text-bg-success f-r'}, 'New')
            }
          },
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.name,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Relation'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.relation,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Phone'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.phone,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Mobile'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.mobile,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Email'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.email,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'URL'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.url,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Address'),
          x('textarea', {
            class:'form-control mb-2',
            type: 'text',
            rows: '5',
            disabled: 'disabled'
          }, eles.address),
          x('label', {class: 'form-label'}, 'Notes'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.notes,
            disabled: 'disabled'
          }),
          function(){
            if(!delbtn){
              return x('button', {
                class: 'btn btn-outline-danger btn-sm mt-2 f-r',
                type: 'button',
                onclick(){
                  let $this = this;
                  db.delobj('contacts', eles, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }
                    $this.parentNode.parentNode.remove();
                  });
                },
              }, 'Delete')
            }
          }
        )
      );

      if(!delbtn){
        ele.id = eles.id;
      }

      return ele;
    },
    emailitem(eles, db, isNew, delbtn){

      let ele = x('div', {
          class: 'card mt-4 mb-4'
        },
        x('div', {class: 'card-body'},
          x('label', {class: 'form-label'}, 'Title'),
          function(){
            if(isNew){
              return x('span', {class: 'badge text-bg-success f-r'}, 'New')
            }
          },
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.title,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Email'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.email,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Notes'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.notes,
            disabled: 'disabled'
          }),
          function(){
            if(!delbtn){
              return x('button', {
                class: 'btn btn-outline-danger btn-sm mt-2 f-r',
                type: 'button',
                onclick(){
                  let $this = this;
                  db.delobj('emails', eles, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }
                    $this.parentNode.parentNode.remove();
                  });
                },
              }, 'Delete')
            }
          }
        )
      );

      if(!delbtn){
        ele.id = eles.id;
      }

      return ele;
    },
    locationitem(eles, db, isNew, delbtn){

      let ele = x('div', {
          class: 'card mt-4 mb-4'
        },
        x('div', {class: 'card-body'},
          x('label', {class: 'form-label'}, 'Title'),
          function(){
            if(isNew){
              return x('span', {class: 'badge text-bg-success f-r'}, 'New')
            }
          },
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.title,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Address'),
          x('textarea', {
            class:'form-control mb-2',
            type: 'text',
            rows: '5',
            disabled: 'disabled'
          }, eles.address),
          x('label', {class: 'form-label'}, 'Notes'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.notes,
            disabled: 'disabled'
          }),
          function(){
            if(!delbtn){
              return x('button', {
                class: 'btn btn-outline-danger btn-sm mt-2 f-r',
                type: 'button',
                onclick(){
                  let $this = this;
                  db.delobj('locations', eles, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }
                    $this.parentNode.parentNode.remove();
                  });
                },
              }, 'Delete')
            }
          }
        )
      );

      if(!delbtn){
        ele.id = eles.id;
      }

      return ele;
    },
    passworditem(eles, db, isNew, delbtn){

      let ele = x('div', {
          class: 'card mt-4 mb-4'
        },
        x('div', {class: 'card-body'},
          x('label', {class: 'form-label'}, 'Title'),
          function(){
            if(isNew){
              return x('span', {class: 'badge text-bg-success f-r'}, 'New')
            }
          },
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.title,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Username'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.username,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Password'),
          x('div', {class: 'input-group mb-2'},
            x('input', {
              class:'form-control',
              type: 'password',
              value: eles.password,
              disabled: 'disabled'
            }),
            x('span', {class: 'input-group-text cp'},
              x('span', {
                class: 'material-icons',
                onclick(){
                  let dest = this.parentNode.previousSibling;

                  if (dest.type === "password") {
                    dest.type = "text";
                  } else {
                    dest.type = "password";
                  }
                }
              }, 'visibility')
            )
          ),
          x('label', {class: 'form-label'}, 'Pin'),
          x('div', {class: 'input-group mb-2'},
            x('input', {
              class:'form-control',
              type: 'password',
              value: eles.pin,
              disabled: 'disabled'
            }),
            x('span', {class: 'input-group-text cp'},
              x('span', {
                class: 'material-icons',
                onclick(){
                  let dest = this.parentNode.previousSibling;

                  if (dest.type === "password") {
                    dest.type = "text";
                  } else {
                    dest.type = "password";
                  }
                }
              }, 'visibility')
            )
          ),
          x('label', {class: 'form-label'}, 'URL'),
          x('input', {
            class:'form-control',
            type: 'text',
            value: eles.url,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Notes'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.notes,
            disabled: 'disabled'
          }),
          function(){
            if(!delbtn){
              return x('button', {
                class: 'btn btn-outline-danger btn-sm mt-2 f-r',
                type: 'button',
                onclick(){
                  let $this = this;
                  db.delobj('passwords', eles, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }
                    $this.parentNode.parentNode.remove();
                  });
                },
              }, 'Delete')
            }
          }
        )
      );

      if(!delbtn){
        ele.id = eles.id;
      }

      return ele;
    },
    diaryitem(eles, db, isNew, delbtn){

      let ele = x('div', {
          class: 'card mt-4 mb-4'
        },
        x('div', {class: 'card-body'},
          x('label', {class: 'form-label'}, 'Title'),
          function(){
            if(isNew){
              return x('span', {class: 'badge text-bg-success f-r'}, 'New')
            }
          },
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.title,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Date (D/M/Y)'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: utils.ts2date(eles.id),
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Entry'),
          x('textarea', {
            rows:'5',
            class:'form-control mb-2',
            disabled: 'disabled'
          }, eles.entry),
          function(){
            if(!delbtn){
              return x('button', {
                class: 'btn btn-outline-danger btn-sm mt-2 f-r',
                type: 'button',
                onclick(){
                  let $this = this;
                  db.delobj('diary', eles, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }
                    $this.parentNode.parentNode.remove();
                  });
                },
              }, 'Delete')
            }
          }
        )
      );

      if(!delbtn){
        ele.id = eles.id;
      }

      return ele;
    },
    notesitem(eles, db, isNew, delbtn){

      let ele = x('div', {
          class: 'card mt-4 mb-4'
        },
        x('div', {class: 'card-body'},
          x('label', {class: 'form-label'}, 'Title'),
          function(){
            if(isNew){
              return x('span', {class: 'badge text-bg-success f-r'}, 'New')
            }
          },
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.title,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Date (D/M/Y)'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: utils.ts2date(eles.id),
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Topic'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.topic,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Notes'),
          x('textarea', {
            rows:'5',
            class:'form-control mb-2',
            disabled: 'disabled'
          }, eles.notes),
          function(){
            if(!delbtn){
              return x('button', {
                class: 'btn btn-outline-danger btn-sm mt-2 f-r',
                type: 'button',
                onclick(){
                  let $this = this;
                  db.delobj('notes', eles, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }
                    $this.parentNode.parentNode.remove();
                  });
                },
              }, 'Delete')
            }
          }
        )
      );

      if(!delbtn){
        ele.id = eles.id;
      }

      return ele;
    },
    todoitem(eles, db, isNew, delbtn){

      let ele = x('div', {
          class: 'card mt-4 mb-4'
        },
        x('div', {class: 'card-body'},
          x('label', {class: 'form-label'}, 'Title'),
          function(){
            if(isNew){
              return x('span', {class: 'badge text-bg-success f-r'}, 'New')
            }
          },
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.title,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Topic'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.topic,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Date created (D/M/Y)'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: utils.ts2date(eles.id),
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Date due'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.date,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Todo'),
          x('textarea', {
            rows:'5',
            class:'form-control mb-2',
            disabled: 'disabled'
          }, eles.todo),
          function(){
            if(!delbtn){
              return x('button', {
                class: 'btn btn-outline-danger btn-sm mt-2 f-r',
                type: 'button',
                onclick(){
                  let $this = this;
                  db.delobj('todos', eles, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }
                    $this.parentNode.parentNode.remove();
                  });
                },
              }, 'Delete')
            }
          }
        )
      );

      if(!delbtn){
        ele.id = eles.id;
      }

      return ele;
    },
    eventitem(eles, db, isNew, delbtn){

      let ele = x('div', {
          class: 'card mt-4 mb-4'
        },
        x('div', {class: 'card-body'},
          x('label', {class: 'form-label'}, 'Title'),
          function(){
            if(isNew){
              return x('span', {class: 'badge text-bg-success f-r'}, 'New')
            }
          },
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.title,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Date'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.date,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Time'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.time,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Duration'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.duration,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'People'),
          x('textarea', {
            rows:'5',
            class:'form-control mb-2',
            disabled: 'disabled'
          }, eles.people),
          x('label', {class: 'form-label'}, 'Location'),
          x('textarea', {
            rows:'5',
            class:'form-control mb-2',
            disabled: 'disabled'
          }, eles.location),
          x('label', {class: 'form-label'}, 'Requirements'),
          x('textarea', {
            rows:'5',
            class:'form-control mb-2',
            disabled: 'disabled'
          }, eles.requirements),
          x('label', {class: 'form-label'}, 'Notes'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.notes,
            disabled: 'disabled'
          }),
          function(){
            if(!delbtn){
              return x('button', {
                class: 'btn btn-outline-danger btn-sm mt-2 f-r',
                type: 'button',
                onclick(){
                  let $this = this;
                  db.delobj('events', eles, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }
                    $this.parentNode.parentNode.remove();
                  });
                },
              }, 'Delete')
            }
          }
        )
      );

      if(!delbtn){
        ele.id = eles.id;
      }

      return ele;
    },
    scheduleitem(eles, db, isNew, delbtn){

      let ele = x('div', {
          class: 'card mt-4 mb-4'
        },
        x('div', {class: 'card-body'},
          x('label', {class: 'form-label'}, 'Title'),
          function(){
            if(isNew){
              return x('span', {class: 'badge text-bg-success f-r'}, 'New')
            }
          },
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.title,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Category'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.category,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Date'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.date,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Time'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.time,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Duration'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.duration,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Contact'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.contact,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Location'),
          x('textarea', {
            rows:'5',
            class:'form-control mb-2',
            disabled: 'disabled'
          }, eles.location),
          x('label', {class: 'form-label'}, 'Notes'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.notes,
            disabled: 'disabled'
          }),
          function(){
            if(!delbtn){
              return x('button', {
                class: 'btn btn-outline-danger btn-sm mt-2 f-r',
                type: 'button',
                onclick(){
                  let $this = this;
                  db.delobj('schedule', eles, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }
                    $this.parentNode.parentNode.remove();
                  });
                },
              }, 'Delete')
            }
          }
        )
      );

      if(!delbtn){
        ele.id = eles.id;
      }

      return ele;
    },
    shoppingitem(eles, db, isNew, delbtn){

      let ele = x('div', {
          class: 'card mt-4 mb-4'
        },
        x('div', {class: 'card-body'},
          x('label', {class: 'form-label'}, 'Item'),
          function(){
            if(isNew){
              return x('span', {class: 'badge text-bg-success f-r'}, 'New')
            }
          },
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.item,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Category'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.category,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Location'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.location,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Price'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.price,
            disabled: 'disabled'
          }),
          x('label', {class: 'form-label'}, 'Quantity'),
          x('input', {
            class:'form-control mb-2',
            type: 'text',
            value: eles.quantity,
            disabled: 'disabled'
          }),

          x('label', {class: 'form-label'}, 'Notes'),
          x('textarea', {
            class:'form-control mb-2',
            type: 'text',
            rows: '5',
            disabled: 'disabled'
          }, eles.notes),
          function(){
            if(!delbtn){
              return x('button', {
                class: 'btn btn-outline-danger btn-sm mt-2 f-r',
                type: 'button',
                onclick(){
                  let $this = this;
                  db.delobj('shopping', eles, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }
                    $this.parentNode.parentNode.remove();
                  });
                },
              }, 'Delete')
            }
          }
        )
      );

      if(!delbtn){
        ele.id = eles.id;
      }

      return ele;
    },

    navswitch(ls, i, e){

      let ele = x('div', {class: 'form-check form-switch mb-3'},
        x('input', {
            type: 'checkbox',
            class:'form-check-input',
            role: 'switch',
            onchange(){
              let arr = ls.get('nav') || [];

              if(this.checked){

                arr.push(i);
                document.getElementById('lnk-'+ i).classList.add('hidden');
                ls.set('nav', arr);
              } else {
                console.log('off');
                arr = arr.filter(function(word){
                  return word !== i
                });
                document.getElementById('lnk-'+ i).classList.remove('hidden');
                ls.set('nav', arr);
              }

            }
        }),
        x('label', {class: 'form-check-label'}, i)
      );

      if(e.indexOf(i) !== -1){
        ele.firstChild.setAttribute('checked', true);
      }

      return ele;
    }
  };

  function XCRYPT(){
    const utils = {
      i2a: [
          'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
          'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
          'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
          'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
          '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'
      ],
      a2i: [
          -1,   -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, -1,
          -1,   -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1, -1,
          -1,   -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  -1,  62,  -1,  -1,  -1, 63,
          52,   53,  54,  55,  56,  57,  58,  59,  60,  61,  -1,  -1,  -1,  -1,  -1, -1,
          -1,    0,   1,   2,   3,   4,   5,   6,   7,   8,   9,  10,  11,  12,  13, 14,
          15,   16,  17,  18,  19,  20,  21,  22,  23,  24,  25,  -1,  -1,  -1,  -1, -1,
          -1,   26,  27,  28,  29,  30,  31,  32,  33,  34,  35,  36,  37,  38,  39, 40,
          41,   42,  43,  44,  45,  46,  47,  48,  49,  50,  51
      ],
      amap: {
        '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
        '6': 6,'7': 7, '8': 8, '9': 9, 'A': 10, 'B': 11,
        'C': 12,'D': 13, 'E': 14, 'F': 15, 'a': 10, 'b': 11,
        'c': 12, 'd': 13, 'e': 14,'f': 15
      },
      hex: function(i) {
        if (i == null)
          return "??";
        i &= 0xff;
        var result = i.toString(16);
        return (result.length < 2) ? "0" + result : result;
      },
      hex_encode: function(data, columns, delim) {
        if (delim == null) {
          delim = "";
        }
        if (columns == null) {
          columns = 256;
        }
        var result = "";
        for (var i = 0; i < data.length; i++) {
          if ((i % columns == 0) && (0 < i))
            result += "\n";
          result += utils.hex(data[i]) + delim;
        }
        return result.toUpperCase();
      },
      get_amap: function(c) {
        var cc = utils.amap[c];
        //trace(c + "=>" + cc );
        if (cc == null)
          throw "found an invalid character.";
        return cc;
      },
      hex_decode: function(data) {
        var ca = [];
        for (var i = 0, j = 0; i < data.length; i++) {
          var c = data.charAt(i);
          if (c == "\s") {
            continue;
          } else {
            ca[j++] = c;
          }
        }
        if (ca.length % 2 != 0) {
          throw "data must be a multiple of two.";
        }

        var result = new Array(ca.length >> 1);
        for (var i = 0; i < ca.length; i += 2) {
          var v = 0xff & ((utils.get_amap(ca[i]) << 4) | (utils.get_amap(ca[i + 1])));
          result[i >> 1] = v;
        }
        return result;
      },
      base64_encode: function(s) {
          var length = s.length;
          var groupCount = Math.floor( length / 3 );
          var remaining = length - 3 * groupCount;
          var result = "";

          var idx = 0;
          for (var i=0; i<groupCount; i++) {
          	var b0 = s[idx++] & 0xff;
          	var b1 = s[idx++] & 0xff;
          	var b2 = s[idx++] & 0xff;
          	result += (utils.i2a[ b0 >> 2]);
          	result += (utils.i2a[(b0 << 4) &0x3f | (b1 >> 4)]);
          	result += (utils.i2a[(b1 << 2) &0x3f | (b2 >> 6)]);
          	result += (utils.i2a[ b2 & 0x3f]);
          }

          if ( remaining == 0 ) ; else if ( remaining == 1 ) {
          	var b0 = s[idx++] & 0xff;
          	result += ( utils.i2a[ b0 >> 2 ] );
          	result += ( utils.i2a[ (b0 << 4) & 0x3f] );
          	result += ( "==" );
          } else if ( remaining == 2 ) {
          	var b0 = s[idx++] & 0xff;
          	var b1 = s[idx++] & 0xff;
          	result += ( utils.i2a[ b0 >> 2 ] );
          	result += ( utils.i2a[(b0 << 4) & 0x3f | (b1 >> 4)]);
          	result += ( utils.i2a[(b1 << 2) & 0x3f ] );
          	result += ('=');
          } else {
      	     throw "never happen";
          }
          return result;
      },
      base64_decode: function(s){
        var length = s.length;
        var groupCount = Math.floor( length/4 );
        if ( 4 * groupCount != length ){
          throw "String length must be a multiple of four.";
        }

        var missing = 0;
        if (length != 0) {
        	if ( s.charAt( length - 1 ) == '=' ) {
        	    missing++;
        	    groupCount--;
        	}
        	if ( s.charAt( length - 2 ) == '=' ){
             missing++;
          }
        }

        var len = ( 3 * groupCount - missing );
        if ( len < 0 ) {
    	     len=0;
        }
        var result = new Array( len );
        var idx_in = 0;
        var idx_out = 0;
        for ( var i=0; i<groupCount; i++ ) {
        	var c0 = utils.get_a2i( s.charCodeAt( idx_in++ ) );
        	var c1 = utils.get_a2i( s.charCodeAt( idx_in++ ) );
        	var c2 = utils.get_a2i( s.charCodeAt( idx_in++ ) );
        	var c3 = utils.get_a2i( s.charCodeAt( idx_in++ ) );
        	result[ idx_out++ ] = 0xFF & ( (c0 << 2) | (c1 >> 4) );
        	result[ idx_out++ ] = 0xFF & ( (c1 << 4) | (c2 >> 2) );
        	result[ idx_out++ ] = 0xFF & ( (c2 << 6) | c3 );
        }

        if ( missing == 0 ) ; else if ( missing == 1 ) {
        	var c0 = utils.get_a2i( s.charCodeAt( idx_in++ ) );
        	var c1 = utils.get_a2i( s.charCodeAt( idx_in++ ) );
        	var c2 = utils.get_a2i( s.charCodeAt( idx_in++ ) );
        	result[ idx_out++ ] = 0xFF & ( (c0 << 2) | (c1 >> 4) );
        	result[ idx_out++ ] = 0xFF & ( (c1 << 4) | (c2 >> 2) );

        } else if ( missing == 2 ) {
        	var c0 = utils.get_a2i( s.charCodeAt( idx_in++ ) );
        	var c1 = utils.get_a2i( s.charCodeAt( idx_in++ ) );
        	result[ idx_out++ ] = 0xFF & ( ( c0 << 2 ) | ( c1 >> 4 ) );
        } else {
        	throw "never happen";
        }
        return result;
      },
      get_a2i: function(c){
        var result = (0<=c) && (c<utils.a2i.length) ? utils.a2i[ c ] : -1;
        if (result < 0) throw "Illegal character " + c;
        return result;
      },
      str2utf8: function(str){
          var result = [];
          var length = str.length;
          var idx=0;
          for ( var i=0; i<length; i++ ){
          	var c = str.charCodeAt( i );
          	if ( c <= 0x7f ) {
          	    result[idx++] = c;
          	} else if ( c <= 0x7ff ) {
          	    result[idx++] = 0xC0 | ( 0x1F & ( c >>>  6 ) );
          	    result[idx++] = 0x80 | ( 0x3F & ( c >>>  0 ) );
          	} else if ( c <= 0xffff ) {
          	    result[idx++] = 0xE0 | ( 0x0F & ( c >>> 12 ) ) ;
          	    result[idx++] = 0x80 | ( 0x3F & ( c >>>  6 ) ) ;
          	    result[idx++] = 0x80 | ( 0x3F & ( c >>>  0 ) ) ;
          	} else if ( c <= 0x10ffff ) {
          	    result[idx++] = 0xF0 | ( 0x07 & ( c >>> 18 ) ) ;
          	    result[idx++] = 0x80 | ( 0x3F & ( c >>> 12 ) ) ;
          	    result[idx++] = 0x80 | ( 0x3F & ( c >>>  6 ) ) ;
          	    result[idx++] = 0x80 | ( 0x3F & ( c >>>  0 ) ) ;
          	} else {
          	    throw "error";
          	}
          }
          return result;
      },
      utf82str: function(data){
          var result = "",
          length = data.length;

          for ( var i=0; i<length; ){
          	var c = data[i++];
          	if ( c < 0x80 ) {
          	    result += String.fromCharCode( c );
          	} else if ( ( c < 0xE0 ) ) {
          	    result += String.fromCharCode(
          		( ( 0x1F & c         ) <<  6 ) |
          		( ( 0x3F & data[i++] ) <<  0 )
          	    );
          	} else if ( ( c < 0xF0 ) ) {
          	    result += String.fromCharCode(
          		( ( 0x0F & c         ) << 12 ) |
          		( ( 0x3F & data[i++] ) <<  6 ) |
          		( ( 0x3F & data[i++] ) <<  0 )
          	    );
          	} else if ( ( c < 0xF8 ) ) {
          	    result += String.fromCharCode(
          		( ( 0x07 & c         ) << 18 ) |
          		( ( 0x3F & data[i++] ) << 12 ) |
          		( ( 0x3F & data[i++] ) <<  6 ) |
          		( ( 0x3F & data[i++] ) <<  0 )
          	    );
          	} else if ( ( c < 0xFC ) ) {
          	    result += String.fromCharCode(
          		( ( 0x03 & c         ) << 24 ) |
          		( ( 0x3F & data[i++] ) << 18 ) |
          		( ( 0x3F & data[i++] ) << 12 ) |
          		( ( 0x3F & data[i++] ) <<  6 ) |
          		( ( 0x3F & data[i++] ) <<  0 )
          	    );
          	} else if ( ( c < 0xFE ) ) {
          	    result += String.fromCharCode(
          		( ( 0x01 & c         ) << 30 ) |
          		( ( 0x3F & data[i++] ) << 24 ) |
          		( ( 0x3F & data[i++] ) << 18 ) |
          		( ( 0x3F & data[i++] ) << 12 ) |
          		( ( 0x3F & data[i++] ) <<  6 ) |
          		( ( 0x3F & data[i++] ) <<  0 )
          	    );
          	}
          }
          return result;
      }
    };










    function rotb(b,n){ return ( b<<n | b>>>( 8-n) ) & 0xFF; }
    function rotw(w,n){ return ( w<<n | w>>>(32-n) ) & 0xFFFFFFFF; }
    function getW(a,i){ return a[i]|a[i+1]<<8|a[i+2]<<16|a[i+3]<<24; }
    function setW(a,i,w){ a.splice(i,4,w&0xFF,(w>>>8)&0xFF,(w>>>16)&0xFF,(w>>>24)&0xFF); }
    function setWInv(a,i,w){ a.splice(i,4,(w>>>24)&0xFF,(w>>>16)&0xFF,(w>>>8)&0xFF,w&0xFF); }
    function getB(x,n){ return (x>>>(n*8))&0xFF; }


    function randByte() {
      return window.crypto.getRandomValues(new Uint8Array(1))[0];
    }

    const ALGORITHMS = {
      AES: function(){
      	var keyBytes = null,
        dataBytes = null,
        dataOffset = -1,
        aesNk, aesNr, aesPows, aesLogs,
        aesSBox, aesSBoxInv, aesRco,
        aesFtable, aesRtable, aesFi,
        aesRi, aesFkey, aesRkey;

          function aesMult(x, y){
            return (x&&y) ? aesPows[(aesLogs[x]+aesLogs[y])%255]:0;
          }

          function aesPackBlock() {
            return [ getW(dataBytes,dataOffset), getW(dataBytes,dataOffset+4), getW(dataBytes,dataOffset+8), getW(dataBytes,dataOffset+12) ];
          }

          function aesUnpackBlock(packed){
            for ( var j=0; j<4; j++,dataOffset+=4) setW( dataBytes, dataOffset, packed[j] );
          }

          function aesXTime(p){
            p <<= 1;
            return p&0x100 ? p^0x11B : p;
          }

          function aesSubByte(w){
            return aesSBox[getB(w,0)] | aesSBox[getB(w,1)]<<8 | aesSBox[getB(w,2)]<<16 | aesSBox[getB(w,3)]<<24;
          }

          function aesProduct(w1,w2){
            return aesMult(getB(w1,0),getB(w2,0)) ^ aesMult(getB(w1,1),getB(w2,1))
      	   ^ aesMult(getB(w1,2),getB(w2,2)) ^ aesMult(getB(w1,3),getB(w2,3));
          }

          function aesInvMixCol(x){
            return aesProduct(0x090d0b0e,x)     | aesProduct(0x0d0b0e09,x)<<8 |
      	     aesProduct(0x0b0e090d,x)<<16 | aesProduct(0x0e090d0b,x)<<24;
          }

          function aesByteSub(x){
            var y=aesPows[255-aesLogs[x]];
            x=y;  x=rotb(x,1);
            y^=x; x=rotb(x,1);
            y^=x; x=rotb(x,1);
            y^=x; x=rotb(x,1);
            return x^y^0x63;
          }

          function aesGenTables(){
            var i,y;
            aesPows = [ 1,3 ];
            aesLogs = [ 0,0,null,1 ];
            aesSBox = new Array(256);
            aesSBoxInv = new Array(256);
            aesFtable = new Array(256);
            aesRtable = new Array(256);
            aesRco = new Array(30);

            for ( i=2; i<256; i++){
            	aesPows[i]=aesPows[i-1]^aesXTime( aesPows[i-1] );
            	aesLogs[aesPows[i]]=i;
            }

            aesSBox[0]=0x63;
            aesSBoxInv[0x63]=0;
            for ( i=1; i<256; i++){
            	y=aesByteSub(i);
            	aesSBox[i]=y; aesSBoxInv[y]=i;
            }

            for (i=0,y=1; i<30; i++){ aesRco[i]=y; y=aesXTime(y); }

            for ( i=0; i<256; i++){
            	y = aesSBox[i];
            	aesFtable[i] = aesXTime(y) | y<<8 | y<<16 | (y^aesXTime(y))<<24;
            	y = aesSBoxInv[i];
            	aesRtable[i]= aesMult(14,y) | aesMult(9,y)<<8 | aesMult(13,y)<<16 | aesMult(11,y)<<24;
            }
          }

          function aesInit( key ){
            keyBytes = key;
            keyBytes=keyBytes.slice(0,32);

            var j = 0,
            l = keyBytes.length,
            i,k,m;

            while ( l!=16 && l!=24 && l!=32 ) keyBytes[l++]=keyBytes[j++];
            aesGenTables();

            aesNk = keyBytes.length >>> 2;
            aesNr = 6 + aesNk;

            var N=4*(aesNr+1);

            aesFi = new Array(12);
            aesRi = new Array(12);
            aesFkey = new Array(N);
            aesRkey = new Array(N);

            for (m=j=0;j<4;j++,m+=3){
            	aesFi[m]=(j+1)%4;
            	aesFi[m+1]=(j+2)%4;
            	aesFi[m+2]=(j+3)%4;
            	aesRi[m]=(4+j-1)%4;
            	aesRi[m+1]=(4+j-2)%4;
            	aesRi[m+2]=(4+j-3)%4;
            }

            for (i=j=0;i<aesNk;i++,j+=4) aesFkey[i]=getW(keyBytes,j);

            for (k=0,j=aesNk;j<N;j+=aesNk,k++){
            	aesFkey[j]=aesFkey[j-aesNk]^aesSubByte(rotw(aesFkey[j-1], 24))^aesRco[k];
            	if (aesNk<=6)
            	  for (i=1;i<aesNk && (i+j)<N;i++) aesFkey[i+j]=aesFkey[i+j-aesNk]^aesFkey[i+j-1];
            	else {
            	  for (i=1;i<4 &&(i+j)<N;i++) aesFkey[i+j]=aesFkey[i+j-aesNk]^aesFkey[i+j-1];
            	  if ((j+4)<N) aesFkey[j+4]=aesFkey[j+4-aesNk]^aesSubByte(aesFkey[j+3]);
            	  for (i=5;i<aesNk && (i+j)<N;i++) aesFkey[i+j]=aesFkey[i+j-aesNk]^aesFkey[i+j-1];
            	}
            }

            for (j=0;j<4;j++) aesRkey[j+N-4]=aesFkey[j];
            for (i=4;i<N-4;i+=4){
            	k=N-4-i;
            	for (j=0;j<4;j++) aesRkey[k+j]=aesInvMixCol(aesFkey[i+j]);
            }
            for (j=N-4;j<N;j++) aesRkey[j-N+4]=aesFkey[j];
          }

          function aesClose(){
            aesPows=aesLogs=aesSBox=aesSBoxInv=aesRco=null;
            aesFtable=aesRtable=aesFi=aesRi=aesFkey=aesRkey=null;
          }

          function aesRounds( block, key, table, inc, box ){
            var tmp = new Array( 4 );
            var i,j,m,r;

            for ( r=0; r<4; r++ ) block[r]^=key[r];
            for ( i=1; i<aesNr; i++ ){
            	for (j=m=0;j<4;j++,m+=3){
            	  tmp[j]=key[r++]^table[block[j]&0xFF]^
            		 rotw(table[(block[inc[m]]>>>8)&0xFF], 8)^
            		 rotw(table[(block[inc[m+1]]>>>16)&0xFF], 16)^
            		 rotw(table[(block[inc[m+2]]>>>24)&0xFF], 24);
            	}
            	var t=block; block=tmp; tmp=t;
            }

            for (j=m=0;j<4;j++,m+=3)
            	tmp[j]=key[r++]^box[block[j]&0xFF]^
            	       rotw(box[(block[inc[m  ]]>>> 8)&0xFF], 8)^
            	       rotw(box[(block[inc[m+1]]>>>16)&0xFF],16)^
            	       rotw(box[(block[inc[m+2]]>>>24)&0xFF],24);
                  return tmp;
          }

          function aesEncrypt( data,offset ){
            dataBytes = data;
            dataOffset = offset;
            aesUnpackBlock( aesRounds( aesPackBlock(), aesFkey, aesFtable, aesFi, aesSBox ) );
          }

          function aesDecrypt( data,offset){
            dataBytes = data;
            dataOffset = offset;
            aesUnpackBlock( aesRounds(aesPackBlock(), aesRkey, aesRtable, aesRi, aesSBoxInv ) );
          }

          return {
          	blocksize : 128/8,
          	open: aesInit,
          	close: aesClose,
          	encrypt: aesEncrypt,
          	decrypt: aesDecrypt
          };
      },
      SERPENT: function(){
      	var keyBytes = null;
      	var dataBytes = null;
      	var dataOffset = -1;

          var srpKey=[];

          function srpK(r,a,b,c,d,i){
            r[a]^=srpKey[4*i]; r[b]^=srpKey[4*i+1]; r[c]^=srpKey[4*i+2]; r[d]^=srpKey[4*i+3];
          }

          function srpLK(r,a,b,c,d,e,i){
            r[a]=rotw(r[a],13);r[c]=rotw(r[c],3);r[b]^=r[a];r[e]=(r[a]<<3)&0xFFFFFFFF;
            r[d]^=r[c];r[b]^=r[c];r[b]=rotw(r[b],1);r[d]^=r[e];r[d]=rotw(r[d],7);r[e]=r[b];
            r[a]^=r[b];r[e]=(r[e]<<7)&0xFFFFFFFF;r[c]^=r[d];r[a]^=r[d];r[c]^=r[e];r[d]^=srpKey[4*i+3];
            r[b]^=srpKey[4*i+1];r[a]=rotw(r[a],5);r[c]=rotw(r[c],22);r[a]^=srpKey[4*i+0];r[c]^=srpKey[4*i+2];
          }

          function srpKL(r,a,b,c,d,e,i){
            r[a]^=srpKey[4*i+0];r[b]^=srpKey[4*i+1];r[c]^=srpKey[4*i+2];r[d]^=srpKey[4*i+3];
            r[a]=rotw(r[a],27);r[c]=rotw(r[c],10);r[e]=r[b];r[c]^=r[d];r[a]^=r[d];r[e]=(r[e]<<7)&0xFFFFFFFF;
            r[a]^=r[b];r[b]=rotw(r[b],31);r[c]^=r[e];r[d]=rotw(r[d],25);r[e]=(r[a]<<3)&0xFFFFFFFF;
            r[b]^=r[a];r[d]^=r[e];r[a]=rotw(r[a],19);r[b]^=r[c];r[d]^=r[c];r[c]=rotw(r[c],29);
          }

          var srpS=[
          function(r,x0,x1,x2,x3,x4){
            r[x4]=r[x3];r[x3]|=r[x0];r[x0]^=r[x4];r[x4]^=r[x2];r[x4]=~r[x4];r[x3]^=r[x1];
            r[x1]&=r[x0];r[x1]^=r[x4];r[x2]^=r[x0];r[x0]^=r[x3];r[x4]|=r[x0];r[x0]^=r[x2];
            r[x2]&=r[x1];r[x3]^=r[x2];r[x1]=~r[x1];r[x2]^=r[x4];r[x1]^=r[x2];
          },
          function(r,x0,x1,x2,x3,x4){
            r[x4]=r[x1];r[x1]^=r[x0];r[x0]^=r[x3];r[x3]=~r[x3];r[x4]&=r[x1];r[x0]|=r[x1];
            r[x3]^=r[x2];r[x0]^=r[x3];r[x1]^=r[x3];r[x3]^=r[x4];r[x1]|=r[x4];r[x4]^=r[x2];
            r[x2]&=r[x0];r[x2]^=r[x1];r[x1]|=r[x0];r[x0]=~r[x0];r[x0]^=r[x2];r[x4]^=r[x1];
          },
          function(r,x0,x1,x2,x3,x4){
            r[x3]=~r[x3];r[x1]^=r[x0];r[x4]=r[x0];r[x0]&=r[x2];r[x0]^=r[x3];r[x3]|=r[x4];
            r[x2]^=r[x1];r[x3]^=r[x1];r[x1]&=r[x0];r[x0]^=r[x2];r[x2]&=r[x3];r[x3]|=r[x1];
            r[x0]=~r[x0];r[x3]^=r[x0];r[x4]^=r[x0];r[x0]^=r[x2];r[x1]|=r[x2];
          },
          function(r,x0,x1,x2,x3,x4){
            r[x4]=r[x1];r[x1]^=r[x3];r[x3]|=r[x0];r[x4]&=r[x0];r[x0]^=r[x2];r[x2]^=r[x1];r[x1]&=r[x3];
            r[x2]^=r[x3];r[x0]|=r[x4];r[x4]^=r[x3];r[x1]^=r[x0];r[x0]&=r[x3];r[x3]&=r[x4];
            r[x3]^=r[x2];r[x4]|=r[x1];r[x2]&=r[x1];r[x4]^=r[x3];r[x0]^=r[x3];r[x3]^=r[x2];
          },
          function(r,x0,x1,x2,x3,x4){
            r[x4]=r[x3];r[x3]&=r[x0];r[x0]^=r[x4];r[x3]^=r[x2];r[x2]|=r[x4];r[x0]^=r[x1];
            r[x4]^=r[x3];r[x2]|=r[x0];r[x2]^=r[x1];r[x1]&=r[x0];r[x1]^=r[x4];r[x4]&=r[x2];
            r[x2]^=r[x3];r[x4]^=r[x0];r[x3]|=r[x1];r[x1]=~r[x1];r[x3]^=r[x0];
          },
          function(r,x0,x1,x2,x3,x4){
            r[x4]=r[x1];r[x1]|=r[x0];r[x2]^=r[x1];r[x3]=~r[x3];r[x4]^=r[x0];r[x0]^=r[x2];
            r[x1]&=r[x4];r[x4]|=r[x3];r[x4]^=r[x0];r[x0]&=r[x3];r[x1]^=r[x3];r[x3]^=r[x2];
            r[x0]^=r[x1];r[x2]&=r[x4];r[x1]^=r[x2];r[x2]&=r[x0];r[x3]^=r[x2];
          },
          function(r,x0,x1,x2,x3,x4){
            r[x4]=r[x1];r[x3]^=r[x0];r[x1]^=r[x2];r[x2]^=r[x0];r[x0]&=r[x3];r[x1]|=r[x3];
            r[x4]=~r[x4];r[x0]^=r[x1];r[x1]^=r[x2];r[x3]^=r[x4];r[x4]^=r[x0];r[x2]&=r[x0];
            r[x4]^=r[x1];r[x2]^=r[x3];r[x3]&=r[x1];r[x3]^=r[x0];r[x1]^=r[x2];
          },
          function(r,x0,x1,x2,x3,x4){
            r[x1]=~r[x1];r[x4]=r[x1];r[x0]=~r[x0];r[x1]&=r[x2];r[x1]^=r[x3];r[x3]|=r[x4];r[x4]^=r[x2];
            r[x2]^=r[x3];r[x3]^=r[x0];r[x0]|=r[x1];r[x2]&=r[x0];r[x0]^=r[x4];r[x4]^=r[x3];
            r[x3]&=r[x0];r[x4]^=r[x1];r[x2]^=r[x4];r[x3]^=r[x1];r[x4]|=r[x0];r[x4]^=r[x1];
          }];

          var srpSI=[
          function(r,x0,x1,x2,x3,x4){
            r[x4]=r[x3];r[x1]^=r[x0];r[x3]|=r[x1];r[x4]^=r[x1];r[x0]=~r[x0];r[x2]^=r[x3];
            r[x3]^=r[x0];r[x0]&=r[x1];r[x0]^=r[x2];r[x2]&=r[x3];r[x3]^=r[x4];r[x2]^=r[x3];
            r[x1]^=r[x3];r[x3]&=r[x0];r[x1]^=r[x0];r[x0]^=r[x2];r[x4]^=r[x3];
          },
          function(r,x0,x1,x2,x3,x4){
            r[x1]^=r[x3];r[x4]=r[x0];r[x0]^=r[x2];r[x2]=~r[x2];r[x4]|=r[x1];r[x4]^=r[x3];
            r[x3]&=r[x1];r[x1]^=r[x2];r[x2]&=r[x4];r[x4]^=r[x1];r[x1]|=r[x3];r[x3]^=r[x0];
            r[x2]^=r[x0];r[x0]|=r[x4];r[x2]^=r[x4];r[x1]^=r[x0];r[x4]^=r[x1];
          },
          function(r,x0,x1,x2,x3,x4){
            r[x2]^=r[x1];r[x4]=r[x3];r[x3]=~r[x3];r[x3]|=r[x2];r[x2]^=r[x4];r[x4]^=r[x0];
            r[x3]^=r[x1];r[x1]|=r[x2];r[x2]^=r[x0];r[x1]^=r[x4];r[x4]|=r[x3];r[x2]^=r[x3];
            r[x4]^=r[x2];r[x2]&=r[x1];r[x2]^=r[x3];r[x3]^=r[x4];r[x4]^=r[x0];
          },
          function(r,x0,x1,x2,x3,x4){
            r[x2]^=r[x1];r[x4]=r[x1];r[x1]&=r[x2];r[x1]^=r[x0];r[x0]|=r[x4];r[x4]^=r[x3];
            r[x0]^=r[x3];r[x3]|=r[x1];r[x1]^=r[x2];r[x1]^=r[x3];r[x0]^=r[x2];r[x2]^=r[x3];
            r[x3]&=r[x1];r[x1]^=r[x0];r[x0]&=r[x2];r[x4]^=r[x3];r[x3]^=r[x0];r[x0]^=r[x1];
          },
          function(r,x0,x1,x2,x3,x4){
            r[x2]^=r[x3];r[x4]=r[x0];r[x0]&=r[x1];r[x0]^=r[x2];r[x2]|=r[x3];r[x4]=~r[x4];
            r[x1]^=r[x0];r[x0]^=r[x2];r[x2]&=r[x4];r[x2]^=r[x0];r[x0]|=r[x4];r[x0]^=r[x3];
            r[x3]&=r[x2];r[x4]^=r[x3];r[x3]^=r[x1];r[x1]&=r[x0];r[x4]^=r[x1];r[x0]^=r[x3];
          },
          function(r,x0,x1,x2,x3,x4){
            r[x4]=r[x1];r[x1]|=r[x2];r[x2]^=r[x4];r[x1]^=r[x3];r[x3]&=r[x4];r[x2]^=r[x3];r[x3]|=r[x0];
            r[x0]=~r[x0];r[x3]^=r[x2];r[x2]|=r[x0];r[x4]^=r[x1];r[x2]^=r[x4];r[x4]&=r[x0];r[x0]^=r[x1];
            r[x1]^=r[x3];r[x0]&=r[x2];r[x2]^=r[x3];r[x0]^=r[x2];r[x2]^=r[x4];r[x4]^=r[x3];
          },
          function(r,x0,x1,x2,x3,x4){
            r[x0]^=r[x2];r[x4]=r[x0];r[x0]&=r[x3];r[x2]^=r[x3];r[x0]^=r[x2];r[x3]^=r[x1];
            r[x2]|=r[x4];r[x2]^=r[x3];r[x3]&=r[x0];r[x0]=~r[x0];r[x3]^=r[x1];r[x1]&=r[x2];
            r[x4]^=r[x0];r[x3]^=r[x4];r[x4]^=r[x2];r[x0]^=r[x1];r[x2]^=r[x0];
          },
          function(r,x0,x1,x2,x3,x4){
            r[x4]=r[x3];r[x3]&=r[x0];r[x0]^=r[x2];r[x2]|=r[x4];r[x4]^=r[x1];r[x0]=~r[x0];r[x1]|=r[x3];
            r[x4]^=r[x0];r[x0]&=r[x2];r[x0]^=r[x1];r[x1]&=r[x2];r[x3]^=r[x2];r[x4]^=r[x3];
            r[x2]&=r[x3];r[x3]|=r[x0];r[x1]^=r[x4];r[x3]^=r[x4];r[x4]&=r[x0];r[x4]^=r[x2];
          }];

          var srpKc=[7788,63716,84032,7891,78949,25146,28835,67288,84032,40055,7361,1940,77639,27525,24193,75702,
            7361,35413,83150,82383,58619,48468,18242,66861,83150,69667,7788,31552,40054,23222,52496,57565,7788,63716];
          var srpEc=[44255,61867,45034,52496,73087,56255,43827,41448,18242,1939,18581,56255,64584,31097,26469,
            77728,77639,4216,64585,31097,66861,78949,58006,59943,49676,78950,5512,78949,27525,52496,18670,76143];
          var srpDc=[44255,60896,28835,1837,1057,4216,18242,77301,47399,53992,1939,1940,66420,39172,78950,
            45917,82383,7450,67288,26469,83149,57565,66419,47400,58006,44254,18581,18228,33048,45034,66508,7449];

          function srpInit(key){
            keyBytes = key;
            var i,j,m,n;
            function keyIt(a,b,c,d,i){ srpKey[i]=r[b]=rotw(srpKey[a]^r[b]^r[c]^r[d]^0x9e3779b9^i,11); }
            function keyLoad(a,b,c,d,i){ r[a]=srpKey[i]; r[b]=srpKey[i+1]; r[c]=srpKey[i+2]; r[d]=srpKey[i+3]; }
            function keyStore(a,b,c,d,i){ srpKey[i]=r[a]; srpKey[i+1]=r[b]; srpKey[i+2]=r[c]; srpKey[i+3]=r[d]; }

            keyBytes.reverse();
            keyBytes[keyBytes.length]=1; while (keyBytes.length<32) keyBytes[keyBytes.length]=0;
            for (i=0; i<8; i++){
            	srpKey[i] = (keyBytes[4*i+0] & 0xff) | (keyBytes[4*i+1] & 0xff) <<  8 |
            	(keyBytes[4*i+2] & 0xff) << 16 | (keyBytes[4*i+3] & 0xff) << 24;
            }

            var r = [srpKey[3],srpKey[4],srpKey[5],srpKey[6],srpKey[7]];

            i=0; j=0;

            while (keyIt(j++,0,4,2,i++),keyIt(j++,1,0,3,i++),i<132){
            	keyIt(j++,2,1,4,i++); if (i==8){j=0;}
            	keyIt(j++,3,2,0,i++); keyIt(j++,4,3,1,i++);
            }

            i=128; j=3; n=0;
            while(m=srpKc[n++],srpS[j++%8](r,m%5,m%7,m%11,m%13,m%17),m=srpKc[n],keyStore(m%5,m%7,m%11,m%13,i),i>0){
      	       i-=4; keyLoad(m%5,m%7,m%11,m%13,i);
            }
          }

          function srpClose(){
            srpKey = [];
          }

          function srpEncrypt( data,offset){
            dataBytes = data;
            dataOffset = offset;
            var blk = dataBytes.slice(dataOffset,dataOffset+16); blk.reverse();
            var r=[getW(blk,0),getW(blk,4),getW(blk,8),getW(blk,12)];

            srpK(r,0,1,2,3,0);
            var n=0, m=srpEc[n];
            while (srpS[n%8](r,m%5,m%7,m%11,m%13,m%17),n<31){ m=srpEc[++n]; srpLK(r,m%5,m%7,m%11,m%13,m%17,n); }
            srpK(r,0,1,2,3,32);

            for (var j=3; j>=0; j--,dataOffset+=4) setWInv(dataBytes,dataOffset,r[j]);
          }

          function srpDecrypt(data,offset){
            dataBytes = data;
            dataOffset = offset;
            var blk = dataBytes.slice(dataOffset,dataOffset+16); blk.reverse();
            var r=[getW(blk,0),getW(blk,4),getW(blk,8),getW(blk,12)];

            srpK(r,0,1,2,3,32);
            var n=0, m=srpDc[n];
            while (srpSI[7-n%8](r,m%5,m%7,m%11,m%13,m%17),n<31){ m=srpDc[++n]; srpKL(r,m%5,m%7,m%11,m%13,m%17,32-n); }
            srpK(r,2,3,1,4,0);

            setWInv(dataBytes,dataOffset,r[4]); setWInv(dataBytes,dataOffset+4,r[1]); setWInv(dataBytes,dataOffset+8,r[3]); setWInv(dataBytes,dataOffset+12,r[2]);
            dataOffset+=16;
          }

          return {
          	blocksize: 128/8,
          	open: srpInit,
          	close: srpClose,
          	encrypt: srpEncrypt,
          	decrypt: srpDecrypt
          }
      },
      TWOFISH: function() {

        var keyBytes = null,
      	dataBytes = null,
      	dataOffset = -1;

          var tfsKey=[],
          tfsM=[[],[],[],[]];

          function tfsInit(key){
            keyBytes = key;
            var  i, a, b, c, d, meKey=[], moKey=[], inKey=[];
            var kLen;
            var sKey=[];
            var  f01, f5b, fef;

            var q0=[[8,1,7,13,6,15,3,2,0,11,5,9,14,12,10,4],[2,8,11,13,15,7,6,14,3,1,9,4,0,10,12,5]];
            var q1=[[14,12,11,8,1,2,3,5,15,4,10,6,7,0,9,13],[1,14,2,11,4,12,3,7,6,13,10,5,15,9,0,8]];
            var q2=[[11,10,5,14,6,13,9,0,12,8,15,3,2,4,7,1],[4,12,7,5,1,6,9,10,0,14,13,8,2,11,3,15]];
            var q3=[[13,7,15,4,1,2,6,14,9,11,3,0,8,5,12,10],[11,9,5,1,12,3,13,14,6,4,7,15,2,0,8,10]];
            var ror4=[0,8,1,9,2,10,3,11,4,12,5,13,6,14,7,15];
            var ashx=[0,9,2,11,4,13,6,15,8,1,10,3,12,5,14,7];
            var q=[[],[]];
            var m=[[],[],[],[]];

            function ffm5b(x){ return x^(x>>2)^[0,90,180,238][x&3]; }
            function ffmEf(x){ return x^(x>>1)^(x>>2)^[0,238,180,90][x&3]; }

            function mdsRem(p,q){
            	var i,t,u;
            	for(i=0; i<8; i++){
            	  t = q>>>24;
            	  q = ((q<<8)&0xFFFFFFFF) | p>>>24;
            	  p = (p<<8)&0xFFFFFFFF;
            	  u = t<<1; if (t&128){ u^=333; }
            	  q ^= t^(u<<16);
            	  u ^= t>>>1; if (t&1){ u^=166; }
            	  q ^= u<<24 | u<<8;
            	}
            	return q;
            }

            function qp(n,x){
            	var a,b,c,d;
            	a=x>>4; b=x&15;
            	c=q0[n][a^b]; d=q1[n][ror4[b]^ashx[a]];
            	return q3[n][ror4[d]^ashx[c]]<<4 | q2[n][c^d];
            }

            function hFun(x,key){
            	var a=getB(x,0), b=getB(x,1), c=getB(x,2), d=getB(x,3);
            	switch(kLen){
            	case 4:
            	  a = q[1][a]^getB(key[3],0);
            	  b = q[0][b]^getB(key[3],1);
            	  c = q[0][c]^getB(key[3],2);
            	  d = q[1][d]^getB(key[3],3);
            	case 3:
            	  a = q[1][a]^getB(key[2],0);
            	  b = q[1][b]^getB(key[2],1);
            	  c = q[0][c]^getB(key[2],2);
            	  d = q[0][d]^getB(key[2],3);
            	case 2:
            	  a = q[0][q[0][a]^getB(key[1],0)]^getB(key[0],0);
            	  b = q[0][q[1][b]^getB(key[1],1)]^getB(key[0],1);
            	  c = q[1][q[0][c]^getB(key[1],2)]^getB(key[0],2);
            	  d = q[1][q[1][d]^getB(key[1],3)]^getB(key[0],3);
            	}
            	return m[0][a]^m[1][b]^m[2][c]^m[3][d];
            }

            keyBytes=keyBytes.slice(0,32); i=keyBytes.length;
            while ( i!=16 && i!=24 && i!=32 ) keyBytes[i++]=0;

            for (i=0; i<keyBytes.length; i+=4){ inKey[i>>2]=getW(keyBytes,i); }
            for (i=0; i<256; i++){ q[0][i]=qp(0,i); q[1][i]=qp(1,i); }
            for (i=0; i<256; i++){
            	f01 = q[1][i]; f5b = ffm5b(f01); fef = ffmEf(f01);
            	m[0][i] = f01 + (f5b<<8) + (fef<<16) + (fef<<24);
            	m[2][i] = f5b + (fef<<8) + (f01<<16) + (fef<<24);
            	f01 = q[0][i]; f5b = ffm5b(f01); fef = ffmEf(f01);
            	m[1][i] = fef + (fef<<8) + (f5b<<16) + (f01<<24);
            	m[3][i] = f5b + (f01<<8) + (fef<<16) + (f5b<<24);
            }

            kLen = inKey.length/2;
            for (i=0; i<kLen; i++){
            	a = inKey[i+i];   meKey[i] = a;
            	b = inKey[i+i+1]; moKey[i] = b;
            	sKey[kLen-i-1] = mdsRem(a,b);
            }
            for (i=0; i<40; i+=2){
            	a=0x1010101*i; b=a+0x1010101;
            	a=hFun(a,meKey);
            	b=rotw(hFun(b,moKey),8);
            	tfsKey[i]=(a+b)&0xFFFFFFFF;
            	tfsKey[i+1]=rotw(a+2*b,9);
            }
            for (i=0; i<256; i++){
            	a=b=c=d=i;
            	switch(kLen){
            	case 4:
            	  a = q[1][a]^getB(sKey[3],0);
            	  b = q[0][b]^getB(sKey[3],1);
            	  c = q[0][c]^getB(sKey[3],2);
            	  d = q[1][d]^getB(sKey[3],3);
            	case 3:
            	  a = q[1][a]^getB(sKey[2],0);
            	  b = q[1][b]^getB(sKey[2],1);
            	  c = q[0][c]^getB(sKey[2],2);
            	  d = q[0][d]^getB(sKey[2],3);
            	case 2:
            	  tfsM[0][i] = m[0][q[0][q[0][a]^getB(sKey[1],0)]^getB(sKey[0],0)];
            	  tfsM[1][i] = m[1][q[0][q[1][b]^getB(sKey[1],1)]^getB(sKey[0],1)];
            	  tfsM[2][i] = m[2][q[1][q[0][c]^getB(sKey[1],2)]^getB(sKey[0],2)];
            	  tfsM[3][i] = m[3][q[1][q[1][d]^getB(sKey[1],3)]^getB(sKey[0],3)];
            	}
            }
          }

          function tfsG0(x){ return tfsM[0][getB(x,0)]^tfsM[1][getB(x,1)]^tfsM[2][getB(x,2)]^tfsM[3][getB(x,3)]; }
          function tfsG1(x){ return tfsM[0][getB(x,3)]^tfsM[1][getB(x,0)]^tfsM[2][getB(x,1)]^tfsM[3][getB(x,2)]; }

          function tfsFrnd(r,blk){
            var a=tfsG0(blk[0]); var b=tfsG1(blk[1]);
            blk[2] = rotw( blk[2]^(a+b+tfsKey[4*r+8])&0xFFFFFFFF, 31 );
            blk[3] = rotw(blk[3],1) ^ (a+2*b+tfsKey[4*r+9])&0xFFFFFFFF;
            a=tfsG0(blk[2]); b=tfsG1(blk[3]);
            blk[0] = rotw( blk[0]^(a+b+tfsKey[4*r+10])&0xFFFFFFFF, 31 );
            blk[1] = rotw(blk[1],1) ^ (a+2*b+tfsKey[4*r+11])&0xFFFFFFFF;
          }

          function tfsIrnd(i,blk){
            var a=tfsG0(blk[0]); var b=tfsG1(blk[1]);
            blk[2] = rotw(blk[2],1) ^ (a+b+tfsKey[4*i+10])&0xFFFFFFFF;
            blk[3] = rotw( blk[3]^(a+2*b+tfsKey[4*i+11])&0xFFFFFFFF, 31 );
            a=tfsG0(blk[2]); b=tfsG1(blk[3]);
            blk[0] = rotw(blk[0],1) ^ (a+b+tfsKey[4*i+8])&0xFFFFFFFF;
            blk[1] = rotw( blk[1]^(a+2*b+tfsKey[4*i+9])&0xFFFFFFFF, 31 );
          }

          function tfsClose(){
            tfsKey=[];
            tfsM=[[],[],[],[]];
          }

          function tfsEncrypt( data,offset){
            dataBytes = data;
            dataOffset = offset;
            var blk=[getW(dataBytes,dataOffset)^tfsKey[0], getW(dataBytes,dataOffset+4)^tfsKey[1], getW(dataBytes,dataOffset+8)^tfsKey[2], getW(dataBytes,dataOffset+12)^tfsKey[3]];
            for (var j=0;j<8;j++){ tfsFrnd(j,blk); }
            setW(dataBytes,dataOffset   ,blk[2]^tfsKey[4]);
            setW(dataBytes,dataOffset+ 4,blk[3]^tfsKey[5]);
            setW(dataBytes,dataOffset+ 8,blk[0]^tfsKey[6]);
            setW(dataBytes,dataOffset+12,blk[1]^tfsKey[7]);
            dataOffset+=16;
          }

          function tfsDecrypt(data,offset){
            dataBytes = data;
            dataOffset = offset;
            var blk=[getW(dataBytes,dataOffset)^tfsKey[4], getW(dataBytes,dataOffset+4)^tfsKey[5], getW(dataBytes,dataOffset+8)^tfsKey[6], getW(dataBytes,dataOffset+12)^tfsKey[7]];
            for (var j=7;j>=0;j--){ tfsIrnd(j,blk); }
            setW(dataBytes,dataOffset   ,blk[2]^tfsKey[0]);
            setW(dataBytes,dataOffset+ 4,blk[3]^tfsKey[1]);
            setW(dataBytes,dataOffset+ 8,blk[0]^tfsKey[2]);
            setW(dataBytes,dataOffset+12,blk[1]^tfsKey[3]);
            dataOffset+=16;
          }

          return {
          	blocksize: 128/8,
          	open: tfsInit,
          	close: tfsClose,
          	encrypt: tfsEncrypt,
          	decrypt: tfsDecrypt
          }
      }
    };

    function createCBC() {

      return {
        encrypt: {
          open: function(){
            this.algorithm.open(this.keyBytes);
            this.dataBytes.unshift(
              randByte(), randByte(), randByte(), randByte(), randByte(), randByte(), randByte(), randByte(),
              randByte(), randByte(), randByte(), randByte(), randByte(), randByte(), randByte(), randByte()
            );
            this.dataLength = this.dataBytes.length;
            this.dataOffset = 16;
            return;
          },
          exec: function(){
            for (var idx2 = this.dataOffset; idx2 < this.dataOffset + 16; idx2++){
              this.dataBytes[idx2] ^= this.dataBytes[idx2 - 16];
            }

            this.algorithm.encrypt(this.dataBytes, this.dataOffset);
            this.dataOffset += this.algorithm.blocksize;

            if (this.dataLength <= this.dataOffset) {
              return 0;
            } else {
              return this.dataLength - this.dataOffset;
            }
          },
          close: function(){
            this.algorithm.close();
          }
        },
        decrypt: {
          open: function(){
            this.algorithm.open(this.keyBytes);
            this.dataLength = this.dataBytes.length;
            this.dataOffset = 16;
            this.iv = this.dataBytes.slice(0, 16);
            return;
          },
          exec: function(){
            var iv2 = this.dataBytes.slice(this.dataOffset, this.dataOffset + 16);
            this.algorithm.decrypt(this.dataBytes, this.dataOffset);
            for (var ii = 0; ii < 16; ii++){
              this.dataBytes[this.dataOffset + ii] ^= this.iv[ii];
            }

            this.dataOffset += this.algorithm.blocksize;
            this.iv = iv2;

            if (this.dataLength <= this.dataOffset) {
              return 0;
            } else {
              return this.dataLength - this.dataOffset;
            }
          },
          close: function(){
            this.algorithm.close();
            this.dataBytes.splice(0, 16);

            while (this.dataBytes[this.dataBytes.length - 1] == 0){
              this.dataBytes.pop();
            }
          }
        }
      }
    }

    function createPKCS7(){
      return {
        append: function(data) {
          var len = 16 - (data.length % 16);
          for (var i = 0; i < len; i++) {
            data.push(len);
          }
          return data;
        },
        remove: function(data) {
          var len = data.pop();
          if (16 < len) len = 0;
          for (var i = 1; i < len; i++) {
            data.pop();
          }
          return data;
        }
      }
    }


    function Cipher(algorithm, direction, mode, padding) {
        this.algorithm = algorithm;
        this.direction = direction;
        this.mode = mode;
        this.padding = padding;
        this.modeOpen  = mode[direction].open;
        this.modeExec  = mode[direction].exec;
        this.modeClose = mode[direction].close;
        this.keyBytes  = null;
        this.dataBytes = null;
        this.dataOffset = -1;
        this.dataLength = -1;
    }


    Cipher.prototype = {
      open: function(keyBytes, dataBytes) {
        if (keyBytes == null) throw "keyBytes is null";
        if (dataBytes == null) throw "dataBytes is null";

        this.keyBytes = keyBytes.concat();
        this.dataBytes = dataBytes;
        this.dataOffset = 0;
        this.dataLength = dataBytes.length;

        if (this.direction == 'encrypt') {
          this.padding.append(this.dataBytes);
        }

        this.modeOpen();
      },
      close: function() {
        this.modeClose();
        if (this.direction == 'decrypt') {
          this.padding.remove(this.dataBytes);
        }
        return this.dataBytes;
      },
      operate: function() {
        return this.modeExec();
      },
      execute: function(keyBytes, dataBytes) {
        this.open(keyBytes, dataBytes);
        for (;;) {
          var size = this.operate();
          if (0 < size) {
            continue;
          } else {
            break;
          }
        }
        return this.close();
      }
    };

    Cipher.create = function(algo, ctype) {
      try {
        return new Cipher(ALGORITHMS[algo](), ctype, createCBC(), createPKCS7());
      } catch (err) {
        if(err){return console.error(err)}
      }
    };

    function pack(s) {
      let str = "";
      for (var i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if (c == " " || c == "\t" || c == "\r" || c == "\n") ; else {
          str += c;
        }
      }
      return str;
    }

    return {
      generateKey: function(encode) {
    		let res = new Array(32);
    		for (var i=0; i<res.length; i++){
    		  res[i] = randByte();
    		}
        if(encode === 'base64'){
          res = utils.base64_encode(res);
        } else if(encode === 'hex'){
          res = utils.hex_encode(res);
        }

        return res;
      },
      enc: function(text, key, algo, encode) {
        key = utils[encode + '_decode'](key);
      	let cipher = Cipher.create(algo, "encrypt"),
        res = cipher.execute(key,utils.str2utf8(text));
      	return pack(utils[encode + '_encode'](res));
      },
      dec: function(text, key, algo, encode) {

      	let cipher = Cipher.create(algo, "decrypt");
      	return utils.utf82str(
          cipher.execute(
            utils[encode + '_decode'](key),
            utils[encode + '_decode'](text)
          )
        )
      },
      enc2x: function(text, key, algo, encode) {
        let ctext = this.enc(text, key[0], algo[0], encode);
      	return this.enc(ctext, key[1], algo[1], encode)
      },
      enc3x: function(text, key, algo, encode) {
        let ctext = this.enc(text, key[0], algo[0], encode);
        ctext = this.enc(ctext, key[1], algo[1], encode);
      	return this.enc(ctext, key[2], algo[2], encode)
      },
      dec2x: function(text, key, algo, encode) {
        key = key.reverse();
        algo = algo.reverse();
        let ctext = this.dec(text, key[0], algo[0], encode);
      	return this.dec(ctext, key[1], algo[1], encode)
      },
      dec3x: function(text, key, algo, encode) {
        key = key.reverse();
        algo = algo.reverse();
        let ctext = this.dec(text, key[0], algo[0], encode);
        ctext = this.dec(ctext, key[1], algo[1], encode);
      	return this.dec(ctext, key[2], algo[2], encode)
      }
    }

  }

  const xcrypt = new XCRYPT();

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
        let res = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Hex.parse(hex));
        return res;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    text2hex(text){

      try {
        let res = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(text));
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

  };

  Object.freeze(enc);

  const pouch = new PouchDB('xcrypto');

  const db = {
    get(cb){

      pouch.get('store', function(err, doc) {
        if (err) {
          return cb(err)
        }
        cb(false, doc);
      });

    },
    loginDb(obj, router){

      pouch.get('store', function(err, doc) {
        document.getElementById('dbCheck');
        if(err){
          console.log(err);
        } else {

          if(doc.ctext !== false);
          ss.set('isLoggedIn', true);
          console.log('data decrypted, routing...');
          router.rout('/home', xdata.home);

        }
      });
    },
    checkDb(cb){


      pouch.get('store', function(err, doc) {
        let ele = document.getElementById('dbCheck');
        if (err) {
          console.log('no db found, creating...');
          setTimeout(function(){
            ele.textContent = 'Creating new DB';
          },1500);
          db.addIndex(xdata.schema, function(err,res){
            if(err){
              console.log(err);
              cb(true);
            } else {
              console.log('db created.');
              pouch.get('store', function(err, doc) {
                if (err) {
                  console.log(err);
                  cb(true);
                } else {
                  setTimeout(function(){
                    ele.textContent = 'DB loaded';
                    ele.classList.add('txt-lime');
                    setTimeout(function(){
                      ele.classList.remove('txt-lime');
                    },1000);
                  },2500);
                  console.log('db found, loading...');
                  cb(false, doc);
                }
              });
            }
          });
        } else {
          console.log('db found, loading...');
          setTimeout(function(){
            ele.textContent = 'DB loaded';
            ele.classList.add('txt-lime');
            setTimeout(function(){
              ele.classList.remove('txt-lime');
            },1000);
          },2000);
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
        cb(false, res);
      });

    },
    updateIndex(obj, cb) {

      pouch.get('store', function(err, doc) {
        if (err) {
          console.log(err);
          cb(true);
        } else {

          doc.updated = Date.now();

          obj.salt;
          obj.salt = enc.pbkdf2(secret, obj.salt);



          pouch.put(doc, function(err, response) {
            if (err) { return console.log(err); }

            pouch.compact(function (err, result) {
              if (err) { return console.log(err); }

              //doc.ctext = doc.cascadeEnc(js(doc.ptext), obj)
              cb(false, doc);
            });

          });

        }
      });

    },
    deleteIndex(obj, cb) {

    },
    addobj(sect, obj, cb){

      pouch.get('store', function(err, doc) {
        if (err) {
          cb(err);
        } else {

          doc.updated = Date.now();

          if(!doc.ptext[sect] || !Array.isArray(doc.ptext[sect])){
            doc.ptext[sect] = [];
          }

          doc.ptext[sect].unshift(obj);

          console.log(doc);
          pouch.put(doc, function(err, response) {
            if (err) {return cb(err);}

            pouch.compact(function (err, result) {
              if (err) { return cb(err); }

              cb(false, doc);
            });

          });

        }
      });

    },
    delobj(sect, obj, cb){

      pouch.get('store', function(err, doc) {
        if (err) {
          cb(err);
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

          });

        }
      });

    },
    restore(obj, cb){

      pouch.get('store', function(err, doc) {
        if (err) {
          cb(err);
        } else {

          doc.updated = Date.now();
          doc.ptext = obj;

          pouch.put(doc, function(err, response) {
            if (err) {return cb(err);}
            pouch.compact(function (err, result) {
              if (err) { return cb(err); }

              cb(false);
            });
          });
        }
      });

    }
  };

  Object.freeze(db);

  const xviews = {
    error(stream, data){
      return x('code', stream.js(data))
    },

    //views
    vault(stream, data){
      ss.del('tpm');
      ss.set('isLoggedIn', false);
      ss.set('cipher', false);

      var salt;

      db.checkDb(function(err,res){
        if(err); else {
          salt = res.salt;
        }
      });


      let item = x('div', {class: 'mt-4 mb-4'},
        x('div', {class: 'card'},
          x('div', {class: 'lockboxico'},
            x('i', {class: 'material-icons'}, 'lock')
          ),
          x('div', {class: 'card-body text-center'},
            x('div', {id: 'dbCheck', class: 'card-title'},'Checking DB',
              x('div', {class: 'spinner-border spinner-border-sm ms-2', role: 'status'})
            ),
            x('hr'),
            x('div', {class: 'card-title'},'Login data'),

            x('input', {
              id: 's0',
              class:'form-control text-center',
              type: 'password',
              placeholder: 'Password (min 8, max 32)',
              maxlength: '32',
              onkeyup(){
                utils.validateInput(this, 8);
              }
            }),

            x('hr'),
            x('div', {class: 'card-title'},'Cipher'),
            x('div', {class: 'mb-4'},
              x('button', {
                class: 'btn w-100 btn-outline-dark mb-2',
                onclick(){
                  ss.set('cipher', 0);
                }
              }, 'AES'),
              x('button', {
                class: 'btn w-100 btn-outline-dark mb-2',
                onclick(){
                  ss.set('cipher', 1);
                }
              }, 'SERPENT'),
              x('button', {
                class: 'btn w-100 btn-outline-dark mb-2',
                onclick(){
                  ss.set('cipher', 2);
                }
              }, 'TWOFISH')
            ),

            x('hr'),
            x('p', {id: 'errtxt'}),
            x('button', {
              class: 'btn w-100 btn-outline-dark',
              onclick(){
                let obj = {
                  keys: document.getElementById('s0').value,
                  cipher: ss.get('cipher')
                },
                arr = [];

                if(obj.keys.length < 8 || obj.keys.length > 32){
                  arr.push('Password');
                  console.log('password too short');
                }

                if(typeof obj.cipher !== 'number'){
                  arr.push('cipher');
                  console.log('Cipher');
                }




                if(arr.length){
                  document.getElementById('errtxt').textContent = 'Ivalid ' + arr.join(', ');
                  return;
                }



                document.getElementById('errtxt').textContent = '';

                obj.keys = enc.pbkdf2(obj.keys, salt);



                arr = [];

                obj.cipher = xdata.cipher.order[obj.cipher];

                ss.del('cipher');
                //console.log(js(obj));

  /*
                let tst =  enc.cascadeEnc('data', {
                  key3x: obj.keys,
                  algo3x: obj.cipher
                })

                console.log('tst: '+ tst)

                tst =  enc.cascadeDec(tst, {
                  key3x: obj.keys,
                  algo3x: obj.cipher
                })

                console.log('tst: '+ tst)
  */
                enc.tpmSet(obj);

                db.loginDb(obj, router);

                console.log(enc.tpmGet());

              }
            }, 'Submit')
          )
        )
      );

      return item;
    },
    home(stream, data){
      let item = x('div', {class: 'row'}),
      items = xdata.nav,
      arr = ls.get('nav') || [];

      for (var i = 0; i < items.length; i++) {
        if(arr.indexOf(items[i]) === -1){
          item.append(
            x('div', {class: 'col-6'},
              x('div', {
                  id: items[i],
                  class: 'card homecard mb-2 mt-4',
                  onclick(){
                    console.log(this.id);
                    router.rout('/'+ this.id, xdata[this.id]);
                  }
                },
                x('div', {class: 'card-body text-center cp'},
                  x('h5', {class: 'card-title'}, items[i])
                )
              )
            )
          );
        }

      }

      return item;
    },
    birthdays(stream, data){
      let item = x('div'),
      items = x('div');

      var obj = {name: '', birthday: '', relation: '', notes: ''};

      db.get(function(err,doc){
        if(err){return console.log(err)}

        let eles = doc.ptext.birthdays || [];

        if(eles.length){
            eles = utils.sortAlpha(eles, 'name');
        }

        for (let i = 0; i < eles.length; i++) {
          items.append(
            tpl.birthdayitem(eles[i], db)
          );
        }

      });


      item.append(
        tpl.selgroup(),
        x('hr'),
        x('div', {id: 'creatediv'},
          x('div', {class: 'card mt-4 mb-4'},
            x('div', {class: 'card-body'},
              x('h5', {class: 'card-title'}, 'Add new birthday'),
              x('input', {
                id: 'nname',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Name (required)',
                onkeyup(){
                  obj.name = this.value;
                }
              }),
              x('input', {
                id: 'nbirthday',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Birthdate DD/MM/YYYY',
                onkeyup(){
                  obj.birthday = this.value;
                }
              }),
              x('input', {
                id: 'nrelation',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Relation',
                onkeyup(){
                  obj.relation = this.value;
                }
              }),
              x('input', {
                id: 'nnotes',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Notes...',
                onkeyup(){
                  obj.notes = this.value;
                }
              }),
              x('p', {id: 'txterror'}),
              x('p', {id: 'txtsuccess'})
            ),
            x('div', {class: 'card-footer text-end'},
              x('button', {
                class: 'btn btn-outline-secondary',
                type: 'button',
                onclick(){

                  if(!obj.name.length){
                    return document.getElementById('txterror').textContent = 'Invalid name length';
                  }

                  if(!obj.birthday.length){
                    return document.getElementById('txterror').textContent = 'Invalid birthday length';
                  }

                  document.getElementById('txterror').textContent = '';
                  obj.id = Date.now();

                  db.addobj('birthdays', obj, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }

                    let arr = ['nname', 'nbirthday', 'nrelation', 'nnotes'];

                    document.getElementById('txtsuccess').textContent = 'New birthday added!';

                    items.prepend(
                      tpl.birthdayitem(obj, db, true)
                    );

                    for (var i = 0; i < arr.length; i++) {
                      document.getElementById(arr[i]).value = '';
                    }

                    obj = {name: '', birthday: '', relation: '', notes: ''};

                    setTimeout(function(){
                      document.getElementById('txtsuccess').textContent = '';
                    },3000);

                  });

                }
              }, 'Submit')
            )
          )
        ),
        x('div', {id: 'listdiv', class: 'hidden'}, items),
        x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['birthdays','name','birthdayitem']))
      );

      return item;
    },
    business(stream, data){
      let item = x('div'),
      items = x('div');

      var obj = {name: '', phone: '', mobile: '', email: '', url: '', address: '', notes: ''};

      db.get(function(err,doc){
        if(err){return console.log(err)}

        let eles = doc.ptext.business || [];

        if(eles.length){
            eles = utils.sortAlpha(eles, 'name');
        }

        for (let i = 0; i < eles.length; i++) {
          items.append(
            tpl.businessitem(eles[i], db)
          );
        }

      });


      item.append(
        tpl.selgroup(),
        x('hr'),
        x('div', {id: 'creatediv'},
          x('div', {class: 'card mt-4 mb-4'},
            x('div', {class: 'card-body'},
              x('h5', {class: 'card-title'}, 'Add new business'),
              x('input', {
                id: 'nname',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Name (required)',
                onkeyup(){
                  obj.name = this.value;
                }
              }),
              x('input', {
                id: 'nphone',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Phone',
                onkeyup(){
                  obj.phone = this.value;
                }
              }),
              x('input', {
                id: 'nmobile',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Mobile',
                onkeyup(){
                  obj.mobile = this.value;
                }
              }),
              x('input', {
                id: 'nemail',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Email',
                onkeyup(){
                  obj.email = this.value;
                }
              }),
              x('input', {
                id: 'nurl',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'URL',
                onkeyup(){
                  obj.url = this.value;
                }
              }),
              x('textarea', {
                id: 'naddress',
                rows: '5',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Address',
                onkeyup(){
                  obj.address = this.value;
                }
              }),
              x('input', {
                id: 'nnotes',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Notes...',
                onkeyup(){
                  obj.notes = this.value;
                }
              }),
              x('p', {id: 'txterror'}),
              x('p', {id: 'txtsuccess'})
            ),
            x('div', {class: 'card-footer text-end'},
              x('button', {
                class: 'btn btn-outline-secondary',
                type: 'button',
                onclick(){

                  if(!obj.name.length){
                    return document.getElementById('txterror').textContent = 'Invalid name length';
                  }


                  document.getElementById('txterror').textContent = '';
                  obj.id = Date.now();

                  db.addobj('business', obj, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }

                    let arr = ['nname', 'nphone', 'nmobile', 'nemail', 'nurl', 'naddress', 'nnotes'];

                    document.getElementById('txtsuccess').textContent = 'New business added!';

                    items.prepend(
                      tpl.businessitem(obj, db, true)
                    );

                    for (var i = 0; i < arr.length; i++) {
                      document.getElementById(arr[i]).value = '';
                    }

                    obj = {name: '', phone: '', mobile: '', email: '', url: '', address: '', notes: ''};

                    setTimeout(function(){
                      document.getElementById('txtsuccess').textContent = '';
                    },3000);

                  });

                }
              }, 'Submit')
            )
          )
        ),
        x('div', {id: 'listdiv', class: 'hidden'}, items),
        x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['business','name','businessitem']))
      );

      return item;
    },
    bills(stream, data){
      let item = x('div'),
      items = x('div');

      var obj = {title: '', company: '', location: '', price: '', date: '', notes: ''};

      db.get(function(err,doc){
        if(err){return console.log(err)}

        let eles = doc.ptext.bills || [];

        for (let i = 0; i < eles.length; i++) {
          items.append(
            tpl.billsitem(eles[i], db)
          );
        }

      });


      item.append(
        tpl.selgroup(),
        x('hr'),
        x('div', {id: 'creatediv'},
          x('div', {class: 'card mt-4 mb-4'},
            x('div', {class: 'card-body'},
              x('h5', {class: 'card-title'}, 'Add new item'),
              x('input', {
                id: 'ntitle',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Title (required)',
                onkeyup(){
                  obj.title = this.value;
                }
              }),
              x('input', {
                id: 'ncompany',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Company',
                onkeyup(){
                  obj.company = this.value;
                }
              }),
              x('input', {
                id: 'nlocation',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Location',
                onkeyup(){
                  obj.location = this.value;
                }
              }),
              x('input', {
                id: 'nprice',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Price',
                onkeyup(){
                  obj.price = this.value;
                }
              }),
              x('input', {
                id: 'ndate',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Date',
                onkeyup(){
                  obj.date = this.value;
                }
              }),
              x('textarea', {
                id: 'nnotes',
                rows: '5',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Notes...',
                onkeyup(){
                  obj.notes = this.value;
                }
              }),
              x('p', {id: 'txterror'}),
              x('p', {id: 'txtsuccess'})
            ),
            x('div', {class: 'card-footer text-end'},
              x('button', {
                class: 'btn btn-outline-secondary',
                type: 'button',
                onclick(){

                  if(!obj.title.length){
                    return document.getElementById('txterror').textContent = 'Invalid name length';
                  }

                  document.getElementById('txterror').textContent = '';
                  obj.id = Date.now();

                  db.addobj('bills', obj, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }

                    let arr = ['ntitle', 'ncompany', 'nlocation', 'nprice', 'ndate', 'nnotes'];

                    document.getElementById('txtsuccess').textContent = 'New item added!';

                    items.prepend(
                      tpl.billsitem(obj, db, true)
                    );

                    for (var i = 0; i < arr.length; i++) {
                      document.getElementById(arr[i]).value = '';
                    }

                    obj = {title: '', company: '', location: '', price: '', date: '', notes: ''};

                    setTimeout(function(){
                      document.getElementById('txtsuccess').textContent = '';
                    },3000);

                  });

                }
              }, 'Submit')
            )
          )
        ),
        x('div', {id: 'listdiv', class: 'hidden'}, items),
        x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['bills','title','billsitem']))
      );

      return item;
    },
    contacts(stream, data){
      let item = x('div'),
      items = x('div');

      var obj = {name: '', relation: '', phone: '', mobile: '', email: '', url: '', address: '', notes: ''};

      db.get(function(err,doc){
        if(err){return console.log(err)}

        let eles = doc.ptext.contacts || [];

        if(eles.length){
            eles = utils.sortAlpha(eles, 'name');
        }

        for (let i = 0; i < eles.length; i++) {
          items.append(
            tpl.contactitem(eles[i], db)
          );
        }

      });


      item.append(
        tpl.selgroup(),
        x('hr'),
        x('div', {id: 'creatediv'},
          x('div', {class: 'card mt-4 mb-4'},
            x('div', {class: 'card-body'},
              x('h5', {class: 'card-title'}, 'Add new contact'),
              x('input', {
                id: 'nname',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Name (required)',
                onkeyup(){
                  obj.name = this.value;
                }
              }),
              x('input', {
                id: 'nrelation',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Relation',
                onkeyup(){
                  obj.relation = this.value;
                }
              }),
              x('input', {
                id: 'nphone',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Phone',
                onkeyup(){
                  obj.phone = this.value;
                }
              }),
              x('input', {
                id: 'nmobile',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Mobile',
                onkeyup(){
                  obj.mobile = this.value;
                }
              }),
              x('input', {
                id: 'nemail',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Email',
                onkeyup(){
                  obj.email = this.value;
                }
              }),
              x('input', {
                id: 'nurl',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'URL',
                onkeyup(){
                  obj.url = this.value;
                }
              }),
              x('textarea', {
                id: 'naddress',
                rows: '5',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Address',
                onkeyup(){
                  obj.address = this.value;
                }
              }),
              x('input', {
                id: 'nnotes',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Notes...',
                onkeyup(){
                  obj.notes = this.value;
                }
              }),
              x('p', {id: 'txterror'}),
              x('p', {id: 'txtsuccess'})
            ),
            x('div', {class: 'card-footer text-end'},
              x('button', {
                class: 'btn btn-outline-secondary',
                type: 'button',
                onclick(){

                  if(!obj.name.length){
                    return document.getElementById('txterror').textContent = 'Invalid name length';
                  }


                  document.getElementById('txterror').textContent = '';
                  obj.id = Date.now();

                  db.addobj('contacts', obj, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }

                    let arr = ['nname', 'nrelation', 'nphone', 'nmobile', 'nemail', 'nurl', 'naddress', 'nnotes'];

                    document.getElementById('txtsuccess').textContent = 'New contact added!';

                    items.prepend(
                      tpl.contactitem(obj, db, true)
                    );

                    for (var i = 0; i < arr.length; i++) {
                      document.getElementById(arr[i]).value = '';
                    }

                    obj = {name: '', relation: '', phone: '', mobile: '', email: '', url: '', address: '', notes: ''};

                    setTimeout(function(){
                      document.getElementById('txtsuccess').textContent = '';
                    },3000);

                  });

                }
              }, 'Submit')
            )
          )
        ),
        x('div', {id: 'listdiv', class: 'hidden'}, items),
        x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['contacts','name','contactitem']))
      );

      return item;
    },
    emails(stream, data){
      let item = x('div'),
      items = x('div');

      var obj = {title: '', email: '', notes: ''};

      db.get(function(err,doc){
        if(err){return console.log(err)}

        let eles = doc.ptext.emails || [];

        if(eles.length){
            eles = utils.sortAlpha(eles, 'title');
        }

        for (let i = 0; i < eles.length; i++) {
          items.append(
            tpl.emailitem(eles[i], db)
          );
        }

      });


      item.append(
        tpl.selgroup(),
        x('hr'),
        x('div', {id: 'creatediv'},
          x('div', {class: 'card mt-4 mb-4'},
            x('div', {class: 'card-body'},
              x('h5', {class: 'card-title'}, 'Add new email'),
              x('input', {
                id: 'ntitle',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Title (required)',
                onkeyup(){
                  obj.title = this.value;
                }
              }),
              x('input', {
                id: 'nemail',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Email (required)',
                onkeyup(){
                  obj.email = this.value;
                }
              }),
              x('input', {
                id: 'nnotes',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Notes...',
                onkeyup(){
                  obj.notes = this.value;
                }
              }),
              x('p', {id: 'txterror'}),
              x('p', {id: 'txtsuccess'})
            ),
            x('div', {class: 'card-footer text-end'},
              x('button', {
                class: 'btn btn-outline-secondary',
                type: 'button',
                onclick(){

                  if(!obj.title.length){
                    return document.getElementById('txterror').textContent = 'Invalid title length';
                  }

                  if(!obj.email.length){
                    return document.getElementById('txterror').textContent = 'Invalid email length';
                  }

                  document.getElementById('txterror').textContent = '';
                  obj.id = Date.now();

                  db.addobj('emails', obj, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }

                    let arr = ['ntitle', 'nemail', 'nnotes'];

                    document.getElementById('txtsuccess').textContent = 'New email added!';

                    items.prepend(
                      tpl.emailitem(obj, db, true)
                    );

                    for (var i = 0; i < arr.length; i++) {
                      document.getElementById(arr[i]).value = '';
                    }

                    obj = {title: '', email: '', notes: ''};

                    setTimeout(function(){
                      document.getElementById('txtsuccess').textContent = '';
                    },3000);

                  });

                }
              }, 'Submit')
            )
          )
        ),
        x('div', {id: 'listdiv', class: 'hidden'}, items),
        x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['emails','title','emailitem']))
      );

      return item;
    },
    locations(stream, data){
      let item = x('div'),
      items = x('div');

      var obj = {title: '', address: '', notes: ''};

      db.get(function(err,doc){
        if(err){return console.log(err)}

        let eles = doc.ptext.locations || [];

        if(eles.length){
            eles = utils.sortAlpha(eles, 'title');
        }

        for (let i = 0; i < eles.length; i++) {
          items.append(
            tpl.locationitem(eles[i], db)
          );
        }

      });


      item.append(
        tpl.selgroup(),
        x('hr'),
        x('div', {id: 'creatediv'},
          x('div', {class: 'card mt-4 mb-4'},
            x('div', {class: 'card-body'},
              x('h5', {class: 'card-title'}, 'Add new location'),
              x('input', {
                id: 'ntitle',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Title (required)',
                onkeyup(){
                  obj.title = this.value;
                }
              }),
              x('textarea', {
                id: 'naddress',
                rows: '5',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Address (required)',
                onkeyup(){
                  obj.address = this.value;
                }
              }),
              x('input', {
                id: 'nnotes',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Notes...',
                onkeyup(){
                  obj.notes = this.value;
                }
              }),
              x('p', {id: 'txterror'}),
              x('p', {id: 'txtsuccess'})
            ),
            x('div', {class: 'card-footer text-end'},
              x('button', {
                class: 'btn btn-outline-secondary',
                type: 'button',
                onclick(){

                  if(!obj.title.length){
                    return document.getElementById('txterror').textContent = 'Invalid title length';
                  }

                  if(!obj.address.length){
                    return document.getElementById('txterror').textContent = 'Invalid address length';
                  }

                  document.getElementById('txterror').textContent = '';
                  obj.id = Date.now();

                  db.addobj('locations', obj, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }

                    let arr = ['ntitle', 'naddress', 'nnotes'];

                    document.getElementById('txtsuccess').textContent = 'New address added!';

                    items.prepend(
                      tpl.locationitem(obj, db, true)
                    );

                    for (var i = 0; i < arr.length; i++) {
                      document.getElementById(arr[i]).value = '';
                    }

                    obj = {title: '', address: '', notes: ''};

                    setTimeout(function(){
                      document.getElementById('txtsuccess').textContent = '';
                    },3000);

                  });

                }
              }, 'Submit')
            )
          )
        ),
        x('div', {id: 'listdiv', class: 'hidden'}, items),
        x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['locations','title','locationitem']))
      );

      return item;
    },
    passwords(stream, data){
      let item = x('div'),
      items = x('div');

      var obj = {title: '', username: '', password: '', pin: '', url: '', notes: ''};

      db.get(function(err,doc){
        if(err){return console.log(err)}

        let eles = doc.ptext.passwords || [];

        if(eles.length){
            eles = utils.sortAlpha(eles, 'title');
        }

        for (let i = 0; i < eles.length; i++) {
          items.append(
            tpl.passworditem(eles[i], db)
          );
        }

      });


      item.append(
        tpl.selgroup(),
        x('hr'),
        x('div', {id: 'creatediv'},
          x('div', {class: 'card mt-4 mb-4'},
            x('div', {class: 'card-body'},
              x('h5', {class: 'card-title'}, 'Add new password'),
              x('input', {
                id: 'ntitle',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Title (required)',
                onkeyup(){
                  obj.title = this.value;
                }
              }),
              x('input', {
                id: 'nusername',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Username',
                onkeyup(){
                  obj.username = this.value;
                }
              }),
              x('div', {class: 'input-group mb-2'},
                x('input', {
                  id: 'npassword',
                  class:'form-control',
                  type: 'password',
                  placeholder: 'password',
                  onkeyup(){
                    obj.password = this.value;
                  }
                }),
                x('span', {class: 'input-group-text cp'},
                  x('span', {
                    class: 'material-icons',
                    onclick(){
                      let dest = this.parentNode.previousSibling;

                      if (dest.type === "password") {
                        dest.type = "text";
                      } else {
                        dest.type = "password";
                      }
                    }
                  }, 'visibility')
                )
              ),
              x('div', {class: 'input-group mb-2'},
                x('input', {
                  id: 'npin',
                  class:'form-control',
                  type: 'password',
                  placeholder: 'Pin',
                  onkeyup(){
                    obj.pin = this.value;
                  }
                }),
                x('span', {class: 'input-group-text cp'},
                  x('span', {
                    class: 'material-icons',
                    onclick(){
                      let dest = this.parentNode.previousSibling;

                      if (dest.type === "password") {
                        dest.type = "text";
                      } else {
                        dest.type = "password";
                      }
                    }
                  }, 'visibility')
                )
              ),
              x('input', {
                id: 'nurl',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'URL',
                onkeyup(){
                  obj.url = this.value;
                }
              }),
              x('input', {
                id: 'nnotes',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Notes...',
                onkeyup(){
                  obj.notes = this.value;
                }
              }),
              x('p', {id: 'txterror'}),
              x('p', {id: 'txtsuccess'})
            ),
            x('div', {class: 'card-footer text-end'},
              x('button', {
                class: 'btn btn-outline-secondary',
                type: 'button',
                onclick(){

                  if(!obj.title.length){
                    return document.getElementById('txterror').textContent = 'Invalid title length';
                  }

                  document.getElementById('txterror').textContent = '';

                  obj.id = Date.now();

                  db.addobj('passwords', obj, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }

                    let arr = ['ntitle', 'nusername', 'npassword', 'npin', 'nurl', 'nnotes'];

                    document.getElementById('txtsuccess').textContent = 'New password added!';

                    items.prepend(
                      tpl.passworditem(obj, db, true)
                    );

                    for (var i = 0; i < arr.length; i++) {
                      document.getElementById(arr[i]).value = '';
                    }

                    obj = {title: '', username: '', password: '', pin: '', url: '', notes: ''};

                    setTimeout(function(){
                      document.getElementById('txtsuccess').textContent = '';
                    },3000);

                  });

                }
              }, 'Submit')
            )
          )
        ),
        x('div', {id: 'listdiv', class: 'hidden'}, items),
        x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['passwords','title','passworditem']))
      );

      return item;
    },
    diary(stream, data){
      let item = x('div'),
      items = x('div');

      var obj = {title: '', entry: ''};

      db.get(function(err,doc){
        if(err){return console.log(err)}

        let eles = doc.ptext.diary || [];

        for (let i = 0; i < eles.length; i++) {
          items.append(
            tpl.diaryitem(eles[i], db)
          );
        }


      });


      item.append(
        tpl.selgroup(),
        x('hr'),
        x('div', {id: 'creatediv'},
          x('div', {class: 'card mt-4 mb-4'},
            x('div', {class: 'card-body'},
              x('h5', {class: 'card-title'}, 'Add new diary entry'),
              x('input', {
                id: 'ntitle',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Title (required)',
                onkeyup(){
                  obj.title = this.value;
                }
              }),
              x('textarea', {
                id: 'nentry',
                rows:'5',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Entry...',
                onkeyup(){
                  obj.entry = this.value;
                }
              }),
              x('p', {id: 'txterror'}),
              x('p', {id: 'txtsuccess'})
            ),
            x('div', {class: 'card-footer text-end'},
              x('button', {
                class: 'btn btn-outline-secondary',
                type: 'button',
                onclick(){

                  if(!obj.title.length){
                    return document.getElementById('txterror').textContent = 'Invalid title length';
                  }

                  if(!obj.entry.length){
                    return document.getElementById('txterror').textContent = 'Invalid entry length';
                  }

                  document.getElementById('txterror').textContent = '';
                  obj.id = Date.now();

                  db.addobj('diary', obj, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }

                    let arr = ['ntitle', 'nentry'];

                    document.getElementById('txtsuccess').textContent = 'New entry added!';

                    items.prepend(
                      tpl.diaryitem(obj, db, true)
                    );

                    for (var i = 0; i < arr.length; i++) {
                      document.getElementById(arr[i]).value = '';
                    }

                    obj = {title: '', entry: ''};

                    setTimeout(function(){
                      document.getElementById('txtsuccess').textContent = '';
                    },3000);

                  });

                }
              }, 'Submit')
            )
          )
        ),
        x('div', {id: 'listdiv', class: 'hidden'}, items),
        x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['diary','title','diaryitem']))
      );

      return item;
    },
    notes(stream, data){
      let item = x('div'),
      items = x('div');

      var obj = {title: '', topic: '', notes: ''};

      db.get(function(err,doc){
        if(err){return console.log(err)}

        let eles = doc.ptext.notes || [];

        for (let i = 0; i < eles.length; i++) {
          items.append(
            tpl.diaryitem(eles[i], db)
          );
        }


      });


      item.append(
        tpl.selgroup(),
        x('hr'),
        x('div', {id: 'creatediv'},
          x('div', {class: 'card mt-4 mb-4'},
            x('div', {class: 'card-body'},
              x('h5', {class: 'card-title'}, 'Add new note'),
              x('input', {
                id: 'ntitle',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Title (required)',
                onkeyup(){
                  obj.title = this.value;
                }
              }),
              x('input', {
                id: 'ntopic',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Topic',
                onkeyup(){
                  obj.topic = this.value;
                }
              }),
              x('textarea', {
                id: 'nentry',
                rows:'5',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Notes... (required)',
                onkeyup(){
                  obj.notes = this.value;
                }
              }),
              x('p', {id: 'txterror'}),
              x('p', {id: 'txtsuccess'})
            ),
            x('div', {class: 'card-footer text-end'},
              x('button', {
                class: 'btn btn-outline-secondary',
                type: 'button',
                onclick(){

                  if(!obj.title.length){
                    return document.getElementById('txterror').textContent = 'Invalid title length';
                  }

                  if(!obj.notes.length){
                    return document.getElementById('txterror').textContent = 'Invalid notes length';
                  }

                  document.getElementById('txterror').textContent = '';
                  obj.id = Date.now();

                  db.addobj('notes', obj, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }

                    let arr = ['ntitle', 'ntopic','nentry'];

                    document.getElementById('txtsuccess').textContent = 'New note added!';

                    items.prepend(
                      tpl.notesitem(obj, db, true)
                    );

                    for (var i = 0; i < arr.length; i++) {
                      document.getElementById(arr[i]).value = '';
                    }

                    obj = {title: '', entry: ''};

                    setTimeout(function(){
                      document.getElementById('txtsuccess').textContent = '';
                    },3000);

                  });

                }
              }, 'Submit')
            )
          )
        ),
        x('div', {id: 'listdiv', class: 'hidden'}, items),
        x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['notes','title','notesitem']))
      );

      return item;
    },
    todos(stream, data){
      let item = x('div'),
      items = x('div');

      var obj = {title: '', topic: '', date: '', todo: ''};

      db.get(function(err,doc){
        if(err){return console.log(err)}

        let eles = doc.ptext.todos || [];

        for (let i = 0; i < eles.length; i++) {
          items.append(
            tpl.todoitem(eles[i], db)
          );
        }


      });


      item.append(
        tpl.selgroup(),
        x('hr'),
        x('div', {id: 'creatediv'},
          x('div', {class: 'card mt-4 mb-4'},
            x('div', {class: 'card-body'},
              x('h5', {class: 'card-title'}, 'Add new todo'),
              x('input', {
                id: 'ntitle',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Title (required)',
                onkeyup(){
                  obj.title = this.value;
                }
              }),
              x('input', {
                id: 'ntopic',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Topic',
                onkeyup(){
                  obj.topic = this.value;
                }
              }),
              x('input', {
                id: 'ndate',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Date due',
                onkeyup(){
                  obj.date = this.value;
                }
              }),
              x('textarea', {
                id: 'ntodo',
                rows:'5',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Todo... (required)',
                onkeyup(){
                  obj.todo = this.value;
                }
              }),
              x('p', {id: 'txterror'}),
              x('p', {id: 'txtsuccess'})
            ),
            x('div', {class: 'card-footer text-end'},
              x('button', {
                class: 'btn btn-outline-secondary',
                type: 'button',
                onclick(){

                  if(!obj.title.length){
                    return document.getElementById('txterror').textContent = 'Invalid title length';
                  }

                  if(!obj.todo.length){
                    return document.getElementById('txterror').textContent = 'Invalid todo length';
                  }

                  document.getElementById('txterror').textContent = '';
                  obj.id = Date.now();

                  db.addobj('todos', obj, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }

                    let arr = ['ntitle', 'ntopic', 'ndate', 'ntodo'];

                    document.getElementById('txtsuccess').textContent = 'New todo added!';

                    items.prepend(
                      tpl.todoitem(obj, db, true)
                    );

                    for (var i = 0; i < arr.length; i++) {
                      document.getElementById(arr[i]).value = '';
                    }

                    obj = {title: '', topic: '', date: '', todo: ''};

                    setTimeout(function(){
                      document.getElementById('txtsuccess').textContent = '';
                    },3000);

                  });

                }
              }, 'Submit')
            )
          )
        ),
        x('div', {id: 'listdiv', class: 'hidden'}, items),
        x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['todos','title','todoitem']))
      );

      return item;
    },
    events(stream, data){
      let item = x('div'),
      items = x('div');

      var obj = {title: '', date: '', time: '', duration: '', people: '', location: '', requirements: '', notes: ''};

      db.get(function(err,doc){
        if(err){return console.log(err)}

        let eles = doc.ptext.events || [];

        if(eles.length){
            eles = utils.sortAlpha(eles, 'title');
        }

        for (let i = 0; i < eles.length; i++) {
          items.append(
            tpl.eventitem(eles[i], db)
          );
        }


      });


      item.append(
        tpl.selgroup(),
        x('hr'),
        x('div', {id: 'creatediv'},
          x('div', {class: 'card mt-4 mb-4'},
            x('div', {class: 'card-body'},
              x('h5', {class: 'card-title'}, 'Add new event'),
              x('input', {
                id: 'ntitle',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Title (required)',
                onkeyup(){
                  obj.title = this.value;
                }
              }),
              x('input', {
                id: 'ndate',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Date (D/M/Y)',
                onkeyup(){
                  obj.date = this.value;
                }
              }),
              x('input', {
                id: 'ntime',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Time',
                onkeyup(){
                  obj.time = this.value;
                }
              }),
              x('input', {
                id: 'nduration',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Duration',
                onkeyup(){
                  obj.duration = this.value;
                }
              }),
              x('textarea', {
                id: 'npeople',
                rows:'5',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'People',
                onkeyup(){
                  obj.people = this.value;
                }
              }),
              x('textarea', {
                id: 'nlocation',
                rows:'5',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Location',
                onkeyup(){
                  obj.location = this.value;
                }
              }),
              x('textarea', {
                id: 'nrequirements',
                rows:'5',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Requirements',
                onkeyup(){
                  obj.requirements = this.value;
                }
              }),
              x('input', {
                id: 'nnotes',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Notes',
                onkeyup(){
                  obj.notes = this.value;
                }
              }),
              x('p', {id: 'txterror'}),
              x('p', {id: 'txtsuccess'})
            ),
            x('div', {class: 'card-footer text-end'},
              x('button', {
                class: 'btn btn-outline-secondary',
                type: 'button',
                onclick(){

                  if(!obj.title.length){
                    return document.getElementById('txterror').textContent = 'Invalid title length';
                  }

                  document.getElementById('txterror').textContent = '';
                  obj.id = Date.now();

                  db.addobj('events', obj, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }

                    let arr = ['ntitle', 'ndate', 'ntime', 'nduration', 'npeople', 'nlocation', 'nrequirements', 'nnotes'];

                    document.getElementById('txtsuccess').textContent = 'New event added!';

                    items.prepend(
                      tpl.eventitem(obj, db, true)
                    );

                    for (var i = 0; i < arr.length; i++) {
                      document.getElementById(arr[i]).value = '';
                    }

                    obj = {title: '', date: '', time: '', duration: '', people: '', location: '', requirements: '', notes: ''};

                    setTimeout(function(){
                      document.getElementById('txtsuccess').textContent = '';
                    },3000);

                  });

                }
              }, 'Submit')
            )
          )
        ),
        x('div', {id: 'listdiv', class: 'hidden'}, items),
        x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['events','title','eventitem']))
      );

      return item;
    },
    schedule(stream, data){
      let item = x('div'),
      items = x('div');

      var obj = {title: '', category: '', date: '', time: '', duration: '', contact: '', location: '', notes: ''};

      db.get(function(err,doc){
        if(err){return console.log(err)}

        let eles = doc.ptext.schedule || [];

        for (let i = 0; i < eles.length; i++) {
          items.append(
            tpl.scheduleitem(eles[i], db)
          );
        }


      });


      item.append(
        tpl.selgroup(),
        x('hr'),
        x('div', {id: 'creatediv'},
          x('div', {class: 'card mt-4 mb-4'},
            x('div', {class: 'card-body'},
              x('h5', {class: 'card-title'}, 'Add new schedule item'),
              x('input', {
                id: 'ntitle',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Title (required)',
                onkeyup(){
                  obj.title = this.value;
                }
              }),
              x('input', {
                id: 'ncategory',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Category',
                onkeyup(){
                  obj.category = this.value;
                }
              }),
              x('input', {
                id: 'ndate',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Date (D/M/Y)',
                onkeyup(){
                  obj.date = this.value;
                }
              }),
              x('input', {
                id: 'ntime',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Time',
                onkeyup(){
                  obj.time = this.value;
                }
              }),
              x('input', {
                id: 'nduration',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Duration',
                onkeyup(){
                  obj.duration = this.value;
                }
              }),
              x('input', {
                id: 'ncontact',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Contact',
                onkeyup(){
                  obj.contact = this.value;
                }
              }),
              x('textarea', {
                id: 'nlocation',
                rows:'5',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Location',
                onkeyup(){
                  obj.location = this.value;
                }
              }),
              x('input', {
                id: 'nnotes',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Notes',
                onkeyup(){
                  obj.notes = this.value;
                }
              }),
              x('p', {id: 'txterror'}),
              x('p', {id: 'txtsuccess'})
            ),
            x('div', {class: 'card-footer text-end'},
              x('button', {
                class: 'btn btn-outline-secondary',
                type: 'button',
                onclick(){

                  if(!obj.title.length){
                    return document.getElementById('txterror').textContent = 'Invalid title length';
                  }

                  document.getElementById('txterror').textContent = '';
                  obj.id = Date.now();

                  db.addobj('schedule', obj, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }

                    let arr = ['ntitle', 'ncategory', 'ndate', 'ntime', 'nduration', 'ncontact', 'nlocation', 'nnotes'];

                    document.getElementById('txtsuccess').textContent = 'New schedule item added!';

                    items.prepend(
                      tpl.scheduleitem(obj, db, true)
                    );

                    for (var i = 0; i < arr.length; i++) {
                      document.getElementById(arr[i]).value = '';
                    }

                    obj = {title: '', category: '', date: '', time: '', duration: '', contact: '', location: '', notes: ''};

                    setTimeout(function(){
                      document.getElementById('txtsuccess').textContent = '';
                    },3000);

                  });

                }
              }, 'Submit')
            )
          )
        ),
        x('div', {id: 'listdiv', class: 'hidden'}, items),
        x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['schedule','title','scheduleitem']))
      );

      return item;
    },
    shopping(stream, data){
      let item = x('div'),
      items = x('div');

      var obj = {item: '', category: '', location: '', price: '', quantity: '', notes: ''};

      db.get(function(err,doc){
        if(err){return console.log(err)}

        let eles = doc.ptext.shopping || [];

        for (let i = 0; i < eles.length; i++) {
          items.append(
            tpl.shoppingitem(eles[i], db)
          );
        }

      });


      item.append(
        tpl.selgroup(),
        x('hr'),
        x('div', {id: 'creatediv'},
          x('div', {class: 'card mt-4 mb-4'},
            x('div', {class: 'card-body'},
              x('h5', {class: 'card-title'}, 'Add new item'),
              x('input', {
                id: 'nitem',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Item (required)',
                onkeyup(){
                  obj.item = this.value;
                }
              }),
              x('input', {
                id: 'ncategory',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Category',
                onkeyup(){
                  obj.category = this.value;
                }
              }),
              x('input', {
                id: 'nlocation',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Location',
                onkeyup(){
                  obj.location = this.value;
                }
              }),
              x('input', {
                id: 'nprice',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Price',
                onkeyup(){
                  obj.price = this.value;
                }
              }),
              x('input', {
                id: 'nquantity',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Quantity',
                onkeyup(){
                  obj.quantity = this.value;
                }
              }),
              x('textarea', {
                id: 'nnotes',
                rows: '5',
                class:'form-control mb-2',
                type: 'text',
                placeholder: 'Notes...',
                onkeyup(){
                  obj.notes = this.value;
                }
              }),
              x('p', {id: 'txterror'}),
              x('p', {id: 'txtsuccess'})
            ),
            x('div', {class: 'card-footer text-end'},
              x('button', {
                class: 'btn btn-outline-secondary',
                type: 'button',
                onclick(){

                  if(!obj.item.length){
                    return document.getElementById('txterror').textContent = 'Invalid name length';
                  }

                  document.getElementById('txterror').textContent = '';
                  obj.id = Date.now();

                  db.addobj('shopping', obj, function(err){
                    if(err){
                      console.log(err);
                      return;
                    }

                    let arr = ['nitem', 'ncategory', 'nlocation', 'nprice', 'nquantity', 'nnotes'];

                    document.getElementById('txtsuccess').textContent = 'New item added!';

                    items.prepend(
                      tpl.shoppingitem(obj, db, true)
                    );

                    for (var i = 0; i < arr.length; i++) {
                      document.getElementById(arr[i]).value = '';
                    }

                    obj = {item: '', category: '', location: '', price: '', quantity: '', notes: ''};

                    setTimeout(function(){
                      document.getElementById('txtsuccess').textContent = '';
                    },3000);

                  });

                }
              }, 'Submit')
            )
          )
        ),
        x('div', {id: 'listdiv', class: 'hidden'}, items),
        x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['shopping','item','shoppingitem']))
      );

      return item;
    },
    about(stream, data){
      let item = x('div', x('p', data.msg));

      return item;
    },
    settings(stream, data){
      let item = x('div',
        x('h3', {class: 'mt-4'}, 'Settings'),
        x('hr'),
        x('h4', {class:' mt-3 mb-3'}, 'Navigation hide'),
        x('p', 'Use these setting to hide navigation links from view. Your data will not be altered.'),
        x('div',
          function(){
            let ele = x('div');
            let arr = ls.get('nav');
            if(!arr){
              ls.set('nav', []);
              arr = [];
            }
            for (var i = 0; i < xdata.nav.length; i++) {
              ele.append(tpl.navswitch(ls, xdata.nav[i],arr));
            }
            return ele;
          }
        ),
        x('hr'),
        x('h4', {class:' mt-3 mb-3'}, 'Backup'),
        x('textarea', {
          class: 'form-control mb-2',
          rows: '5',
          disabled: 'disabled'
        }),
        x('p'),
        x('button', {
          type: 'button',
          class: 'btn btn-outline-dark w-100 mb-4',
          onclick(){
            let $this = this;
            db.get(function(err,doc){
              if(err){
                $this.previousSibling.textContent = 'Failed to fetch backup data.';
                return console.log(err)
              }
              let data = enc.text2hex(js(doc.ptext));
              $this.previousSibling.previousSibling.textContent = data;
              $this.previousSibling.textContent = 'Backup data found.';
            });
          }
        }, 'Fetch backup data'),
        x('hr'),
        x('h4', {class:' mt-3 mb-3'}, 'Restore'),
        x('textarea', {
          class: 'form-control mb-2',
          rows: '5'
        }),
        x('p'),
        x('button', {
          type: 'button',
          class: 'btn btn-outline-dark w-100 mb-4',
          onclick(){
            let $this = this,
            val = $this.previousSibling.previousSibling.value;

            try {
              val = jp(enc.hex2text(val));
            } catch (e) {
              $this.previousSibling.textContent = 'Backup restore failed. check your data.';
              return;
            }


            if(typeof val === 'object'){
              db.restore(val, function(err){
                if(err){
                  console.log(err);
                  $this.previousSibling.textContent = 'Backup restore failed. check your data.';
                } else {
                  $this.previousSibling.textContent = 'Backup data restored.';
                }
              });
            }

          }
        }, 'Add restore data'),
        x('hr'),
        x('h4', {class:' mt-3 mb-3'}, 'Reset'),
      );

      return item;
    }
  };

  let navigate = {};

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
        tpl.navbar(xdata, router),
        tpl.mainmenu(xdata, router, ls),
        tpl.appmain(app_main),
        tpl.infotab()
      ];

      xutils.build(xdata, item);
      return this;
    },
    render: function(stream, path, data, cb){
      xrender(stream, xviews[path], data, xdata[path], cb);
      return this;
    }
  });

  const xutils = {
    build(xdata, main){
      let doc = document,
      css = xdata.default.styles,
      js_head = xdata.default.js_head,
      js_body = xdata.default.js_body,
      head_args = [],
      body_args = main,
      delete_meta = xdata.default.delete_meta;

      doc.scripts.namedItem(xdata.default.base_script_name).remove();

      if(xdata.default.webmanifest){

        head_args.push(x('link', {
          href: xdata.default.webmanifest,
          rel: 'manifest'
        }));

      }

      if(css && css.length){
        for (let i = 0; i < css.length; i++) {
          head_args.push(x('link', css[i]));
        }
      }

      if(js_head && js_head.length){
        for (let i = 0; i < js_head.length; i++) {
          head_args.push(x('script', js_head[i]));
        }
      }

      doc.head.append(...head_args);

      if(js_body && js_body.length){
        for (let i = 0; i < js_body.length; i++) {
          body_args.push(x('script', js_body[i]));
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
        }, delete_meta);

      }

    },
    ls: {
      get(i) {
        return JSON.parse(localStorage.getItem(i))
      },
      set(i, e) {
        localStorage.setItem(i, JSON.stringify(e));
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
        sessionStorage.setItem(i, JSON.stringify(e));
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
      };
      if(str[1]){
        obj.params = new URLSearchParams(str[1]);
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
        i = settings.app_main;
      }
      while(i.firstChild){
        i.removeChild(i.firstChild);
      }
    },
    fetch(settings, src, options, cb){
      let cnf = settings.fetch;
      if(typeof options === 'function'){
        cb = options;
        options = cnf;
      } else {
        options = Object.assign(cnf, options);
      }

      let headers = {};
      fetch(src, options).then(function(res){
        console.log(res);
        if (res.status >= 200 && res.status < 300) {
          headers.status = res.status;
          headers.statusText = res.statusText;
          res.headers.forEach(function(x,y){
            headers[y] = x;
          });
          return res.text();
        } else {
          return Promise.reject(new Error(res.statusText))
        }
      }).then(function(data){
        let ctype = headers['content-type'],
        obj = {
          headers: headers,
          body: data
        };

        if (ctype && ctype.includes('application/json')) {
          obj.json = JSON.parse(data);
        }

        cb(false, obj);

        headers = data = null;
      }).catch(function(err){
        cb(err);
      });
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
  };

  function Router(cnf) {
    this.settings = cnf;

    let settings = this.settings,
    i = ls.get(settings.storage.prefix);
    if (!i || i === '') {
      ls.set(settings.storage.prefix, {});
    }

    let init = settings.init;
    if(init){
      this.init = settings.init;
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

      this.rout(prev, r[prev]);
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
        navigate[dest](data, stream);
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
        }    }

      let loc = location;

      data.href = loc.href;
      data.host = loc.host;
      data.path = loc.hash.slice(1);

      try {
        navigate[dest](data, stream);
        r[dest] = {
          date: Date.now() + settings.storage.max_age,
          data: data
        };

        ls.set(pf, r);
        ls.set(pf +'_prev', current);

      } catch (err) {
        if(this.settings.verbose){
          console.error(err);
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
      let settings = this.settings;
      this.routfn;

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
              r[dest].data.params = params;
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
        console.error(err);
      } finally {
        return this;
      }
    }
  };

  function Stream(){
    this.settings = defaults;
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
  };



  window.ss = xutils.ss;
  window.ls = xutils.ls;

  window.router = new Router(defaults);
  const stream = new Stream();


  window.onhashchange = function(){
    router.routfn();
  };


  globals.init().listeners().events();

  window.onload = function(){
    setTimeout(function(){
      document.documentElement.removeAttribute('style');

    },1000);

    router
    .on('/vault', function(request, stream) {
      stream.render('vault', request.data, function(err){
        if(err){return stream.renderErr();}

      });
    })
    .on('/home', function(request, stream) {
      if(utils.isLoggedIn(router, xdata)){
        stream.render('home', request.data, function(err){
          if(err){return stream.renderErr();}
        });
      }
    })
    .on('/about', function(request, stream) {
      if(utils.isLoggedIn(router, xdata)){
        stream.render('about', request.data, function(err){
          if(err){return stream.renderErr();}
        });
      }
    })
    .on('/birthdays', function(request, stream) {
      if(utils.isLoggedIn(router, xdata)){
        stream.render('birthdays', request.data, function(err){
          if(err){return stream.renderErr();}
        });
      }
    })
    .on('/business', function(request, stream) {
      if(utils.isLoggedIn(router, xdata)){
        stream.render('business', request.data, function(err){
          if(err){return stream.renderErr();}
        });
      }
    })
    .on('/bills', function(request, stream) {
      if(utils.isLoggedIn(router, xdata)){
        stream.render('bills', request.data, function(err){
          if(err){return stream.renderErr();}
        });
      }
    })
    .on('/contacts', function(request, stream) {
      if(utils.isLoggedIn(router, xdata)){
        stream.render('contacts', request.data, function(err){
          if(err){return stream.renderErr();}
        });
      }
    })
    .on('/diary', function(request, stream) {
      if(utils.isLoggedIn(router, xdata)){
        stream.render('diary', request.data, function(err){
          if(err){return stream.renderErr();}
        });
      }
    })
    .on('/emails', function(request, stream) {
      if(utils.isLoggedIn(router, xdata)){
        stream.render('emails', request.data, function(err){
          if(err){return stream.renderErr();}
        });
      }
    })
    .on('/events', function(request, stream) {
      if(utils.isLoggedIn(router, xdata)){
        stream.render('events', request.data, function(err){
          if(err){return stream.renderErr();}
        });
      }
    })
    .on('/locations', function(request, stream) {
      if(utils.isLoggedIn(router, xdata)){
        stream.render('locations', request.data, function(err){
          if(err){return stream.renderErr();}
        });
      }
    })
    .on('/notes', function(request, stream) {
      if(utils.isLoggedIn(router, xdata)){
        stream.render('notes', request.data, function(err){
          if(err){return stream.renderErr();}
        });
      }
    })
    .on('/passwords', function(request, stream) {
      if(utils.isLoggedIn(router, xdata)){
        stream.render('passwords', request.data, function(err){
          if(err){return stream.renderErr();}
        });
      }
    })
    .on('/schedule', function(request, stream) {
      if(utils.isLoggedIn(router, xdata)){
        stream.render('schedule', request.data, function(err){
          if(err){return stream.renderErr();}
        });
      }
    })
    .on('/shopping', function(request, stream) {
      if(utils.isLoggedIn(router, xdata)){
        stream.render('shopping', request.data, function(err){
          if(err){return stream.renderErr();}
        });
      }
    })
    .on('/todos', function(request, stream) {
      if(utils.isLoggedIn(router, xdata)){
        stream.render('todos', request.data, function(err){
          if(err){return stream.renderErr();}
        });
      }
    })

    .on('/settings', function(request, stream) {
      if(utils.isLoggedIn(router, xdata)){
        stream.render('settings', request.data, function(err){
          if(err){return stream.renderErr();}
        });
      }
    })
    .on('/error', function(request, stream) {
      stream.render('error', request.data, function(err){
        if(err){return console.error(err)}
      });
    })
    .init().listen().validate();
  };

  exports.xutils = xutils;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
