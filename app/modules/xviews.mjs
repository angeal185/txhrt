import { x } from './xscript.mjs';
import { xdata } from './xdata.mjs';
import { tpl } from './tpl.mjs';
import { utils } from './utils.mjs';
import { enc, db } from './enc.mjs';




const xviews = {
  error(stream, data){
    return x('code', stream.js(data))
  },

  //views
  vault(stream, data){
    ss.del('tpm');
    ss.set('isLoggedIn', false);
    ss.set('cipher', false);


    db.checkDb(function(err,doc){
      if(err){
        db.destroy(function(err,res){
          if(err){console.log('critical error')};
          location.reload;
        })
      } else {

      }
    })

    utils.navicodisplay();


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
            id: 'su',
            class:'form-control text-center hidden',
            type: 'text',
            placeholder: 'Username (min 2, max 32)',
            maxlength: '32',
            onkeyup(){
              let $this = this;
              utils.validateInput($this, 2);
            }
          }),
          x('input', {
            id: 's0',
            class:'form-control text-center mt-3',
            type: 'password',
            placeholder: 'Password (min 8, max 32)',
            maxlength: '32',
            onkeyup(){
              let $this = this;
              utils.validateInput($this, 8);
            }
          }),
          x('input', {
            id: 'sc',
            class:'form-control text-center mt-3 hidden',
            type: 'password',
            placeholder: 'Confirm password',
            maxlength: '32',
            onkeyup(){
              let $this = this;
              utils.validateCopy($this, $this.previousSibling);
            }
          }),

          x('hr'),
          x('div', {class: 'card-title'},'Cipher'),
          x('div', {class: 'mb-4'},
            x('button', {
              class: 'btn w-100 btn-outline-dark mb-2',
              onclick(){
                ss.set('cipher', 0)
              }
            }, 'AES'),
            x('button', {
              class: 'btn w-100 btn-outline-dark mb-2',
              onclick(){
                ss.set('cipher', 1)
              }
            }, 'SERPENT'),
            x('button', {
              class: 'btn w-100 btn-outline-dark mb-2',
              onclick(){
                ss.set('cipher', 2)
              }
            }, 'TWOFISH')
          ),

          x('hr'),
          x('p', {id: 'errtxt'}),
          x('button', {
            class: 'btn w-100 btn-outline-dark',
            onclick(){
              let s0 = document.getElementById('s0'),
              obj = {
                keys: s0.value,
                cipher: ss.get('cipher')
              },
              firstrun = ss.get('firstrun'),
              arr = [],
              errtxt = document.getElementById('errtxt'),
              $this = this;

              if(obj.keys.length < 8 || obj.keys.length > 32){
                arr.push('Password');
              }

              if(firstrun){
                let su = document.getElementById('su').value,
                conf = document.getElementById('sc');

                if(su.length > 1 && su.length < 33){
                  obj.user = su;
                  console.log(obj.user)
                } else {
                  arr.push('Username');
                }

                if(conf.value !== obj.keys){
                  arr.push('Password match');
                }
              }

              if(typeof obj.cipher !== 'number'){
                arr.push('cipher');
              }

              if(arr.length){
                errtxt.textContent = 'Ivalid ' + arr.join(', ');
                return;
              }


              errtxt.textContent = '';

              obj.cipher = xdata.cipher.order[obj.cipher];

              enc.tpmSet(obj);

              db.loginDb(obj, router, function(err){
                if(err){
                  console.log(err);
                  let attempts = ls.get('attempts');
                  if(!attempts || typeof attempts !== 'number'){
                    attempts = 0;
                  }
                  attempts++

                  db.addattempt(function(err){
                    if(err){return console.log(err)}
                  })


                  ls.set('attempts', attempts);
                  errtxt.textContent = 'Invalid login details.';

                  db.fetch(function(err,doc){
                    if(err){
                      setTimeout(function(){
                        errtxt.textContent = 'DB error. resetting...';
                        db.destroy(function(err,res){
                          if(err){console.log('critical error')};
                          setTimeout(function(){
                            location.reload;
                          },500)

                        })
                      },1500)
                    } else {

                      s0.classList.remove('is-valid');
                      s0.classList.add('is-invalid');
                      s0.value = '';

                      if(doc.destruct.enabled && attempts >= doc.destruct.limit){
                        errtxt.textContent = 'Destroying DB...';
                        return db.destroy(function(err,res){
                          if(err){console.log('critical error')};
                          setTimeout(function(){
                            location.reload;
                          },500)

                        })
                      }

                      if(doc.attempts.enabled && attempts >= doc.attempts.limit){
                        let tl = doc.attempts.duration;
                        $this.setAttribute('disabled', true);

                        var tmr = setInterval(function(){
                          if(tl <= 0){
                            clearInterval(tmr);
                            errtxt.textContent = '';
                            $this.removeAttribute('disabled');
                          } else {
                            errtxt.textContent = 'Login timeout for ' + tl + 's';
                          }
                          tl -= 1;
                        }, 1000);

                      }

                      if(doc.reset.enabled && attempts >= doc.reset.limit){
                        document.getElementById('resetbtn').classList.remove('hidden');
                      }


                    }
                  })

                }
              })

            }
          }, 'Submit'),
          x('button', {
            id: 'resetbtn',
            class: 'btn w-100 btn-outline-danger mt-4 hidden',
            onclick(){
              db.destroy(function(err,res){
                if(err){console.log('critical error')};
                setTimeout(function(){
                  location.reload;
                },500)
              })
            }
          }, 'reset')
        )
      )
    );

    return item;
  },
  home(stream, data){
    let item = x('div', {class: 'row homeborder'}),
    user = item.cloneNode(true),
    items = xdata.nav,
    arr = ls.get('nav') || [];

    utils.navicodisplay(true);
    ls.set('attempts', 0);

    let hinfo = x('div', {class:'row homeborder'},
      x('h5', 'Hello '+ ss.get('user'))
    )

    for (var i = 0; i < items.length; i++) {
      if(arr.indexOf(items[i]) === -1){
        item.append(
          x('div', {class: 'col-6'},
            x('div', {
                id: items[i],
                class: 'card homecard mb-2 mt-4',
                onclick(){
                  let $this = this;
                  router.rout('/'+ $this.id, xdata[$this.id]);
                }
              },
              x('div', {class: 'card-body text-center cp'},
                x('h5', {class: 'card-title'}, items[i])
              )
            )
          )
        )
      }

    }

    return x('div', hinfo, item);
  },
  birthdays(stream, data){
    let item = x('div'),
    items = x('div');

    var obj = {name: '', birthday: '', relation: '', notes: ''};

    db.get(function(err,doc){
      if(err){return console.log(err)}

      let eles = doc.ptext.birthdays || [];

      if(eles.length){
          eles = utils.sortAlpha(eles, 'name')
      }

      for (let i = 0; i < eles.length; i++) {
        items.append(
          tpl.birthdayitem(eles[i], db)
        )
      }

    })


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
                obj.name = this.value
              }
            }),
            x('input', {
              id: 'nbirthday',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Birthdate DD/MM/YYYY',
              onkeyup(){
                obj.birthday = this.value
              }
            }),
            x('input', {
              id: 'nrelation',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Relation',
              onkeyup(){
                obj.relation = this.value
              }
            }),
            x('input', {
              id: 'nnotes',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Notes...',
              onkeyup(){
                obj.notes = this.value
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
                  )

                  for (var i = 0; i < arr.length; i++) {
                    document.getElementById(arr[i]).value = ''
                  }

                  obj = {name: '', birthday: '', relation: '', notes: ''};

                  setTimeout(function(){
                    document.getElementById('txtsuccess').textContent = '';
                  },3000)

                })

              }
            }, 'Submit')
          )
        )
      ),
      x('div', {id: 'listdiv', class: 'hidden'}, items),
      x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['birthdays','name','birthdayitem']))
    )

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
          eles = utils.sortAlpha(eles, 'name')
      }

      for (let i = 0; i < eles.length; i++) {
        items.append(
          tpl.businessitem(eles[i], db)
        )
      }

    })


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
                obj.name = this.value
              }
            }),
            x('input', {
              id: 'nphone',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Phone',
              onkeyup(){
                obj.phone = this.value
              }
            }),
            x('input', {
              id: 'nmobile',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Mobile',
              onkeyup(){
                obj.mobile = this.value
              }
            }),
            x('input', {
              id: 'nemail',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Email',
              onkeyup(){
                obj.email = this.value
              }
            }),
            x('input', {
              id: 'nurl',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'URL',
              onkeyup(){
                obj.url = this.value
              }
            }),
            x('textarea', {
              id: 'naddress',
              rows: '5',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Address',
              onkeyup(){
                obj.address = this.value
              }
            }),
            x('input', {
              id: 'nnotes',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Notes...',
              onkeyup(){
                obj.notes = this.value
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
                  )

                  for (var i = 0; i < arr.length; i++) {
                    document.getElementById(arr[i]).value = ''
                  }

                  obj = {name: '', phone: '', mobile: '', email: '', url: '', address: '', notes: ''};

                  setTimeout(function(){
                    document.getElementById('txtsuccess').textContent = '';
                  },3000)

                })

              }
            }, 'Submit')
          )
        )
      ),
      x('div', {id: 'listdiv', class: 'hidden'}, items),
      x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['business','name','businessitem']))
    )

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
        )
      }

    })


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
                obj.title = this.value
              }
            }),
            x('input', {
              id: 'ncompany',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Company',
              onkeyup(){
                obj.company = this.value
              }
            }),
            x('input', {
              id: 'nlocation',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Location',
              onkeyup(){
                obj.location = this.value
              }
            }),
            x('input', {
              id: 'nprice',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Price',
              onkeyup(){
                obj.price = this.value
              }
            }),
            x('input', {
              id: 'ndate',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Date',
              onkeyup(){
                obj.date = this.value
              }
            }),
            x('textarea', {
              id: 'nnotes',
              rows: '5',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Notes...',
              onkeyup(){
                obj.notes = this.value
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
                  )

                  for (var i = 0; i < arr.length; i++) {
                    document.getElementById(arr[i]).value = ''
                  }

                  obj = {title: '', company: '', location: '', price: '', date: '', notes: ''};

                  setTimeout(function(){
                    document.getElementById('txtsuccess').textContent = '';
                  },3000)

                })

              }
            }, 'Submit')
          )
        )
      ),
      x('div', {id: 'listdiv', class: 'hidden'}, items),
      x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['bills','title','billsitem']))
    )

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
          eles = utils.sortAlpha(eles, 'name')
      }

      for (let i = 0; i < eles.length; i++) {
        items.append(
          tpl.contactitem(eles[i], db)
        )
      }

    })


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
                obj.name = this.value
              }
            }),
            x('input', {
              id: 'nrelation',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Relation',
              onkeyup(){
                obj.relation = this.value
              }
            }),
            x('input', {
              id: 'nphone',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Phone',
              onkeyup(){
                obj.phone = this.value
              }
            }),
            x('input', {
              id: 'nmobile',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Mobile',
              onkeyup(){
                obj.mobile = this.value
              }
            }),
            x('input', {
              id: 'nemail',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Email',
              onkeyup(){
                obj.email = this.value
              }
            }),
            x('input', {
              id: 'nurl',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'URL',
              onkeyup(){
                obj.url = this.value
              }
            }),
            x('textarea', {
              id: 'naddress',
              rows: '5',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Address',
              onkeyup(){
                obj.address = this.value
              }
            }),
            x('input', {
              id: 'nnotes',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Notes...',
              onkeyup(){
                obj.notes = this.value
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
                  )

                  for (var i = 0; i < arr.length; i++) {
                    document.getElementById(arr[i]).value = ''
                  }

                  obj = {name: '', relation: '', phone: '', mobile: '', email: '', url: '', address: '', notes: ''};

                  setTimeout(function(){
                    document.getElementById('txtsuccess').textContent = '';
                  },3000)

                })

              }
            }, 'Submit')
          )
        )
      ),
      x('div', {id: 'listdiv', class: 'hidden'}, items),
      x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['contacts','name','contactitem']))
    )

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
          eles = utils.sortAlpha(eles, 'title')
      }

      for (let i = 0; i < eles.length; i++) {
        items.append(
          tpl.emailitem(eles[i], db)
        )
      }

    })


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
                obj.title = this.value
              }
            }),
            x('input', {
              id: 'nemail',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Email (required)',
              onkeyup(){
                obj.email = this.value
              }
            }),
            x('input', {
              id: 'nnotes',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Notes...',
              onkeyup(){
                obj.notes = this.value
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
                  )

                  for (var i = 0; i < arr.length; i++) {
                    document.getElementById(arr[i]).value = ''
                  }

                  obj = {title: '', email: '', notes: ''};

                  setTimeout(function(){
                    document.getElementById('txtsuccess').textContent = '';
                  },3000)

                })

              }
            }, 'Submit')
          )
        )
      ),
      x('div', {id: 'listdiv', class: 'hidden'}, items),
      x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['emails','title','emailitem']))
    )

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
          eles = utils.sortAlpha(eles, 'title')
      }

      for (let i = 0; i < eles.length; i++) {
        items.append(
          tpl.locationitem(eles[i], db)
        )
      }

    })


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
                obj.title = this.value
              }
            }),
            x('textarea', {
              id: 'naddress',
              rows: '5',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Address (required)',
              onkeyup(){
                obj.address = this.value
              }
            }),
            x('input', {
              id: 'nnotes',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Notes...',
              onkeyup(){
                obj.notes = this.value
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
                  )

                  for (var i = 0; i < arr.length; i++) {
                    document.getElementById(arr[i]).value = ''
                  }

                  obj = {title: '', address: '', notes: ''};

                  setTimeout(function(){
                    document.getElementById('txtsuccess').textContent = '';
                  },3000)

                })

              }
            }, 'Submit')
          )
        )
      ),
      x('div', {id: 'listdiv', class: 'hidden'}, items),
      x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['locations','title','locationitem']))
    )

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
          eles = utils.sortAlpha(eles, 'title')
      }

      for (let i = 0; i < eles.length; i++) {
        items.append(
          tpl.passworditem(eles[i], db)
        )
      }

    })


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
                obj.title = this.value
              }
            }),
            x('input', {
              id: 'nusername',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Username',
              onkeyup(){
                obj.username = this.value
              }
            }),
            x('div', {class: 'input-group mb-2'},
              x('input', {
                id: 'npassword',
                class:'form-control',
                type: 'password',
                placeholder: 'password',
                onkeyup(){
                  obj.password = this.value
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
                  obj.pin = this.value
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
                obj.url = this.value
              }
            }),
            x('input', {
              id: 'nnotes',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Notes...',
              onkeyup(){
                obj.notes = this.value
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
                  )

                  for (var i = 0; i < arr.length; i++) {
                    document.getElementById(arr[i]).value = ''
                  }

                  obj = {title: '', username: '', password: '', pin: '', url: '', notes: ''};

                  setTimeout(function(){
                    document.getElementById('txtsuccess').textContent = '';
                  },3000)

                })

              }
            }, 'Submit')
          )
        )
      ),
      x('div', {id: 'listdiv', class: 'hidden'}, items),
      x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['passwords','title','passworditem']))
    )

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
        )
      }


    })


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
                obj.title = this.value
              }
            }),
            x('textarea', {
              id: 'nentry',
              rows:'5',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Entry...',
              onkeyup(){
                obj.entry = this.value
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
                  )

                  for (var i = 0; i < arr.length; i++) {
                    document.getElementById(arr[i]).value = ''
                  }

                  obj = {title: '', entry: ''};

                  setTimeout(function(){
                    document.getElementById('txtsuccess').textContent = '';
                  },3000)

                })

              }
            }, 'Submit')
          )
        )
      ),
      x('div', {id: 'listdiv', class: 'hidden'}, items),
      x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['diary','title','diaryitem']))
    )

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
        )
      }


    })


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
                obj.title = this.value
              }
            }),
            x('input', {
              id: 'ntopic',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Topic',
              onkeyup(){
                obj.topic = this.value
              }
            }),
            x('textarea', {
              id: 'nentry',
              rows:'5',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Notes... (required)',
              onkeyup(){
                obj.notes = this.value
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
                  )

                  for (var i = 0; i < arr.length; i++) {
                    document.getElementById(arr[i]).value = ''
                  }

                  obj = {title: '', entry: ''};

                  setTimeout(function(){
                    document.getElementById('txtsuccess').textContent = '';
                  },3000)

                })

              }
            }, 'Submit')
          )
        )
      ),
      x('div', {id: 'listdiv', class: 'hidden'}, items),
      x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['notes','title','notesitem']))
    )

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
        )
      }


    })


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
                obj.title = this.value
              }
            }),
            x('input', {
              id: 'ntopic',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Topic',
              onkeyup(){
                obj.topic = this.value
              }
            }),
            x('input', {
              id: 'ndate',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Date due',
              onkeyup(){
                obj.date = this.value
              }
            }),
            x('textarea', {
              id: 'ntodo',
              rows:'5',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Todo... (required)',
              onkeyup(){
                obj.todo = this.value
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
                  )

                  for (var i = 0; i < arr.length; i++) {
                    document.getElementById(arr[i]).value = ''
                  }

                  obj = {title: '', topic: '', date: '', todo: ''};

                  setTimeout(function(){
                    document.getElementById('txtsuccess').textContent = '';
                  },3000)

                })

              }
            }, 'Submit')
          )
        )
      ),
      x('div', {id: 'listdiv', class: 'hidden'}, items),
      x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['todos','title','todoitem']))
    )

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
          eles = utils.sortAlpha(eles, 'title')
      }

      for (let i = 0; i < eles.length; i++) {
        items.append(
          tpl.eventitem(eles[i], db)
        )
      }


    })


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
                obj.title = this.value
              }
            }),
            x('input', {
              id: 'ndate',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Date (D/M/Y)',
              onkeyup(){
                obj.date = this.value
              }
            }),
            x('input', {
              id: 'ntime',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Time',
              onkeyup(){
                obj.time = this.value
              }
            }),
            x('input', {
              id: 'nduration',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Duration',
              onkeyup(){
                obj.duration = this.value
              }
            }),
            x('textarea', {
              id: 'npeople',
              rows:'5',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'People',
              onkeyup(){
                obj.people = this.value
              }
            }),
            x('textarea', {
              id: 'nlocation',
              rows:'5',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Location',
              onkeyup(){
                obj.location = this.value
              }
            }),
            x('textarea', {
              id: 'nrequirements',
              rows:'5',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Requirements',
              onkeyup(){
                obj.requirements = this.value
              }
            }),
            x('input', {
              id: 'nnotes',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Notes',
              onkeyup(){
                obj.notes = this.value
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
                  )

                  for (var i = 0; i < arr.length; i++) {
                    document.getElementById(arr[i]).value = ''
                  }

                  obj = {title: '', date: '', time: '', duration: '', people: '', location: '', requirements: '', notes: ''};

                  setTimeout(function(){
                    document.getElementById('txtsuccess').textContent = '';
                  },3000)

                })

              }
            }, 'Submit')
          )
        )
      ),
      x('div', {id: 'listdiv', class: 'hidden'}, items),
      x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['events','title','eventitem']))
    )

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
        )
      }


    })


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
                obj.title = this.value
              }
            }),
            x('input', {
              id: 'ncategory',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Category',
              onkeyup(){
                obj.category = this.value
              }
            }),
            x('input', {
              id: 'ndate',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Date (D/M/Y)',
              onkeyup(){
                obj.date = this.value
              }
            }),
            x('input', {
              id: 'ntime',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Time',
              onkeyup(){
                obj.time = this.value
              }
            }),
            x('input', {
              id: 'nduration',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Duration',
              onkeyup(){
                obj.duration = this.value
              }
            }),
            x('input', {
              id: 'ncontact',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Contact',
              onkeyup(){
                obj.contact = this.value
              }
            }),
            x('textarea', {
              id: 'nlocation',
              rows:'5',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Location',
              onkeyup(){
                obj.location = this.value
              }
            }),
            x('input', {
              id: 'nnotes',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Notes',
              onkeyup(){
                obj.notes = this.value
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
                  )

                  for (var i = 0; i < arr.length; i++) {
                    document.getElementById(arr[i]).value = ''
                  }

                  obj = {title: '', category: '', date: '', time: '', duration: '', contact: '', location: '', notes: ''};

                  setTimeout(function(){
                    document.getElementById('txtsuccess').textContent = '';
                  },3000)

                })

              }
            }, 'Submit')
          )
        )
      ),
      x('div', {id: 'listdiv', class: 'hidden'}, items),
      x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['schedule','title','scheduleitem']))
    )

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
        )
      }

    })


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
                obj.item = this.value
              }
            }),
            x('input', {
              id: 'ncategory',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Category',
              onkeyup(){
                obj.category = this.value
              }
            }),
            x('input', {
              id: 'nlocation',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Location',
              onkeyup(){
                obj.location = this.value
              }
            }),
            x('input', {
              id: 'nprice',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Price',
              onkeyup(){
                obj.price = this.value
              }
            }),
            x('input', {
              id: 'nquantity',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Quantity',
              onkeyup(){
                obj.quantity = this.value
              }
            }),
            x('textarea', {
              id: 'nnotes',
              rows: '5',
              class:'form-control mb-2',
              type: 'text',
              placeholder: 'Notes...',
              onkeyup(){
                obj.notes = this.value
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
                  )

                  for (var i = 0; i < arr.length; i++) {
                    document.getElementById(arr[i]).value = ''
                  }

                  obj = {item: '', category: '', location: '', price: '', quantity: '', notes: ''};

                  setTimeout(function(){
                    document.getElementById('txtsuccess').textContent = '';
                  },3000)

                })

              }
            }, 'Submit')
          )
        )
      ),
      x('div', {id: 'listdiv', class: 'hidden'}, items),
      x('div', {id: 'searchdiv', class: 'hidden'},tpl.search(db, ['shopping','item','shoppingitem']))
    )

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
            arr = []
          }
          for (var i = 0; i < xdata.nav.length; i++) {
            ele.append(tpl.navswitch(ls, xdata.nav[i],arr))
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
              $this.previousSibling.textContent = 'Failed to fetch backup data.'
              return console.log(err)
            }
            let data = enc.text2hex(js(doc.ptext));
            $this.previousSibling.previousSibling.textContent = data;
            $this.previousSibling.textContent = 'Backup data found.'
          })
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
            val = jp(enc.hex2text(val))
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
            })
          }

        }
      }, 'Add restore data'),
      x('hr'),
      x('h4', {class:' mt-3 mb-3'}, 'Reset'),
    );

    return item;
  }
}

export { xviews }
