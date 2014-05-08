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
	this.map = game.add.tilemap();
	this.moveTileIndex = 0;
	this.movableSprite = {};
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
	if(!isMoving){
		switch(_direction){
			case 'left':
			console.log('Left: ' + this.limitLeft + ' Player: ' + this.movableSprite.x + ' CellWidth: ' + this.cellWidth);
			if (this.movableSprite.x - (this.cellWidth/2) >= this.limitLeft){
				e.to({ x: mLeft }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'up':
			console.log('Up: ' + this.limitUp + ' Player: ' + (this.movableSprite.y - this.cellHeight));
			if (this.movableSprite.y - (this.cellHeight/2) > this.limitTop){
				e.to({ y: mUp }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'right':
			console.log('Right: ' + this.limitRight + ' Player: ' + this.movableSprite.x + this.cellWidth);
			if (this.movableSprite.x + (this.cellWidth/2) < this.limitRight){
				e.to({ x: mRight }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'down':
			console.log('Down: ' + this.limitDown + ' Player: ' + this.movableSprite.y + this.cellHeight);
			if (this.movableSprite.y + (this.cellHeight/2) < this.limitBottom){
				e.to({ y: mDown }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'topleft':
			console.log('Down: ' + this.limitDown + ' Player: ' + this.movableSprite.y + this.cellHeight);
			if (this.movableSprite.y + (this.cellHeight/2) < this.limitBottom){
				e.to({ y: mDown }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'topright':
			console.log('Down: ' + this.limitDown + ' Player: ' + this.movableSprite.y + this.cellHeight);
			if (this.movableSprite.y + (this.cellHeight/2) < this.limitBottom){
				e.to({ y: mDown }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'bottomleft':
			console.log('Down: ' + this.limitDown + ' Player: ' + this.movableSprite.y + this.cellHeight);
			if (this.movableSprite.y + (this.cellHeight/2) < this.limitBottom){
				e.to({ y: mDown }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'bottomdown':
			console.log('Down: ' + this.limitDown + ' Player: ' + this.movableSprite.y + this.cellHeight);
			if (this.movableSprite.y + (this.cellHeight/2) < this.limitBottom){
				e.to({ y: mDown }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
		}
	}
};

Grid.prototype.addLayer = function (_matrix, _name,_tileset,_tilesetKeys, _unmovable, _enemy, __final, _collectable, _movable){
	var layer = game.add.group();
	var frameNames = this.game.cache._images[_tileset].frameData._frameNames;
	var tmpTile = {};


	for (var i = _matrix.length - 1; i >= 0; i--) {
		tmpTile = {};
		if(_matrix[i] !== 0){
			var k = Math.floor( i/ (Math.pow(10, 0)) % 10);
			var j = Math.floor( i/ (Math.pow(10, 1)) % 10);
			k = Math.round((((k+1) * this.cellWidth)- (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth);
			j = Math.round((((j+ 1) * this.cellHeight)- (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth);

			tmpTile = game.add.sprite(k , j, _tileset);
			tmpTile.frameName = _tilesetKeys[_matrix[i]];
			var convertion = this.cellWidth/tmpTile.width ;

			tmpTile.scale.set(convertion);
			layer.add(tmpTile);

			if (_matrix[i] === _movable){
				this.movableSprite = tmpTile;
			}

			/*var debugS = game.add.graphics();
			debugS.beginFill(0xcc3333, 0.5);
			debugS.drawRect(0, 0, 5, 5);
			debugS.endFill();
			debugS.x = tmpTile.x;
			debugS.y = tmpTile.y;*/

			//console.log( this.game.cache._images[_tileset].frameData._frameNames);
			console.log('Width: ' + this.width + ' World: ' + game.world.centerX);
		}
	}
	this.add(layer);
};

Grid.prototype.createMarker = function () {
	this.marker = game.add.graphics();
	this.changeMarkerColor(0xcc3333);
	this.debugS = game.add.graphics();
	this.debugS.beginFill(0xffffff, 1.0);
	this.debugS.drawRect(0, 0, 5, 5);
	this.debugS.endFill();
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

	//console.log('Marker center: ' + this.marker.y + ' SpriteCenter: ' + this.movableSprite.y + ' CellWidth: ' + this.cellWidth + ' spriteCenter2: ' + spriteCenter);  
	//console.log('Up: '		+ (this.marker.y > this.movableSprite.y - (this.cellWidth * 2)));
	/*console.log('Down: '	+ this.marker.y < this.movableSprite.y + (this.cellWidth*2));
	console.log('Left: '	+ this.marker.x > this.movableSprite.x - (this.cellWidth * 2));
	console.log('Right: '	+ this.marker.x < this.movableSprite.x + (this.cellWidth *2));*/

	if ( !isMoving&& (this.marker.y !== this.movableSprite.y || this.marker.x !== this.movableSprite.x) && (this.marker.y > this.movableSprite.y - (this.cellWidth * 2) && this.marker.y < this.movableSprite.y + (this.cellWidth*2)) && (this.marker.x > this.movableSprite.x - (this.cellWidth * 2) && this.marker.x < this.movableSprite.x + (this.cellWidth *2))){
		this.changeMarkerColor(0x529024);
		this.canMove = true;
	}else {
		this.changeMarkerColor(0xcc3333);
		this.canMove = false;
	}
}