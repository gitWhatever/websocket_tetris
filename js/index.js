require('./worth.js');
var local = require('./local.js');
var remote = require('./remote.js');

var socket = io('ws://127.0.0.1:3000');

local.init(socket);
remote.init(socket);

socket.on('waiting', function() {
    console.log('waiting~~~~');
});

