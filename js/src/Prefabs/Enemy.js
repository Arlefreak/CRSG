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
*
*/

'use strict';

var Enemy = function (_game,_x,_y,_cellWidth,_cellHeight,_tileset,_grid) {
	Phaser.Sprite.call(this, _game, _x + (_cellWidth/2), _y + (_cellHeight/2), 'tiles');
	this.game = _game;
	this.grid =_grid;
	this.direction = 'down';
	var rotate = Math.floor(Math.random()*4)+1;

	for (var i = rotate; i >= 0; i--) {
		this.angle += 90;
	};

	if(this.angle === 0){
		this.direction = 'down';
	}else if(this.angle === 90){
		this.direction = 'left';
	}else if(this.angle === -90){
		this.direction = 'right';
	}else if(this.angle === -180){
		this.direction = 'up';
	}

	this.anchor.set(0.5,0.5);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.turn = function (){
	var randomDirection = Math.random() >= 0.5;
	var randomAction = Math.random() >= 0.5;

	if(randomAction){
		this.rotate(randomDirection,false);
	}else{
		this.move(this.direction);
	}
}

Enemy.prototype.rotate = function (_direction,_shield){
	var e = game.add.tween(this);
	var tmpAngle = this.angle;

	if(_direction){
		if(_shield){
			tmpAngle += 180;
		}else{
			tmpAngle += 90;
		}
	}else{
		if(_shield){
			tmpAngle -= 180;
		}else{
			tmpAngle -= 90;
		}
	}
	e.onStart.add(function(){playerTurn = false;});
	e.to({ angle: tmpAngle}, 500, Phaser.Easing.Linear.None, false, 0 , 0, false);
	e.start();
	e.onComplete.add(function(){playerTurn = true;});
}

Enemy.prototype.move = function (_direction){
	console.log('Direction: ' + this.direction + ' Angle: ' + this.angle);
	if(this.angle === 0){
		this.direction = 'down';
	}else if(this.angle === 90){
		this.direction = 'left';
	}else if(this.angle === -90){
		this.direction = 'right';
	}else if(this.angle === -180){
		this.direction = 'up';
	}
	console.log('Direction: ' + this.direction + ' Angle: ' + this.angle);
	this.parent.parent.move(this,this.direction,true);
}