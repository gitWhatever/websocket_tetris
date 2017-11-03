var squareData = require('./squareData.js');

function Square(type, origin, dir) {
	this.dataList = JSON.parse(JSON.stringify(squareData['data' + type]));

	this.data = this.dataList[dir];

	this.origin = origin || {
		x: 0, //纵轴  
		y: 0   //横轴
	}

	// 变形次数
	this.dir = dir;
}

Square.prototype.canMove = function(type, isValid) {
	var originTemp = {
		x: this.origin.x,
		y: this.origin.y
	};
	var sq = this;

	switch(type) {
		case DOWN_CM: 
			originTemp.x = this.origin.x +1;
			break;
		case LEFT_CM:
			originTemp.y = this.origin.y - 1;
			break;
		case RIGHT_CM:
			originTemp.y = this.origin.y + 1;
			break;
		case ROTATE_CM:		
			sq = {
				data: this.dataList[(this.dir + 1) % 4]
			};
			break;
		default:
			break;
	}

	return isValid(originTemp, sq);
}



Square.prototype.move = function(type) {
	switch(type) {
		case DOWN_CM: 
			this.origin.x++;
			break;
		case LEFT_CM:
			this.origin.y--;
			break;
		case RIGHT_CM:
			this.origin.y++;
			break;
		case ROTATE_CM:
			this.data = this.dataList[(++this.dir) % 4]
			break;
		default:
			break;
	}
}

Square.prototype.becameConflict = function() {
	for(var i = 0; i<this.data.length; i++) {
		for(var j = 0; j<this.data[0].length; j++) {
			if (this.data[i][j] === RUN_ST) {
				this.data[i][j] = CONFLICT_ST;
			}
		}
	}
}

module.exports = Square;