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

	game.input.setMoveCallback(this.updateMarker, this);
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
	var limitLeft	= game.world.centerX - (this.cellWidth * (this.columns / 2));
	var limitRight	= game.world.centerX + (this.cellWidth * (this.columns / 2));
	var limitUp 	= game.world.centerY - (this.cellHeight * (this.rows / 2));
	var limitDown	= game.world.centerY + (this.cellHeight * (this.rows / 2) - 1);

	if(!isMoving){
		switch(_direction){
			case 'left':
			console.log('Left: ' + limitLeft + ' Player: ' + (this.movableSprite.x - this.cellWidth));
			if (this.movableSprite.x - this.cellWidth > limitLeft){
				e.to({ x: this.movableSprite.x - this.cellWidth }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'up':
			console.log('Up: ' + limitUp + ' Player: ' + (this.movableSprite.y - this.cellHeight));
			if (this.movableSprite.y - this.cellHeight > limitUp){
				e.to({ y: this.movableSprite.y - this.cellHeight }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'right':
			console.log('Right: ' + limitRight + ' Player: ' + this.movableSprite.x + this.cellWidth);
			if (this.movableSprite.x + this.cellWidth < limitRight){
				e.to({ x: this.movableSprite.x + this.cellWidth }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'down':
			console.log('Down: ' + limitDown + ' Player: ' + this.movableSprite.y + this.cellHeight);
			if (this.movableSprite.y + this.cellHeight < limitDown){
				e.to({ y: this.movableSprite.y + this.cellHeight }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
		}
	}
};

Grid.prototype.addLayer = function (_matrix, _name,_tileset,_tilesetKeys,_tileWidth, _tileHeight, _unmovable, _enemy, __final, _collectable, _movable){
	var layer = game.add.group();
	var frameNames = this.game.cache._images[_tileset].frameData._frameNames;
	var tmpTile = {};
	var convertion = this.cellWidth/_tileWidth ;


	for (var i = _matrix.length - 1; i >= 0; i--) {
		tmpTile = {};
		if(_matrix[i] !== 0){
			var j = Math.floor( i/ (Math.pow(10, 1)) % 10);
			var k = Math.floor( i/ (Math.pow(10, 0)) % 10);

			tmpTile = game.add.sprite(k * this.cellWidth, j * this.cellHeight, _tileset);
			tmpTile.frameName = _tilesetKeys[_matrix[i]];
			tmpTile.scale.set(convertion);
			layer.add(tmpTile);
			layer.x = this.margin;
			layer.y = this.margin;

			tmpTile.anchor.setTo(0.5,0.5);
			tmpTile.x = Math.round(((tmpTile.x + this.cellWidth/2)- (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth);
			tmpTile.y = Math.round(((tmpTile.y + this.cellWidth/2)-(this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth);
			tmpTile.x -= 6;
			tmpTile.y -= 6;
			if (_matrix[i] === _movable){
				this.movableSprite = tmpTile;
			}
			//console.log( this.game.cache._images[_tileset].frameData._frameNames);
			console.log('Width: ' + this.width + ' World: ' + game.world.centerX);
		}
	}
	this.add(layer);
};

Grid.prototype.createMarker = function () {
	

	

	this.marker = game.add.graphics();
	this.changeMarkerColor(0xcc3333);
};

Grid.prototype.changeMarkerColor = function (_color) {
	this.marker.clear();
	this.marker.lineStyle(2,0xe3e3e3, 1);
	this.marker.drawRect(0, 0, this.cellWidth, this.cellHeight);
	this.marker.beginFill(_color, 0.5);
	this.marker.drawRect(0, 0, this.cellWidth, this.cellHeight);
	this.marker.endFill();
};

Grid.prototype.updateMarker = function() {
	
	var spriteCenter = this.movableSprite.x + this.movableSprite.width/2;

	this.debugS = game.add.graphics();
	this.debugS.beginFill(0xcc3333, 0.5);
	this.debugS.drawRect(0, 0, 5, 5);
	this.debugS.endFill();
	this.debugS.x = this.movableSprite.x;
	this.debugS.y = this.movableSprite.y;

	this.marker.x    = Math.round(( (game.input.activePointer.worldX - this.cellWidth/2) - (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth);
	this.marker.y    = Math.round(( (game.input.activePointer.worldY - this.cellHeight/2) - (this.margin % this.cellHeight)) / this.cellHeight) * this.cellHeight + (this.margin % this.cellHeight);
	var markerCenterX = this.marker.x - 6;
	var markerCenterY = this.marker.y - 6;

	//console.log('Marker center: ' + markerCenterY + ' SpriteCenter: ' + this.movableSprite.y + ' CellWidth: ' + this.cellWidth + ' spriteCenter2: ' + spriteCenter);  
	//console.log('Up: '		+ (markerCenterY > this.movableSprite.y - (this.cellWidth * 2)));
	/*console.log('Down: '	+ markerCenterY < this.movableSprite.y + (this.cellWidth*2));
	console.log('Left: '	+ markerCenterX > this.movableSprite.x - (this.cellWidth * 2));
	console.log('Right: '	+ markerCenterX < this.movableSprite.x + (this.cellWidth *2));*/

	/*if (markerCenterX !== this.movableSprite.x && markerCenterX > this.movableSprite.x - (this.cellWidth * 2) && markerCenterX < this.movableSprite.x + (this.cellWidth *2)){
		this.changeMarkerColor(0x529024);
	}else {
		this.changeMarkerColor(0xcc3333);
	}

	if (markerCenterY !== this.movableSprite.x && markerCenterY > this.movableSprite.y - (this.cellWidth * 2) && markerCenterY < this.movableSprite.y + (this.cellWidth*2)){
		this.changeMarkerColor(0x529024);
	}else {
		this.changeMarkerColor(0xcc3333);
	}*/

	if ((markerCenterY !== this.movableSprite.y || markerCenterX !== this.movableSprite.x) && (markerCenterY > this.movableSprite.y - (this.cellWidth * 2) && markerCenterY < this.movableSprite.y + (this.cellWidth*2)) && (markerCenterX > this.movableSprite.x - (this.cellWidth * 2) && markerCenterX < this.movableSprite.x + (this.cellWidth *2))){
		this.changeMarkerColor(0x529024);
	}else {
		this.changeMarkerColor(0xcc3333);
	}


	if (game.input.mousePointer.isDown || game.input.pointer1.isDown)
	{
		if(game.input.activePointer.worldX <= this.movableSprite.x + (this.cellWidth * 3) && game.input.activePointer.worldY <= this.movableSprite.y + (this.cellWidth * 3)  ){
			if (game.input.activePointer.worldX >= this.movableSprite.x){
				this.move(null, 'right');
			}else{
				this.move(null, 'left');
			}
		}
	}

}