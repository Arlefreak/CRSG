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

var Grid = function (_rows, _columns, _width, _height, _margin, _square, _draw) {
	Phaser.Group.call(this, game);
	this.rows = _rows;
	this.columns = _columns;
	this.width = _width;
	this.height = _height;
	this.margin = _margin;
	this.square = _square;
	this.draw = _draw;
	this.map = game.add.tilemap();
	this.moveTileIndex = 0;
	this.movableSprite = {};
	this.movableLayers = [];
	this.unMovableLayers = [];
	this.finalLayers = [];
	this.enemiesLayers = [];
	this.collectableLayers = [];
	this.canMove = false;
	
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

	this.limitTop =  this.margin;
	this.limitBottom = (this.cellHeight * this.rows);
	this.limitRight = (this.cellWidth * this.columns );
	this.limitLeft = this.margin;

	if(this.draw){
		this.drawGrid();
	}

	this.createMarker();
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
	grid = game.add.sprite(0, 0, this.bdmGrid);
	//grid.anchor.setTo(0.5, 0.5);
	this.add(grid);
}

Grid.prototype.move = function (_sprite,_direction){
	var e = game.add.tween(this.movableSprite);
	e.onStart.add(function(){isMoving = true;});
	e.onComplete.add(function(){isMoving = false;})
	var mLeft = Math.round(((this.movableSprite.x - this.cellWidth)- (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth);
	var mRight = Math.round(((this.movableSprite.x + this.cellWidth)- (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth);
	var mUp = Math.round(((this.movableSprite.y - this.cellWidth)- (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth);
	var mDown = Math.round(((this.movableSprite.y + this.cellWidth)- (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth);
	/*var mTopLeft = Math.round(((this.movableSprite.y + this.cellWidth)- (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth) - 6;
	var mTopRight = Math.round(((this.movableSprite.y + this.cellWidth)- (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth) - 6;
	var mBottomLeft = Math.round(((this.movableSprite.y + this.cellWidth)- (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth) - 6;
	var mBottomRight = Math.round(((this.movableSprite.y + this.cellWidth)- (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth) - 6;
	*/
	this.moveMatrix(this.movableLayers[0],_direction);

	if(!isMoving){
		switch(_direction){
			case 'left':
			//console.log('Left: ' + this.limitLeft + ' Player: ' + this.movableSprite.x + ' cellWidth: ' + this.cellWidth);
			if (this.movableSprite.x - (this.cellWidth/2) >= this.limitLeft){
				e.to({ x: mLeft }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'up':
			//console.log('Up: ' + this.limitUp + ' Player: ' + (this.movableSprite.y - this.cellHeight));
			if (this.movableSprite.y - (this.cellHeight/2) > this.limitTop){
				e.to({ y: mUp }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'right':
			//console.log('Right: ' + this.limitRight + ' Player: ' + this.movableSprite.x + this.cellWidth);
			if (this.movableSprite.x + (this.cellWidth/2) < this.limitRight){
				e.to({ x: mRight }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'down':
			//console.log('Down: ' + this.limitDown + ' Player: ' + this.movableSprite.y + this.cellHeight);
			if (this.movableSprite.y + (this.cellHeight/2) < this.limitBottom){
				e.to({ y: mDown }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'topleft':
			//console.log('Down: ' + this.limitDown + ' Player: ' + this.movableSprite.y + this.cellHeight);
			if (this.movableSprite.y + (this.cellHeight/2) < this.limitBottom){
				e.to({ x: mLeft, y: mUp }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'topright':
			//console.log('Down: ' + this.limitDown + ' Player: ' + this.movableSprite.y + this.cellHeight);
			if (this.movableSprite.y + (this.cellHeight/2) < this.limitBottom){
				e.to({ x: mRight ,y: mUp }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'bottomleft':
			//console.log('Down: ' + this.limitDown + ' Player: ' + this.movableSprite.y + this.cellHeight);
			if (this.movableSprite.y + (this.cellHeight/2) < this.limitBottom){
				e.to({ x: mLeft,y: mDown }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'bottomright':
			//console.log('Down: ' + this.limitDown + ' Player: ' + this.movableSprite.y + this.cellHeight);
			if (this.movableSprite.y + (this.cellHeight/2) < this.limitBottom){
				e.to({ x:mRight, y: mDown }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
		}
	}
};

Grid.prototype.addLayer = function (_matrix, _type,_tileset,_tilesetKeys ){
	var layer = new GridLayer(_matrix, _type,_tileset,_tilesetKeys, this.margin, this.cellWidth, this.cellHeight);
	this.add(layer);
	switch(_type){
		case 'movable':
		this.movableSprite = layer.getFirstAlive();
		this.movableLayers.push(_matrix);
		break;
		case 'unmovable':
		this.unMovableLayers.push(_matrix);
		break;
		case 'final':
		this.finalLayers.push(_matrix);
		break;
		case 'enemy':
		this.enemiesLayers.push(_matrix);
		break;
		case 'collectable':
		this.collectableLayers.push(_matrix);
		break;
	}
};

Grid.prototype.createMarker = function () {
	this.marker = game.add.graphics();
	this.changeMarkerColor(0xcc3333);

	/*this.debugS = game.add.graphics();
	this.debugS.beginFill(0xffffff, 1.0);
	this.debugS.drawRect(0, 0, 5, 5);
	this.debugS.endFill();*/
/*
	this.debugW = game.add.graphics();
	this.debugW.beginFill(0x964514, 0.5);
	this.debugW.drawRect(0, 0, this.cellWidth, this.cellHeight);
	this.debugW.endFill();*/
};

Grid.prototype.changeMarkerColor = function (_color) {
	this.marker.clear();
	this.marker.lineStyle(2,0xe3e3e3, 1);
	this.marker.drawRect(0, 0, this.cellWidth, this.cellHeight);
	this.marker.beginFill(_color, 0.5);
	this.marker.drawRect(0, 0, this.cellWidth, this.cellHeight);
	this.marker.endFill();
};

Grid.prototype.update = function() {

	this.updateMarker();
};


Grid.prototype.updateMarker = function() {
	this.canMove = false;

	/*this.debugS.x = this.marker.x;
	this.debugS.y = this.marker.y;*/

	if ((game.input.activePointer.worldX > this.limitLeft && game.input.activePointer.worldX < this.limitRight + this.margin) && (game.input.activePointer.worldY > this.limitTop && game.input.activePointer.worldY <  this.limitBottom)){
		this.marker.x    = Math.round(( (game.input.activePointer.worldX - this.cellWidth/2) - (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth);
		this.marker.y    = Math.round(( (game.input.activePointer.worldY - this.cellHeight/2) - (this.margin % this.cellHeight)) / this.cellHeight) * this.cellHeight + (this.margin % this.cellHeight);
	}

	//console.log('Marker center: ' + this.marker.y + ' SpriteCenter: ' + this.movableSprite.y + ' cellWidth: ' + this.cellWidth + ' spriteCenter2: ' + spriteCenter);  
	//console.log('Up: '		+ (this.marker.y > this.movableSprite.y - (this.cellWidth * 2)));
	/*console.log('Down: '	+ this.marker.y < this.movableSprite.y + (this.cellWidth*2));
	console.log('Left: '	+ this.marker.x > this.movableSprite.x - (this.cellWidth * 2));
	console.log('Right: '	+ this.marker.x < this.movableSprite.x + (this.cellWidth *2));*/

	/*if (!this.checkLayer(this.marker.x, this.marker.y,1,this.unMovableLayers) && !isMoving&& (this.marker.y !== this.movableSprite.y || this.marker.x !== this.movableSprite.x) && (this.marker.y > this.movableSprite.y - (this.cellWidth * 2) && this.marker.y < this.movableSprite.y + (this.cellWidth*2)) && (this.marker.x > this.movableSprite.x - (this.cellWidth * 2) && this.marker.x < this.movableSprite.x + (this.cellWidth *2))){
		this.changeMarkerColor(0x529024);
		this.canMove = true;
	}else {
		this.changeMarkerColor(0xcc3333);
		this.canMove = false;
	}*/

	if(!this.checkLayer(this.marker.x, this.marker.y,1,this.unMovableLayers) && this.checkLayer(this.marker.x, this.marker.y,9,this.movableLayers)){
		this.changeMarkerColor(0x529024);
		this.canMove = true;
	}else {
		this.changeMarkerColor(0xcc3333);
		this.canMove = false;
	}

	//this.checkLayer(this.marker.x, this.marker.y,3,this.finalLayers);
}

Grid.prototype.checkLayer = function(_x,_y,_tileID, _layers) {
	var tmpX = 0;
	var tmpY = 0;

	for (var i = _layers.length - 1; i >= 0; i--) {
		for (var J= _layers[i].length - 1; J>= 0; J--) {
			var tmpMatrix = _layers[i];
			if(tmpMatrix[J] === _tileID){
				tmpX = Math.floor( J/ (Math.pow(10, 0)) % 10);
				tmpY = Math.floor( J/ (Math.pow(10, 1)) % 10);
				
				tmpX = Math.round((((tmpX+1) * this.cellWidth)- (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth);
				tmpY = Math.round((((tmpY+1) * this.cellHeight)- (this.margin % this.cellHeight)) / this.cellHeight) * this.cellHeight + (this.margin % this.cellHeight);
				if(_x === tmpX && _y === tmpY){
					/*this.debugW.x = tmpX;
					this.debugW.y = tmpY;*/
					//console.log('Type: ' + _tileID);
					return true;
				}
			}
		}
	}
	return false;
}


Grid.prototype.collect = function(_x, _y,_layers) {
	var tmpX = 0;
	var tmpY = 0;
	for (var i = _layers.length - 1; i >= 0; i--) {
		for (var J= _layers[i].length - 1; J>= 0; J--) {
			var tmpMatrix = _layers[i];
			if(tmpMatrix[J] === 4){
				tmpX = Math.floor( J/ (Math.pow(10, 0)) % 10);
				tmpY = Math.floor( J/ (Math.pow(10, 1)) % 10);
				
				tmpX = Math.round((((tmpX+1) * this.cellWidth)- (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth);
				tmpY = Math.round((((tmpY+1) * this.cellHeight)- (this.margin % this.cellHeight)) / this.cellHeight) * this.cellHeight + (this.margin % this.cellHeight);
				if(_x === tmpX && _y === tmpY){
					/*this.debugW.x = tmpX;
					this.debugW.y = tmpY;*/
					_layers[i][J] = 0;
				}
			}
		}
	}
	return this.getAt(4).getFirstAlive();
}

Grid.prototype.moveMatrix = function(_matrix, _direction) {
	var movable = 0;
	for (var i = _matrix.length - 1; i >= 0; i--) {
		if (_matrix[i] !== 0 && _matrix !== 9){
			movable = i;
		}
		_matrix[i] = 0;
	};
	var left = false;
	var right = false;
	var up = false;
	var down = false;

	/*if(movable % 10 == 0){
		left = true;
		console.log('left');
	}
	if(movable % 9 == 0){
		left = true;
		console.log('left');
	}
	if(movable < 10){
		up = true;
		console.log('up');
	}*/
	
	console.log('Movable: ' + movable);

	switch(_direction){
		case 'left':
		_matrix[movable + 21] = 9;
		_matrix[movable + 20] = 9;
		_matrix[movable + 19] = 9;

		_matrix[movable + 9] = 9;
		_matrix[movable + 10] = 5;
		_matrix[movable + 11] = 9;

		_matrix[movable] = 9;
		_matrix[movable + 1] = 9;
		_matrix[movable - 1] = 9;
		break;

		case 'up':
		_matrix[movable - 10] = 9;
		_matrix[movable - 9] = 9;
		_matrix[movable - 8] = 9;

		_matrix[movable + 2] = 9;
		_matrix[movable + 1] = 5;
		_matrix[movable] = 9;

		_matrix[movable + 12] = 9;
		_matrix[movable + 11] = 9;
		_matrix[movable + 10] = 9;
		break;

		case 'right':
		_matrix[movable + 3] = 9;
		_matrix[movable + 2] = 9;
		_matrix[movable + 1] = 9;

		_matrix[movable + 13] = 9;
		_matrix[movable + 12] = 5;
		_matrix[movable + 11] = 9;

		_matrix[movable + 23] = 9;
		_matrix[movable + 22] = 9;
		_matrix[movable + 21] = 9;
		break;

		case 'down':
		_matrix[movable + 12] = 9;
		_matrix[movable + 11] = 9;
		_matrix[movable + 10] = 9;

		_matrix[movable + 22] = 9;
		_matrix[movable + 21] = 5;
		_matrix[movable + 20] = 9;

		_matrix[movable + 32] = 9;
		_matrix[movable + 31] = 9;
		_matrix[movable + 30] = 9;
		break;

		case 'topleft':
		_matrix[movable - 11] = 9;
		_matrix[movable - 10] = 9;
		_matrix[movable - 9] = 9;

		_matrix[movable + 1] = 9;
		_matrix[movable] = 5;
		_matrix[movable - 1] = 9;

		_matrix[movable + 11] = 9;
		_matrix[movable + 10] = 9;
		_matrix[movable + 9] = 9;
		break;

		case 'topright':
		_matrix[movable - 9] = 9;
		_matrix[movable - 8] = 9;
		_matrix[movable - 7] = 9;

		_matrix[movable + 3] = 9;
		_matrix[movable + 2] = 5;
		_matrix[movable + 1] = 9;

		_matrix[movable + 13] = 9;
		_matrix[movable + 12] = 9;
		_matrix[movable + 11] = 9;
		break;

		case 'bottomleft':
		_matrix[movable + 11] = 9;
		_matrix[movable + 10] = 9;
		_matrix[movable + 9] = 9;

		_matrix[movable + 21] = 9;
		_matrix[movable + 20] = 5;
		_matrix[movable + 19] = 9;

		_matrix[movable + 31] = 9;
		_matrix[movable + 30] = 9;
		_matrix[movable + 29] = 9;
		break;

		case 'bottomright':
		_matrix[movable + 13] = 9;
		_matrix[movable + 12] = 9;
		_matrix[movable + 11] = 9;

		_matrix[movable + 23] = 9;
		_matrix[movable + 22] = 5;
		_matrix[movable + 21] = 9;

		_matrix[movable + 33] = 9;
		_matrix[movable + 32] = 9;
		_matrix[movable + 31] = 9;
		break;
	}
}