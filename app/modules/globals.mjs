
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
    }

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
        },500)
      },3000)
    }, false);

    window.addEventListener('criterr', function (e) {

    }, false);

    return this;
  },
  events(){


    window.evt = {
      infotab(e){
        let j = new CustomEvent('infotab', {detail: e});
        window.dispatchEvent(j);

      }

    }

  }
}





export { globals }
