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

var GridLayer = function (_matrix, _type,_tileset,_tilesetKeys, _margin,_cellWidth, _cellHeight) {
	Phaser.Group.call(this, game);
	this.frameNames = [];
	this.margin = _margin;
	this.cellWidth = _cellWidth;
	this.cellHeight = _cellHeight;
	if(_tilesetKeys === null){
		this.frameNames =  _.keys(this.game.cache._images[_tileset].frameData._frameNames);
	}else{
		this.frameNames =  _tilesetKeys;
	}

	var tmpTile = {};
	for (var i = _matrix.length - 1; i >= 0; i--) {
		tmpTile = {};
		if(_matrix[i] !== 0){
			var k = Math.floor( i/ (Math.pow(10, 0)) % 10);
			var j = Math.floor( i/ (Math.pow(10, 1)) % 10);
			k = Math.round((((k+1) * this.cellWidth)- (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth);
			j = Math.round((((j+ 1) * this.cellHeight)- (this.margin % this.cellHeight)) / this.cellHeight) * this.cellHeight + (this.margin % this.cellHeight);

			tmpTile = game.add.sprite(k , j, _tileset);
			tmpTile.frameName = this.frameNames[_matrix[i]];
			var convertion = this.cellWidth/tmpTile.width ;

			tmpTile.scale.set(convertion);
			this.add(tmpTile);

			/*var debugS = game.add.graphics();
			debugS.beginFill(0xcc3333, 0.5);
			debugS.drawRect(0, 0, 5, 5);
			debugS.endFill();
			debugS.x = tmpTile.x;
			debugS.y = tmpTile.y;*/

			//console.log( this.game.cache._images[_tileset].frameData._frameNames);
			//console.log('Width: ' + this.width + ' World: ' + game.world.centerX);
		}
	}
};

GridLayer.prototype = Object.create(Phaser.Group.prototype);
GridLayer.prototype.constructor = GridLayer;
