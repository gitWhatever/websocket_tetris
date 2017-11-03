require('./worth.js');
var local = require('./local.js');
var remote = require('./remote.js');

var socket = io('ws://localhost:3000');

local.init(socket);
remote.init(socket);

socket.on('waiting', function() {
    console.log('waiting~~~~');
});

