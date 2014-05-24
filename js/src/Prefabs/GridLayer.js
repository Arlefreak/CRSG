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

var GridLayer = function (_game, _matrix, _type, _tileset, _tilesetKeys, _margin, _cellWidth, _cellHeight) {
    Phaser.Group.call(this, _game);
    this.game = _game;
    this.type = _type;
    this.matrix = _matrix;
    this.frameNames = [];
    this.margin = _margin;
    this.cellWidth = _cellWidth;
    this.cellHeight = _cellHeight;
    if (_tilesetKeys === null) {
        this.frameNames = _.keys(this.this.game.cache._images[_tileset].frameData._frameNames);
    } else {
        this.frameNames = _tilesetKeys;
    }

    var tmpTile = {};
    for (var i = _matrix.length - 1; i >= 0; i--) {
        tmpTile = {};
        if (_matrix[i] !== 0 && _matrix[i] !== 9) {
            var k = Math.floor(i / (Math.pow(10, 0)) % 10);
            var j = Math.floor(i / (Math.pow(10, 1)) % 10);
            var x = Math.round((((k + 1) * this.cellWidth + 10) - (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth);
            var y = Math.round((((j + 1) * this.cellHeight + 10) - (this.margin % this.cellHeight)) / this.cellHeight) * this.cellHeight + (this.margin % this.cellHeight);
            switch (_matrix[i]) {
            case 2:
                console.log('x: ' + k + ' y: ' + j);
                tmpTile = new Enemy(this.game, x, y, this.cellWidth, this.cellHeight, _tileset, i, j, k);
                tmpTile.frameName = this.frameNames[_matrix[i]];
                break;
            case 6:
                tmpTile = new Fog(this.game, x, y, this.cellWidth, this.cellHeight, i, j, k);
                break;
            default:
                tmpTile = this.game.add.sprite(x, y, _tileset);
                tmpTile.frameName = this.frameNames[_matrix[i]];
                break;
            }
            var convertion = this.cellWidth / tmpTile.width;
            tmpTile.scale.set(convertion);
            this.add(tmpTile);

            /*var debugS = this.game.add.graphics();
            debugS.beginFill(0x529024, 1.0);
            debugS.drawRect(0, 0, 10, 10);
            debugS.endFill();
            debugS.x = tmpTile.x;
            debugS.y = tmpTile.y;*/
        }
    }
};

GridLayer.prototype = Object.create(Phaser.Group.prototype);
GridLayer.prototype.constructor = GridLayer;


GridLayer.prototype.moveMatrix = function (_direction) {
    var movable = 0;
    var value = 0;
    for (var i = this.matrix.length - 1; i >= 0; i--) {
        if (this.matrix[i] !== 0 && this.matrix[i] !== 9) {
            movable = i;
            value = this.matrix[i];
        }
        this.matrix[i] = 0;
    }
    switch (_direction) {
    case 'left':
        movable--;
        break;

    case 'up':
        movable -= 10;
        break;

    case 'right':
        movable++;
        break;

    case 'down':
        movable += 10;
        break;

    case 'topleft':
        movable -= 11;
        break;

    case 'topright':
        movable -= 9;
        break;

    case 'bottomleft':
        movable += 9;
        break;

    case 'bottomright':
        movable += 11;
        break;
    }

    this.matrix[movable] = value;

    if (value === 5) {
        if (movable >= 10) {
            if (movable % 10 !== 9) {
                this.matrix[movable - 9] = 9;
            }
            if (movable % 10 !== 0) {
                this.matrix[movable - 11] = 9;
            }
            this.matrix[movable - 10] = 9;
        }

        if (movable % 10 !== 9) {
            this.matrix[movable + 1] = 9;
        }
        if (movable % 10 !== 0) {
            this.matrix[movable - 1] = 9;
        }

        if (movable < 90) {
            if (movable % 10 !== 0) {
                this.matrix[movable + 9] = 9;
            }
            if (movable % 10 !== 9) {
                this.matrix[movable + 11] = 9;
            }
            this.matrix[movable + 10] = 9;
        }
    }
}