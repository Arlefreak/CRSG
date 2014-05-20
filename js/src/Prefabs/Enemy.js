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

var Enemy = function (_game,_x,_y,_cellWidth,_cellHeight,_tileset,_i,_indexX,_indexY) {
    Phaser.Sprite.call(this, _game, _x + (_cellWidth/2), _y + (_cellHeight/2), 'tiles');
    this.game = _game;

    console.log('Enemy created at x: ' + _indexX + ' y: ' + _indexY);
    this.direction = 'down';
    this.cellWidth = _cellWidth;
    this.cellHeight = _cellHeight;
    this.name = 'Enemy-' + _i;
    this.indexX = _indexX;
    this.indexY = _indexY;
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
    this.topX = this.cornerX;
    this.topY = this.cornerY - this.cellHeight;
    this.downX = this.cornerX;
    this.downY = this.cornerY + this.cellHeight;
    this.leftX = this.cornerX - this.cellWidth;
    this.leftY = this.cornerY;
    this.rightX = this.cornerX + this.cellWidth;
    this.rightY = this.cornerY; 

    var rotate = Math.floor(Math.random()*5)+1;
    //rotate = 3;
    for (var i = rotate; i > 0; i--) {
	this.angle += 90;
    }

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

    this.debugTop = this.game.add.graphics();
    this.debugDown = this.game.add.graphics();
    this.debugRight = this.game.add.graphics();
    this.debugLeft = this.game.add.graphics();

    this.debugTop.beginFill(0x964514,0.5);
    this.debugDown .beginFill(0x964514,0.5);
    this.debugRight.beginFill(0x964514,0.5);
    this.debugLeft.beginFill(0x964514,0.5);

    this.debugTop.drawRect(0,0,10,10);
    this.debugDown.drawRect(0,0,10,10);
    this.debugRight.drawRect(0,0,10,10);
    this.debugLeft.drawRect(0,0,10,10);

    this.debugTop.endFill();
    this.debugDown.endFill();
    this.debugRight.endFill();
    this.debugLeft.endFill();
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
    Phaser.Group.prototype.update.apply(this);

    /*this.debugW.x = this.cornerX;
      this.debugW.y = this.cornerY - this.cellHeight;*/

    this.debugTop.x = this.topX;
    this.debugTop.y = this.topY;
    this.debugDown.x = this.downX;
    this.debugDown.y = this.downY;
    this.debugRight.x = this.rightX;
    this.debugRight.y = this.rightY;
    this.debugLeft.x = this.leftX;
    this.debugLeft.y = this.leftY;
};

Enemy.prototype.turn = function (){
    if(this.angle === 0){
	this.direction = 'down';
    }else if(this.angle === 90){
	this.direction = 'left';
    }else if(this.angle === -90){
	this.direction = 'right';
    }else if(this.angle === -180){
	this.direction = 'up';
    }

    var masterMatrix = Phaser.Utils.extend(true,[],this.parent.parent.masterMatrix);

    masterMatrix[this.indexX][this.indexY] = 0;

    for (var i = masterMatrix.length - 1; i >= 0; i--) {
	for (var j = masterMatrix[i].length - 1; j >= 0; j--) {
	    if(masterMatrix[i][j] === 5){
		masterMatrix[i][j] = 2;
	    }
	}

    }

    console.log('New Solver x: ' + this.indexX + ' y: ' + this.indexY);
    this.solver = new Solver(this.parent.parent.masterMatrix, masterMatrix, this.indexX, this.indexY);
    var nodeSolved = this.solver.solve();
    var nodes = [];
    nodes.push(nodeSolved);
    var count = 0;
    while(nodeSolved.parent !== null){
	nodes.push(nodeSolved.parent);
	nodeSolved = nodeSolved.parent;
	count++;
	//console.log('nodeSolver: ' + count);
    }

    var desireDirection = nodes[nodes.length-2].direction;
    console.log('Direction: ' + this.direction + ' DesireDirection: ' + desireDirection);
    if(this.direction === desireDirection){
	this.indexX = nodes[nodes.length-2].movableX; 
	this.indexY = nodes[nodes.length-2].movableY; 

	this.move(desireDirection);
    }else{
	switch(desireDirection){
	    case 'up':
		if(this.direction === 'right'){
		this.rotate(false,false);
	    }else{
		this.rotate(true,false);
	    }
	    break;
	    case 'down':
		if(this.direction === 'left'){
		this.rotate(false,false);			
	    }else{
		this.rotate(false,false);
	    }
	    break;
	    case 'left':
		if(this.direction === 'down'){
		this.rotate(true,false);
	    }else{
		this.rotate(false,false);
	    }
	    break;
	    case 'right':
		if(this.direction === 'up'){
		this.rotate(true,false);
	    }else{
		this.rotate(false,false);
	    }
	    break;

	}
	//this.rotate(true,false);	
    }
    /*if(this.canMove){
      this.move(this.direction);
      }else{
      this.rotate(randomDirection,false);
      }*/
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
    this.parent.parent.move(this.parent,_direction);
}
