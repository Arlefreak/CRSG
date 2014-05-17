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

var GridLayer = function (_game,_matrix, _type,_tileset,_tilesetKeys, _margin,_cellWidth, _cellHeight) {
	Phaser.Group.call(this, _game);
	this.game = _game;
	this.frameNames = [];
	this.margin = _margin;
	this.cellWidth = _cellWidth;
	this.cellHeight = _cellHeight;
	if(_tilesetKeys === null){
		this.frameNames =  _.keys(this.this.game.cache._images[_tileset].frameData._frameNames);
	}else{
		this.frameNames =  _tilesetKeys;
	}

	var tmpTile = {};
	for (var i = _matrix.length - 1; i >= 0; i--) {
		tmpTile = {};
		if(_matrix[i] !== 0 && _matrix[i] !== 9){
			var k = Math.floor( i/ (Math.pow(10, 0)) % 10);
			var j = Math.floor( i/ (Math.pow(10, 1)) % 10);
			k = Math.round((((k+1) * this.cellWidth + 10 )- (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth);
			j = Math.round((((j+ 1) * this.cellHeight + 10)- (this.margin % this.cellHeight)) / this.cellHeight) * this.cellHeight + (this.margin % this.cellHeight);

			switch(_matrix[i]){
				case 2:
				tmpTile = new Enemy(this.game,k,j,this.cellWidth,this.cellHeight,_tileset,i);
				break;
				default:
				tmpTile = this.game.add.sprite(k , j, _tileset);
				break;
			}

			tmpTile.frameName = this.frameNames[_matrix[i]];
			var convertion = this.cellWidth/tmpTile.width ;
			tmpTile.scale.set(convertion);
			this.add(tmpTile);

			var debugS = this.game.add.graphics();
			debugS.beginFill(0x529024, 1.0);
			debugS.drawRect(0, 0, 10,10);
			debugS.endFill();
			debugS.x = tmpTile.x;
			debugS.y = tmpTile.y;

			//console.log( this.this.game.cache._images[_tileset].frameData._frameNames);
			//console.log('Width: ' + this.width + ' World: ' + this.game.world.centerX);
		}
	}
};

GridLayer.prototype = Object.create(Phaser.Group.prototype);
GridLayer.prototype.constructor = GridLayer;
