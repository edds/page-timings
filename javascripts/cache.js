(function(){
  var cache = function(attr, value){
    if (typeof window.localStorage === 'undefined'){
      window.localStorage = {};
    }

    if(typeof value === 'undefined'){
      if(typeof window.localStorage[attr] !== 'undefined'){
        return JSON.parse(window.localStorage[attr]);
      } else {
        return;
      }
    } else if (!value){
      delete window.localStorage[attr];
    } else {
      try {
        window.localStorage[attr] = JSON.stringify(value);
      } catch (e){
        return false;
      }
    }
  };

  window.cache = cache;
}());
