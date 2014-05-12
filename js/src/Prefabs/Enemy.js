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
	this.grid =_grid;
	this.direction = 'down';
	var rotate = Math.floor(Math.random()*4)+1;
	Phaser.Sprite.call(this, _game, _x + (_cellWidth/2), _y + (_cellHeight/2), 'tiles');
	for (var i = rotate; i >= 0; i--) {
		this.angle += 90;
		console.log('For Angle: ' + this.angle);
	};

	if(this.angle === 0 || this.angle === 360){
		this.direction = 'down';
	}else if(this.angle === 90){
		this.direction = 'right';
	}else if(this.angle === 180){
		this.direction = 'up';
	}else if(this.angle === 270){
		this.direction = 'left';
	}
	console.log('Direction: ' + this.direction + ' Angle: ' + this.angle);

	this.anchor.set(0.5,0.5);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.turn = function (){
	var randomDirection = Math.random() >= 0.5;
	var randomAction = Math.random() >= 0.5;
	randomAction = false;

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
	console.log(this.parent);
	e.onStart.add(function(){playerTurn = false;});
	e.to({ angle: tmpAngle}, 500, Phaser.Easing.Linear.None, false, 0 , 0, false);
	e.start();
	e.onComplete.add(function(){playerTurn = true;});
}

Enemy.prototype.move = function (_direction){
	this.parent.parent.move(this,_direction,true);
}