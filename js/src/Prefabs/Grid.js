/**
* @author       Arlefreak <arlefreak@gmail.com>
*
* @overview
*
* CRSG - http://www.arlefreak.com/games/CRSG/play/
*
* v0.8.0
*
* By Mario Carballo Zama http://www.arlefreak.com
*
*	FIX: OUT OF GRID CHECK
*/

'use strict';

var Grid = function (_rows, _columns, _width, _height, _margin, _square, _draw) {
	Phaser.Group.call(this, game);
	this.rows = _rows;
	this.columns = _columns;
	this.width = _width;
	this.height = _height;
	this.margin = _margin;
	this.square = _square;
	this.draw = _draw;
	
	if(this.square){
		if (gameWidth > gameHeight){
			this.width = gameHeight;
			this.height = gameHeight;
		}else{
			this.width = gameWidth;
			this.height = gameWidth;
		}
	}

	this.cellWidth = (this.width - this.margin * 2)/this.columns;
	this.cellHeight = (this.height - this.margin * 2)/this.rows;


	if(this.draw){
		this.drawGrid();
	}
};

Grid.prototype = Object.create(Phaser.Group.prototype);
Grid.prototype.constructor = Grid;

Grid.prototype.drawGrid = function (){
	var x;
	var grid = {};
	this.bdmGrid = game.add.bitmapData(this.width,this.height);

	for (x = 0; x <= this.columns; x++) {
		this.bdmGrid.context.moveTo(x * this.cellWidth + this.margin, this.margin);
		this.bdmGrid.context.lineTo(x * this.cellWidth + this.margin, this.height - this.margin);
		console.log('Limit: ' + x * this.cellWidth + this.margin);
	}

	for (x = 0; x <= this.rows; x++) {
		this.bdmGrid.context.moveTo(this.margin, x * this.cellHeight+ this.margin);
		this.bdmGrid.context.lineTo(this.width - this.margin, x * this.cellHeight + this.margin);
	}

	this.bdmGrid.context.strokeStyle = "#e3e3e3";
	this.bdmGrid.context.lineWidth = 2;
	this.bdmGrid.context.stroke();
	grid = game.add.sprite(game.world.centerX, game.world.centerY, this.bdmGrid);
	grid.anchor.setTo(0.5, 0.5);
	this.add(grid);
}

Grid.prototype.move = function (_sprite,_direction){
	var e = game.add.tween(_sprite);
	e.onStart.add(function(){isMoving = true;});
	e.onComplete.add(function(){isMoving = false;})
	var limitLeft	= game.world.centerX - (this.cellWidth * (this.columns / 2));
	var limitRight	= game.world.centerX + (this.cellWidth * (this.columns / 2));
	var limitUp 	= game.world.centerY - (this.cellHeight * (this.rows / 2));
	var limitDown	= game.world.centerY + (this.cellHeight * (this.rows / 2) - 1);

	if(!isMoving){
		switch(_direction){
			case 'left':
			console.log('Left: ' + limitLeft + ' Player: ' + (_sprite.x - this.cellWidth));
			if (_sprite.x - this.cellWidth > limitLeft){
				e.to({ x: _sprite.x - this.cellWidth }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'up':
			console.log('Up: ' + limitUp + ' Player: ' + (_sprite.y - this.cellHeight));
			if (_sprite.y - this.cellHeight > limitUp){
				e.to({ y: _sprite.y - this.cellHeight }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'right':
			console.log('Right: ' + limitRight + ' Player: ' + _sprite.x + this.cellWidth);
			if (_sprite.x + this.cellWidth < limitRight){
				e.to({ x: _sprite.x + this.cellWidth }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'down':
			console.log('Down: ' + limitDown + ' Player: ' + _sprite.y + this.cellHeight);
			if (_sprite.y + this.cellHeight < limitDown){
				e.to({ y: _sprite.y + this.cellHeight }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
		}
	}
};
