var Game = require('./game.js');
var rand = require('./utils.js').rand;

var gameTask = null;
var gameTimer = null;
var keyDownHandler = null; 

var second = 0;

var socket = null;

var $notification = document.querySelector('#local_area .notification');

function renderStage() {
	var $localGame = document.querySelector('#local_area .game_area');
	var $localNext = document.querySelector('#local_area .next_area');
	var $localScore = document.querySelector('#local_area .game_score');

	var game = new Game();
	// 初始化界面
	var sqSta = getSta();
	game.init({ gameArea: $localGame, nextArea: $localNext, scoreArea: $localScore }, sqSta);
	socket.emit('event', {
		evt: 'init',
		sqSta: sqSta
	});

	return game;
}

function start() {
	var game = renderStage();
	// 渲染下一个俄罗斯方块
	sqSta = getSta();
	game.turnNext(sqSta);
	socket.emit('event', {
		evt: 'next',
		sqSta: sqSta
	});

	keyDownHandler = getKeydonwFunc(game);
	launch(game);
}

function stop() {
	if (gameTask) {
		clearInterval(gameTimer);
		clearInterval(gameTask);
		window.removeEventListener('keydown', keyDownHandler);
		gameTimer = gameTask = null;
	}
}

function getSta() {
	var sqSta = {
		type: rand(1, 7),
		y: rand(0, 5),
		dir: rand(0, 3)
	};
	sqStaLog.push(sqSta);
	return sqSta;
}

function launch(game) {
	gameTask = setInterval(function() {
		if ((socket.emit('event', { evt: 'down' }), game.down())) {
		}else {
			socket.emit('event', { evt: 'fixed' });
			game.fixed();
			game.checkToClear();

			var sqSta = getSta();
			socket.emit('event', { evt: 'next', sqSta: sqSta });
			var canStop = game.turnNext(sqSta);
			canStop && (socket.emit('event', { evt: 'lose' }), gameOver());
		}
	}, MOVE_GAP);

	gameTimer = setInterval(function() {
		document.querySelector('#local_area .game_timer').innerText = ++second;
	}, 1000);
	
	window.addEventListener('keydown', keyDownHandler)
}

function gameOver() {
	$notification.innerHTML = '<span style="color:red">你输了</span>';
	document.querySelector('#remote_area .notification').innerHTML = '赢了比赛';
	stop();
}

function getKeydonwFunc(game) {
	return function (e) {
		switch (e.keyCode) {
			case 40:
				socket.emit('event', { evt: 'down'});
				game.down();
				break;
			case 37:
				socket.emit('event', { evt: 'left' });
				game.left();
				break;
			case 39:
				socket.emit('event', { evt: 'right' });
				game.right();
				break;
			case 38:
				socket.emit('event', { evt: 'rotate' });
				game.rotate();
				break;
			case 32:
				socket.emit('event', { evt: 'fall' });
				game.fall();
				break;
			default:
				break;
		}
	}
}

function init(sc) {
	socket = sc;

	socket.on('start', function () {
		start();
	});

	socket.on('lost', function () {
		$notification.innerHTML = '对方用户掉线';
		stop();
	});

	socket.on('event', function (data) {
		if(data.evt === 'lose') {
			$notification.innerHTML = '你赢了';
			stop();
		}
	});

	document.querySelector('button').addEventListener('click', stop);
}

module.exports = {
	init: init,
}