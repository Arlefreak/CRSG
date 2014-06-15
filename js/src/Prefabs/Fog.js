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

var Fog = function(_game, _x, _y, _cellWidth, _cellHeight, _i, _indexX, _indexY) {
    var pathTexture = game.add.bitmapData(_cellWidth, _cellHeight);
    pathTexture.context.fillStyle = '0x000000';
    pathTexture.context.fillRect(0, 0, _cellWidth, _cellWidth);

    Phaser.Sprite.call(this, _game, _x, _y, pathTexture);
    this.game = _game;
    this.name = 'Fog-' + _i;
    this.cellWidth = _cellWidth;
    this.cellHeight = _cellHeight;
    this.indexX = _indexX;
    this.indexY = _indexY;
    this.game.add.existing(this);
    //this.alpha = 0.5;
};

Fog.prototype = Object.create(Phaser.Sprite.prototype);
Fog.prototype.constructor = Fog;