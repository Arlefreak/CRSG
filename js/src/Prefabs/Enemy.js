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
	console.log('nodeSolver: ' + count);
    }
    var desireDirection = nodes[nodes.length-2].direction;
    console.log('DesireDirection: ' + desireDirection);
    
    /*
    var randomDirection = Math.random() >= 0.5;
    var randomAction = Math.random() >= 0.5;

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

    var wallUp = this.parent.parent.checkLayer 	 (this.topX,this.topY,1, this.parent.parent.unMovableLayers);
    var enemyUp = this.parent.parent.checkLayer 	 (this.topX,this.topY,2, this.parent.parent.enemiesLayers);
    var finalUp = this.parent.parent.checkLayer 	 (this.topX,this.topY,3, this.parent.parent.finalLayers)
    var collectableUp = this.parent.parent.checkLayer(this.topX,this.topY,4, this.parent.parent.collectableLayers);

    var wallDown = this.parent.parent.checkLayer 		(this.downX,this.downY,1, this.parent.parent.unMovableLayers);
    var enemyDown = this.parent.parent.checkLayer 		(this.downX,this.downY,2, this.parent.parent.enemiesLayers);
    var finalDown = this.parent.parent.checkLayer  		(this.downX,this.downY,3, this.parent.parent.finalLayers);
    var collectableDown = this.parent.parent.checkLayer 	(this.downX,this.downY,4, this.parent.parent.collectableLayers);

    var wallLeft = this.parent.parent.checkLayer 		(this.leftX,this.leftY,1, this.parent.parent.unMovableLayers);
    var enemyLeft = this.parent.parent.checkLayer 		(this.leftX,this.leftY,2, this.parent.parent.enemiesLayers);
    var finalLeft = this.parent.parent.checkLayer 		(this.leftX,this.leftY,3, this.parent.parent.finalLayers);
    var collecatableLeft = this.parent.parent.checkLayer 	(this.leftX,this.leftY,4, this.parent.parent.collectableLayers);

    var wallRight = this.parent.parent.checkLayer 		(this.rightX,this.rightY,1, this.parent.parent.unMovableLayers);
    var enemyRight = this.parent.parent.checkLayer 		(this.rightX,this.rightY,2, this.parent.parent.enemiesLayers);
    var finalRight = this.parent.parent.checkLayer 		(this.rightX,this.rightY,3, this.parent.parent.finalLayers);
    var collectableRight = this.parent.parent.checkLayer 	(this.rightX,this.rightY,4, this.parent.parent.collectableLayers);



    this.obstacleUp = (wallUp || enemyUp || finalUp || collectableUp);

    this.obstacleDown = (wallDown || enemyDown || finalDown	|| collectableDown);

    this.obstacleLeft = (wallLeft || enemyLeft || finalLeft || collecatableLeft);

    this.obstacleRight = ( wallRight || enemyRight || finalRight || collectableRight);

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

	var logVariables = [
	    {name:'wallUp', value: wallUp},
	    {name:'wallDown', value: wallDown},
	    {name:'wallRight', value: wallRight},
	    {name:'wallLeft', value: wallLeft},
	    {name:'enemyUp', value: enemyUp},
	    {name:'enemyDown', value: enemyDown},
	    {name:'enemyRight', value: enemyRight},
	    {name:'enemyLeft', value: enemyLeft},
	    {name:'finalUp', value: finalUp},
	    {name:'finalDown', value: finalDown},
	    {name:'finalRight', value: finalRight},
	    {name:'finalLeft', value: finalLeft},
	    {name:'collectableUp', value: collectableUp},
	    {name:'collectableDown', value: collectableDown},
	    {name:'collectableRight', value: collectableRight},
	    {name:'collecatableLeft', value: collecatableLeft},
	    {name:'obstacleUp', value: this.obstacleUp},
	    {name:'obstacleDown', value: this.obstacleDown},
	    {name:'obstacleRight', value: this.obstacleRight},
	    {name:'obstacleLeft', value: this.obstacleLeft},
	    {name:'limitTop', value: this.limitTop},
	    {name:'limitBottom', value: this.limitBottom},
	    {name:'limitRight', value: this.limitRight},
	    {name:'limitLeft', value: this.limitLeft},
	    {name:'CanMove', value: this.canMove}
	]*/

	//console.table(logVariables);
        this.move(desireDirection);
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
    if(this.angle === 0){
	this.direction = 'down';
    }else if(this.angle === 90){
	this.direction = 'left';
    }else if(this.angle === -90){
	this.direction = 'right';
    }else if(this.angle === -180){
	this.direction = 'up';
    }
    this.parent.parent.move(this.parent,_direction);
}
