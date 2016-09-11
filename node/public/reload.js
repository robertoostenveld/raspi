  var timeout = setTimeout("location.reload(true);",10000);
  function resetTimeout() {
    clearTimeout(timeout);
    timeout = setTimeout("location.reload(true);",10000);
  }
