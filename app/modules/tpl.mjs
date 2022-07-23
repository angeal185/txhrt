import { x } from './xscript.mjs';
import { utils } from './utils.mjs';

const tpl = {
  infotab(){

    let ele = x('div', {id: 'infotab',class: 'd-flex'},
      x('span')
    )

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
            this.parentNode.parentNode.classList.toggle('show', 'hide')
          }

        })
      ),
      x('div', {id: 'infopane', class: 'offcanvas-body'})
    )

    return ele;
  },
  navbar(xdata, router, db){

    let ele = x('nav', {id: 'navmain', class: 'navbar text-bg-dark'},
      x('div', {class: 'container-fluid justify-content-center'},
        x('div', {class: 'row'},
          x('div', {class: 'col-2'},

              x('span', {
                id: 'navbtn',
                class: 'material-icons',
                onclick(){
                  utils.menu()
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

                db.logout(function(err){
                  if(err){console.log(err)}
                  router.rout('/vault', xdata.vault);
                })

              }
            }, 'lock'),
            x('span', {
              id: 'infobtn',
              class: 'material-icons',
              onclick(){

              }
            }, 'info')
          )
        )
      )
    )

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
              utils.menu()
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
              router.rout(xdata.mainmenu[i][1], xdata[xdata.mainmenu[i][0]])
            }
          },
          x('span', {class: 'menutxt'}, xdata.mainmenu[i][0]),
          x('span', {class: 'menuico material-icons'}, 'chevron_right')
        )

        if(arr.indexOf(xdata.mainmenu[i][0]) !== -1){
          current.classList.add('hidden');
        }

        list.append(current)
    }

    ele.append(list)
    return ele;
  },
  appmain(app_main){

    let ele = x('main-view',
    x('div', {
        class: 'container'
      }, app_main)
    )

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
    )

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
            val = $this.previousSibling.value

            utils.empty(errtxt);
            utils.empty(results);

            if(val.length){

              db.get(function(err,doc){
                if(err){return console.log(err)}

                let eles = doc.ptext[arr[0]] || [],
                arr2 = [];

                for (let i = 0; i < eles.length; i++) {
                  if(eles[i][arr[1]].includes(val)){
                    arr2.push(eles[i])
                  }
                }

                if(arr2.length){
                  for (var i = 0; i < arr2.length; i++) {
                    results.append(
                      tpl[arr[2]](arr2[i], db, false, true)
                    )
                  }
                } else {
                  errtxt.textContent = 'Search returned 0 results.';
                }
              })

            } else {
              errtxt.textContent = 'Invalid search length.';
            }
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
                    console.log(err)
                    return;
                  }
                  $this.parentNode.parentNode.remove();
                })
              },
            }, 'Delete')
          }
        }
      )
    )

    if(!delbtn){
      ele.id = eles.id
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
                    console.log(err)
                    return;
                  }
                  $this.parentNode.parentNode.remove();
                })
              },
            }, 'Delete')
          }
        }
      )
    )

    if(!delbtn){
      ele.id = eles.id
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
                    console.log(err)
                    return;
                  }
                  $this.parentNode.parentNode.remove();
                })
              },
            }, 'Delete')
          }
        }
      )
    )

    if(!delbtn){
      ele.id = eles.id
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
                    console.log(err)
                    return;
                  }
                  $this.parentNode.parentNode.remove();
                })
              },
            }, 'Delete')
          }
        }
      )
    )

    if(!delbtn){
      ele.id = eles.id
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
                    console.log(err)
                    return;
                  }
                  $this.parentNode.parentNode.remove();
                })
              },
            }, 'Delete')
          }
        }
      )
    )

    if(!delbtn){
      ele.id = eles.id
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
                    console.log(err)
                    return;
                  }
                  $this.parentNode.parentNode.remove();
                })
              },
            }, 'Delete')
          }
        }
      )
    )

    if(!delbtn){
      ele.id = eles.id
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
                    console.log(err)
                    return;
                  }
                  $this.parentNode.parentNode.remove();
                })
              },
            }, 'Delete')
          }
        }
      )
    )

    if(!delbtn){
      ele.id = eles.id
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
                    console.log(err)
                    return;
                  }
                  $this.parentNode.parentNode.remove();
                })
              },
            }, 'Delete')
          }
        }
      )
    )

    if(!delbtn){
      ele.id = eles.id
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
                    console.log(err)
                    return;
                  }
                  $this.parentNode.parentNode.remove();
                })
              },
            }, 'Delete')
          }
        }
      )
    )

    if(!delbtn){
      ele.id = eles.id
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
                    console.log(err)
                    return;
                  }
                  $this.parentNode.parentNode.remove();
                })
              },
            }, 'Delete')
          }
        }
      )
    )

    if(!delbtn){
      ele.id = eles.id
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
                    console.log(err)
                    return;
                  }
                  $this.parentNode.parentNode.remove();
                })
              },
            }, 'Delete')
          }
        }
      )
    )

    if(!delbtn){
      ele.id = eles.id
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
                    console.log(err)
                    return;
                  }
                  $this.parentNode.parentNode.remove();
                })
              },
            }, 'Delete')
          }
        }
      )
    )

    if(!delbtn){
      ele.id = eles.id
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
                    console.log(err)
                    return;
                  }
                  $this.parentNode.parentNode.remove();
                })
              },
            }, 'Delete')
          }
        }
      )
    )

    if(!delbtn){
      ele.id = eles.id
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
            let $this = this,
            arr = ls.get('nav') || [];

            if(this.checked){

              arr.push(i);
              document.getElementById('lnk-'+ i).classList.add('hidden');
              ls.set('nav', arr)
            } else {
              arr = arr.filter(function(word){
                return word !== i
              })
              document.getElementById('lnk-'+ i).classList.remove('hidden');
              ls.set('nav', arr)
            }

          }
      }),
      x('label', {class: 'form-check-label'}, i)
    )

    if(e.indexOf(i) !== -1){
      ele.firstChild.setAttribute('checked', true)
    }

    return ele;
  }
}

export { tpl }
