// var Square = require('./square.js');
var SquareFactory = require('./squareFactory.js');
var squareFactory = SquareFactory();

var Game = function () {

	this.gameData = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];

	this.gameWidth = this.gameData[0].length;
	this.gameHeight = this.gameData.length;

	this.scoreNode = null;
	this.score = 0;

	// 方块node二维数组
	this.game2Divs = [];
	this.next2Divs = [];

	// 方块
	this.runSq = null;
	this.nextSq = null;
}

Game.prototype = {
	constructor: Game,

	init: function (domOpts, sqSta) {
		this.nextSq = squareFactory.make(sqSta.type, sqSta.y, sqSta.dir);
		this.scoreNode = domOpts.scoreArea;

		initDiv(domOpts.gameArea, this.gameData, this.game2Divs);
		initDiv(domOpts.nextArea, this.nextSq.data, this.next2Divs);
	},

	turnNext: function (sqSta) {
		var canStop = !!0;

		this.runSq = this.nextSq;
		this.nextSq = squareFactory.make(sqSta.type, sqSta.y, sqSta.dir);
		canStop = !this.isValid(this.runSq.origin, this.runSq);

		// 判断新模块已经冲突了，置为冲突状态
		if (canStop) {
			this.runSq.becameConflict();
		}
		
		this.setSqInGame();
		refreshDiv(this.gameData, this.game2Divs);
		refreshDiv(this.nextSq.data, this.next2Divs);

		return canStop;
	},

	setSqInGame: function() {
		var x = this.runSq.origin.x;
		var y = this.runSq.origin.y;

		for(var i = 0; i < this.runSq.data.length; i++) {
			for(var j = 0; j < this.runSq.data[0].length; j++) {
				if(this.checkBorder(this.runSq.origin, i, j)) {
					this.gameData[x + i][y + j] = this.runSq.data[i][j];
				} 
			}
		}
	},

	clearSqInGame: function() {
		var x = this.runSq.origin.x;
		var y = this.runSq.origin.y;

		for(var i = 0; i < this.runSq.data.length; i++) {
			for(var j = 0; j < this.runSq.data[0].length; j++) {
				if(this.checkBorder(this.runSq.origin, i, j)) {
					this.gameData[x + i][y + j] = NONE_ST;
				}
			}
		}
	},

	down: function() {
		return this.handle(DOWN_CM);
	},

	left: function() {
		this.handle(LEFT_CM);
	},

	right: function() {
		this.handle(RIGHT_CM);
	},

	rotate: function() {
		this.handle(ROTATE_CM);
	},

	fall: function() {
		while(this.handle(DOWN_CM)) {}
	},

	handle: function(command) {
		if(this.runSq.canMove(command, this.isValid.bind(this))) {
			this.clearSqInGame();
			this.runSq.move(command);
			this.setSqInGame();
			refreshDiv(this.gameData, this.game2Divs);
			return !!1;
		} else {
			console.log('不能移动了');
			return !!0;
		}
	},

	fixed: function() {
		this.freeze();
		refreshDiv(this.gameData, this.game2Divs);
	},
	
	checkToClear: function() {
		for(var i = this.gameData.length - 1; i> 0; i--){
			if (checkDone(this.gameData[i])) {
				for(var k = i; k > 0; k--){
					this.gameData[k] = this.gameData[k - 1];
				}
				this.gameData[0].forEach(function(data) {
					data = NONE_ST;
				});
				i++;
				this.score++;		
			}
		};

		this.refreshScore();

		function checkDone(arr) {
			return arr.every(function(num) {
				return num === DONE_ST;
			})
		}
	},

	refreshScore: function() {
		this.scoreNode.innerText = this.score * 10;
	},

	checkBorder: function(origin, x, y) {
		var pos_vertical = origin.x + x;
		var pos_crosswise = origin.y + y;

		var beyondBottom = pos_vertical >= this.gameHeight;
		var beyondRight = pos_crosswise >= this.gameWidth;
		var beyondLeft = pos_crosswise < 0;
		var beyondTop = pos_vertical < 0;

		var dataX = Math.min(this.gameHeight - 1, pos_vertical);
		var dataY = Math.min(this.gameWidth - 1, pos_crosswise);
		var reachDone = this.gameData[dataX][dataY] === DONE_ST;

		if(beyondTop || beyondLeft || beyondRight || beyondBottom || reachDone){
			return !!0;
		}
		return !!1;
	},

	isValid: function(originTemp, sq) {
		for(var i = 0; i< sq.data.length; i++) {
			for(var j = 0; j< sq.data[0].length; j++) {
				if(sq.data[i][j] !== NONE_ST) {
					if(!this.checkBorder(originTemp, i, j)) {
						return false;
					}
				}
			}
		}
		return true;
	},

	freeze: function() {
		for (var i = 0; i < this.gameData.length; i++) {
			for (var j = 0; j < this.gameData[0].length; j++) {
				if (this.gameData[i][j] === RUN_ST) {
					this.gameData[i][j] = DONE_ST;
				}
			}
		}
	}
}


function initDiv(container, data, node2Arr){
	for(var i = 0; i < data.length; i++) {
		var nodeArr  = [];
		for(var j = 0; j < data[0].length; j++) {
			var $baseDiv = document.createElement('div');

			$baseDiv.className = 'none';
			$baseDiv.style.top = i * BASE_NUM + 'px';
			$baseDiv.style.left = j * BASE_NUM + 'px';

			container.appendChild($baseDiv);

			nodeArr.push($baseDiv);
		}
		node2Arr.push(nodeArr);
	}
}

function refreshDiv(data, node2Arr){
	for(var i =0; i < data.length; i++) {
		for(var j = 0; j < data[0].length; j++) {
			var curVal = data[i][j];
			var node = node2Arr[i][j];

			switch(curVal) {
				case 0:
					node.className = 'none';
					break;
				case 1:
					node.className = 'run';
					break;
				case 2:
					node.className = 'done';
					break;
				case 3:
					node.className = 'conflict';
					break;
				default:
					break;
			}
		}
	}
}

module.exports = Game;