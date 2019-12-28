var child_process = require('child_process');
var express = require('express');
var app = express();

app.get('/poweroff', function (req, res) {
  console.log('Powering off...');
  res.send('Powering off...');
  child_process.exec('/usr/bin/sudo /sbin/shutdown -h now'); // [, args][, options][, callback])
});

app.get('/reboot', function (req, res) {
  console.log('Rebooting...');
  res.send('Rebooting...');
  child_process.exec('/usr/bin/sudo /sbin/shutdown -r now'); // [, args][, options][, callback])
});

app.get([], function (req, res) {
  res.status(404).send('Page not found');
  // res.send('<ul><li><a href=reboot>REBOOT</a></li><li><a href=poweroff>POWEROFF</a></li></ul>');
});

app.listen(3000, function () {
  console.log('Poweroff app listening on port 3000');
});
