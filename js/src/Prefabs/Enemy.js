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
	this.game = _game;
	Phaser.Sprite.call(this, this.game, _x + (_cellWidth/2), _y + (_cellHeight/2), 'tiles');
	this.grid =_grid;
	this.direction = 'down';
	this.cellWidth = _cellWidth;
	this.cellHeight = _cellHeight;

	this.canMove = false;
	this.obstacleUp = false;
	this.obstacleDown = false; 
	this.obstacleLeft = false;
	this.obstacleRight = false;
	this.limitTop = false;
	this.limitBottom = false;
	this.limitRight = false;
	this.limitLeft = false;

	this.cornerX = this.x - (this.cellWidth/2);
	this.cornerY = this.y - (this.cellHeight/2);
	
	var rotate = Math.floor(Math.random()*5)+1;
	//rotate = 3;
	for (var i = rotate; i > 0; i--) {
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
	this.game.add.existing(this);

	/*this.debugW = this.game.add.graphics();
	this.debugW.beginFill(0x964514, 0.5);
	this.debugW.drawRect(0, 0, 10, 10);
	this.debugW.endFill();*/
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
	Phaser.Group.prototype.update.apply(this);
	this.cornerX = this.x - (this.cellWidth/2);
	this.cornerY = this.y - (this.cellHeight/2);
	/*this.debugW.x = this.cornerX;
	this.debugW.y = this.cornerY - this.cellHeight;*/
};

Enemy.prototype.turn = function (){
	var randomDirection = Math.random() >= 0.5;
	var randomAction = Math.random() >= 0.5;
	

	this.obstacleUp = (this.parent.parent.checkLayer(this.cornerX,this.cornerY - this.cellHeight ,1, this.parent.parent.unMovableLayers)
		|| this.parent.parent.checkLayer(this.cornerX,this.cornerY - this.cellHeight,3, this.parent.parent.finalLayers)
		|| this.parent.parent.checkLayer(this.cornerX,this.cornerY - this.cellHeight,4, this.parent.parent.collectableLayers));
	
	this.obstacleDown = (this.parent.parent.checkLayer(this.cornerX,this.cornerY + this.cellHeight,1, this.parent.parent.unMovableLayers)
		|| this.parent.parent.checkLayer(this.cornerX,this.cornerY + this.cellHeight,3, this.parent.parent.finalLayers)
		|| this.parent.parent.checkLayer(this.cornerX,this.cornerY + this.cellHeight,4, this.parent.parent.collectableLayers)
		);
	
	this.obstacleLeft = (this.parent.parent.checkLayer(this.cornerX - this.cellWidth,this.cornerY,1, this.parent.parent.unMovableLayers)
		|| this.parent.parent.checkLayer(this.cornerX - this.cellWidth,this.cornerY,3, this.parent.parent.finalLayers)
		|| this.parent.parent.checkLayer(this.cornerX - this.cellWidth,this.cornerY,4, this.parent.parent.collectableLayers)
	);
	
	this.obstacleRight = this.parent.parent.checkLayer(this.cornerX + this.cellWidth,this.cornerY,1, this.parent.parent.unMovableLayers);

	if (this.cornerX >= this.parent.parent.limitLeft + (this.cellWidth)){
		this.limitLeft = false;
	}else {
		this.limitLeft = true;
	}
	if(this.cornerX <= this.parent.parent.limitRight - (this.cellWidth*2)){
		this.limitRight = false;
	}else{
		this.limitRight = true;
	}
	if(this.cornerY >= this.parent.parent.limitTop + (this.cellWidth)){
		this.limitTop = false;
	}else{
		this.limitTop = true;
	}
	if(this.cornerY <=  this.parent.parent.limitBottom-(this.cellHeight*2))
	{
		this.limitBottom = false;
	}else{
		this.limitBottom = true;
	}
	
	console.log('wallTop: ' + this.obstacleUp + ' obstacleDown: ' + this.obstacleDown + ' obstacleLeft: ' + this.obstacleLeft + ' obstacleRight: ' + this.obstacleRight);
	console.log('wallTop: ' + this.limitTop + ' obstacleDown: ' + this.obstacleDown + ' obstacleLeft: ' + this.obstacleLeft + ' obstacleRight: ' + this.obstacleRight);

	if(this.angle === 0){
		if(this.obstacleDown || this.limitBottom){
			this.canMove = false;
		}else{this.canMove = true;}
	}else if(this.angle === 90){
		if(this.obstacleLeft || this.limitLeft){
			this.canMove = false;
		}else{this.canMove = true;}
	}else if(this.angle === -90){
		if(this.obstacleRight || this.limitRight){
			this.canMove = false;
		}else{this.canMove = true;}
	}else if(this.angle === -180){
		if(this.obstacleUp || this.limitTop){
			this.canMove = false;
		}else{this.canMove = true;}
	}

	if(this.parent.parent.checkLayer(this.cornerX,this.cornerY - this.cellHeight ,5, this.parent.parent.movableLayers)){
		this.canMove = false;
	}

	if(this.canMove){
		this.move(this.direction);
	}else{
		this.rotate(randomDirection,false);
	}
}

Enemy.prototype.rotate = function (_direction,_shield){
	var e = this.game.add.tween(this);
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