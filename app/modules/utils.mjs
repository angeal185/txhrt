
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
      i.classList.add('is-invalid')
      i.classList.remove('is-valid')
    } else {
      i.classList.remove('is-invalid')
      i.classList.add('is-valid')
    }
  },
  validateCopy(i,e){
    if(i.value !== e.value){
      i.classList.add('is-invalid')
      i.classList.remove('is-valid')
    } else {
      i.classList.remove('is-invalid')
      i.classList.add('is-valid')
    }
  },
  navicodisplay(i){
    let a = document.getElementById('navbtn'),
    b = document.getElementById('lockbtn'),
    c = document.getElementById('infobtn')
    if(i){
      c.classList.add('hidden');
      a.classList.remove('hidden');
      b.classList.remove('hidden');
    } else{
      a.classList.add('hidden');
      b.classList.add('hidden');
      c.classList.remove('hidden');
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
      document.getElementById(arr[i]).keyup()
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
}

export { utils }
