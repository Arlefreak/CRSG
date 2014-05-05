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
	var sprite = this.getAt(1).getAt(this.moveTileIndex);
	var e = game.add.tween(sprite);
	e.onStart.add(function(){isMoving = true;});
	e.onComplete.add(function(){isMoving = false;})
	var limitLeft	= game.world.centerX - (this.cellWidth * (this.columns / 2));
	var limitRight	= game.world.centerX + (this.cellWidth * (this.columns / 2));
	var limitUp 	= game.world.centerY - (this.cellHeight * (this.rows / 2));
	var limitDown	= game.world.centerY + (this.cellHeight * (this.rows / 2) - 1);

	if(!isMoving){
		switch(_direction){
			case 'left':
			console.log('Left: ' + limitLeft + ' Player: ' + (sprite.x - this.cellWidth));
			if (sprite.x - this.cellWidth > limitLeft){
				e.to({ x: sprite.x - this.cellWidth }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'up':
			console.log('Up: ' + limitUp + ' Player: ' + (sprite.y - this.cellHeight));
			if (sprite.y - this.cellHeight > limitUp){
				e.to({ y: sprite.y - this.cellHeight }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'right':
			console.log('Right: ' + limitRight + ' Player: ' + sprite.x + this.cellWidth);
			if (sprite.x + this.cellWidth < limitRight){
				e.to({ x: sprite.x + this.cellWidth }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
			}
			break;
			case 'down':
			console.log('Down: ' + limitDown + ' Player: ' + sprite.y + this.cellHeight);
			if (sprite.y + this.cellHeight < limitDown){
				e.to({ y: sprite.y + this.cellHeight }, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
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
			if (_matrix[i] === _movable){
				this.moveTileIndex = layer.length-1;
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
	var sprite = this.getAt(1).getAt(this.moveTileIndex);
	this.marker.x = game.input.activePointer.worldX - this.cellWidth/2;
	this.marker.y = game.input.activePointer.worldY - this.cellHeight/2;
	if(game.input.activePointer.worldX <= sprite.x + (this.cellWidth * 3) && game.input.activePointer.worldY <= sprite.y + (this.cellWidth * 3)  ){
		this.changeMarkerColor(0x529024);
	}else{
		this.changeMarkerColor(0xcc3333);
	}
	if (game.input.mousePointer.isDown)
	{
		if(game.input.activePointer.worldX <= sprite.x + (this.cellWidth * 3) && game.input.activePointer.worldY <= sprite.y + (this.cellWidth * 3)  ){
			if (game.input.activePointer.worldX >= sprite.x){
				this.move(null, 'right');
			}else{
				this.move(null, 'left');
			}
		}
	}

}