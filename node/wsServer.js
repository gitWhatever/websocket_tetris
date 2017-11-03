var server = require('http').createServer();
var io = require('socket.io')(server);
var userCount = 0;

clientMap = {
};

io.on('connection', function (client) {
    userCount++; 
    client.clientNumber = userCount;
    clientMap[userCount] = client;
    console.log('有用户进入了', userCount);

    if (userCount % 2 == 0) {
        client.emit('start');
        clientMap[userCount-1].emit('start');
    }else{
        client.emit('waiting');
    }

    client.on('event', function (data) { 
        console.log('接收到了event', data);
        let clientNumber = client.clientNumber;
        let toClient = null;

        if (clientNumber % 2 == 0) {
            toClient = clientMap[clientNumber - 1];
        }else {
            toClient = clientMap[clientNumber + 1];
        }

        toEmit(toClient, 'event', data);
         
    });

    client.on('disconnect', function () {
        userCount--;
        let clientNumber = client.clientNumber;
        let toClient = null;

        if (clientNumber % 2 == 0) {
            toClient = clientMap[clientNumber - 1];
        } else {
            toClient = clientMap[clientNumber + 1];
        }

        toEmit(toClient, 'lost');
        console.log('有用户退出了', userCount);
     });
});

function toEmit(client, msg, data = {}) {
    if (client) {
        client.emit(msg, data);
    }
}

server.listen(3000);