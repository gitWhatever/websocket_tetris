var Game = require('./game.js');
var socket = null;
var game = null;
var $notification = document.querySelector('#remote_area .notification');

function start(sqSta) {
    var $remoteGame = document.querySelector('#remote_area .game_area');
    var $remoteNext = document.querySelector('#remote_area .next_area');
    var $remoteScore = document.querySelector('#remote_area .game_score');

    game = new Game();
    game.init({ gameArea: $remoteGame, nextArea: $remoteNext, scoreArea: $remoteScore }, sqSta);
}

function init(sc) {
    socket = sc;

    socket.on('start', function () {
        console.log('游戏开始~');
    });

    socket.on('lost', function () {
        $notification.innerHTML = '已掉线';
        stop();
    });

    socket.on('event', function(data) {
        console.log('socket', data);
        switch(data.evt) {
            case 'init':
                start(data.sqSta);
                break;
            case 'down':
                game.down();
                break;
            case 'left':
                game.left();
                break;
            case 'right':
                game.right();
                break;
            case 'rotate':
                game.rotate();
                break;
            case 'fall':
                game.fall();
                break;
            case 'fixed':
                game.fixed();
                game.checkToClear();
                break;
            case 'next':
                game.turnNext(data.sqSta);
                break;
            case 'lose':
                $notification.innerHTML='游戏已输掉';
                break;
            default:
                break;
        }
    })
}

module.exports = {
    init: init
}