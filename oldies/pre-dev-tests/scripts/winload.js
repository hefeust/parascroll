
var winload = function(cb) {
  if(typeof cb === 'function') {
    try {
      if(window.addEventListener) {
        window.addEventListener('load', cb, false);
      } else {
        window.attachEvent('load', cb);
      }
    } catch(err) {
      if(window['console'] && console['error']) {
        console.error('onload error');
      } else {
        alert('onload error && no console');
      }
    }
  }

  return window;
};


// winload(function() { console.log('1') });
// winload(function() { console.log('2') });
// winload(function() { console.log('3') });
