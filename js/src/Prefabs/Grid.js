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

 var Grid = function(_game, _rows, _columns, _width, _height, _margin, _square, _draw) {
    Phaser.Group.call(this, _game);
    this.game = _game;
    this.rows = _rows;
    this.columns = _columns;
    this.WIDTH = _width;
    this.HEIGHT = _height;
    this.margin = _margin;
    this.square = _square;
    this.draw = _draw;
    this.masterMatrix = [];

    this.cleanMasterMatrix();
    this.movableSprite = {};
    this.movableLayers = [];
    this.unMovableLayers = [];
    this.finalLayers = [];
    this.fogLayers = [];
    this.enemiesLayers = [];
    this.collectableLayers = [];
    this.canMove = false;

    if (this.square) {
        if (gameWidth > gameHeight) {
            this.WIDTH = gameHeight;
            this.HEIGHT = gameHeight;
        } else {
            this.WIDTH = gameWidth;
            this.HEIGHT = gameWidth;
        }
    }

    this.cellWidth = (this.WIDTH - this.margin * 2) / this.columns;
    this.cellHeight = (this.HEIGHT - this.margin * 2) / this.rows;

    this.limitTop = this.margin;
    this.limitBottom = (this.cellHeight * this.rows) + this.margin;
    this.limitRight = (this.cellWidth * this.columns) + this.margin;
    this.limitLeft = this.margin;

    if (this.draw) {
        this.drawGrid();
    }

    this.createMarker();
};

/* Functions to extend Phaser Group*/
Grid.prototype = Object.create(Phaser.Group.prototype);
Grid.prototype.constructor = Grid;
Grid.prototype.update = function() {
    Phaser.Group.prototype.update.apply(this);
    this.updateMarker();
}

Grid.prototype.snapToGrid = function(_value, _X) {
    if (_X) {
        return Math.round((_value - (this.margin % this.cellWidth)) / this.cellWidth) * this.cellWidth + (this.margin % this.cellWidth);
    } else {
        return Math.round((_value - (this.margin % this.cellHeight)) / this.cellHeight) * this.cellHeight + (this.margin % this.cellHeight);
    }
}

Grid.prototype.cleanMasterMatrix = function() {
    for (var i = this.rows - 1; i >= 0; i--) {
        this.masterMatrix[i] = [];
        for (var j = this.columns - 1; j >= 0; j--) {
            this.masterMatrix[i][j] = 0;
        }
    }
}

Grid.prototype.updateFog = function() {
    var tmpFog = {};
    var playerIndexX = 0;
    var playerIndexY = 0;
    var i = 0;
    var j = 0;
    var playerOverlap = false;
    var playerLeft = false;
    var playerRight = false;
    var playerTop = false;
    var playerBottom = false;
    var playerLeftTop = false;
    var playerLeftBottom = false;
    var playerRightTop = false;
    var playerRightBottom = false;

    for (i = this.masterMatrix.length - 1; i >= 0; i--) {
        for (j = this.masterMatrix[i].length - 1; j >= 0; j--) {
            if (this.masterMatrix[i][j] === 5) {
                playerIndexX = i;
                playerIndexY = j;
            }
        }
    }

    for (i = this.fogLayers.length - 1; i >= 0; i--) {
        for (j = this.fogLayers[i].length - 1; j >= 0; j--) {
            tmpFog = this.fogLayers[i].getAt(j);
            playerOverlap = tmpFog.indexX === playerIndexX && tmpFog.indexY === playerIndexY;
            playerLeft = tmpFog.indexX === playerIndexX - 1 && tmpFog.indexY === playerIndexY;
            playerRight = tmpFog.indexX === playerIndexX + 1 && tmpFog.indexY === playerIndexY;
            playerTop = tmpFog.indexX === playerIndexX && tmpFog.indexY === playerIndexY - 1;
            playerBottom = tmpFog.indexX === playerIndexX && tmpFog.indexY === playerIndexY + 1;
            playerLeftTop = tmpFog.indexX === playerIndexX - 1 && tmpFog.indexY === playerIndexY - 1;
            playerLeftBottom = tmpFog.indexX === playerIndexX - 1 && tmpFog.indexY === playerIndexY + 1;
            playerRightTop = tmpFog.indexX === playerIndexX + 1 && tmpFog.indexY === playerIndexY - 1;
            playerRightBottom = tmpFog.indexX === playerIndexX + 1 && tmpFog.indexY === playerIndexY + 1;

            if (playerOverlap || playerLeft || playerRight || playerTop || playerBottom || playerLeftTop || playerLeftBottom || playerRightTop || playerRightBottom) {
                tmpFog.kill();
            } else {
                if (!tmpFog.visible) {
                    tmpFog.revive();
                    tmpFog.alpha = 0.5;
                }
            }
        }
    }
}

Grid.prototype.updateMasterMatrix = function() {
    var tmpLayer = {};
    var tmpMatrix = [];
    this.cleanMasterMatrix();

    for (var i = this.length - 1; i >= 0; i--) {
        if (this.getAt(i).hasOwnProperty('matrix') && this.getAt(i).type !== 'fog') {
            tmpLayer = this.getAt(i);
            tmpMatrix = tmpLayer.matrix;
            for (var j = tmpMatrix.length - 1; j >= 0; j--) {
                var x = Math.floor(j / (Math.pow(10, 1)) % 10);
                var y = Math.floor(j / (Math.pow(10, 0)) % 10);
                if (tmpMatrix[j] !== 0 && tmpMatrix[j] !== 9) {
                    //console.log('x: ' + x + ' y: ' + y + ' j: ' + j + ' value: ' + tmpMatrix[j])
                    this.masterMatrix[x][y] = tmpMatrix[j];
                }
            }
        }
    }
    this.updateFog();
}

Grid.prototype.drawGrid = function() {
    var x;
    var grid = {};
    this.bdmGrid = game.add.bitmapData(this.WIDTH, this.HEIGHT);

    /* Draw vertical lines */
    for (x = 0; x <= this.columns; x++) {
        this.bdmGrid.ctx.moveTo(x * this.cellWidth + this.margin, this.margin);
        this.bdmGrid.ctx.lineTo(x * this.cellWidth + this.margin, this.HEIGHT - this.margin);
        //console.log('Limit: ' + x * this.cellWidth + this.margin);
    }

    /* Draw horizontal Lines */
    for (x = 0; x <= this.rows; x++) {
        this.bdmGrid.ctx.moveTo(this.margin, x * this.cellHeight + this.margin);
        this.bdmGrid.ctx.lineTo(this.WIDTH - this.margin, x * this.cellHeight + this.margin);
    }

    /* Define line style */
    this.bdmGrid.ctx.strokeStyle = "#e3e3e3";
    this.bdmGrid.ctx.lineWidth = 2;
    this.bdmGrid.ctx.stroke();

    /* Add the new sprite to the group */
    grid = game.add.sprite(0, 0, this.bdmGrid);
    this.add(grid);
}

Grid.prototype.move = function(_layer, _direction) {
    var tmpSprite = {};

    for (var i = _layer.length - 1; i >= 0; i--) {
        tmpSprite = _layer.getAt(i);
        var e = game.add.tween(tmpSprite);
        e.onStart.add(function() {
            isMoving = true;
        });
        e.onComplete.add(function() {
            isMoving = false;
        })

        var mLeft = 0;
        var mRight = 0;
        var mUp = 0;
        var mDown = 0;

        mLeft = tmpSprite.x - this.cellWidth;
        mRight = tmpSprite.x + this.cellWidth;
        mUp = tmpSprite.y - this.cellHeight;
        mDown = tmpSprite.y + this.cellHeight;

        if (!isMoving) {
            switch (_direction) {
                case 'left':
                if (tmpSprite.x - (this.cellWidth / 2) >= this.limitLeft) {
                    e.to({
                        x: mLeft
                    }, 250, Phaser.Easing.Linear.None, false, 0, 0, false);
                    e.start();
                }
                break;
                case 'up':
                if (tmpSprite.y - (this.cellHeight / 2) > this.limitTop) {
                    e.to({
                        y: mUp
                    }, 250, Phaser.Easing.Linear.None, false, 0, 0, false);
                    e.start();
                }
                break;
                case 'right':
                if (tmpSprite.x + (this.cellWidth / 2) < this.limitRight) {
                    e.to({
                        x: mRight
                    }, 250, Phaser.Easing.Linear.None, false, 0, 0, false);
                    e.start();
                }
                break;
                case 'down':
                if (tmpSprite.y + (this.cellHeight / 2) < this.limitBottom) {
                    e.to({
                        y: mDown
                    }, 250, Phaser.Easing.Linear.None, false, 0, 0, false);
                    e.start();
                }
                break;
                case 'topleft':
                if (tmpSprite.y + (this.cellHeight / 2) < this.limitBottom) {
                    e.to({
                        x: mLeft,
                        y: mUp
                    }, 250, Phaser.Easing.Linear.None, false, 0, 0, false);
                    e.start();
                }
                break;
                case 'topright':
                if (tmpSprite.y + (this.cellHeight / 2) < this.limitBottom) {
                    e.to({
                        x: mRight,
                        y: mUp
                    }, 250, Phaser.Easing.Linear.None, false, 0, 0, false);
                    e.start();
                }
                break;
                case 'bottomleft':
                if (tmpSprite.y + (this.cellHeight / 2) < this.limitBottom) {
                    e.to({
                        x: mLeft,
                        y: mDown
                    }, 250, Phaser.Easing.Linear.None, false, 0, 0, false);
                    e.start();
                }
                break;
                case 'bottomright':
                if (tmpSprite.y + (this.cellHeight / 2) < this.limitBottom) {
                    e.to({
                        x: mRight,
                        y: mDown
                    }, 250, Phaser.Easing.Linear.None, false, 0, 0, false);
                    e.start();
                }
                break;
            }
        }
    }
    _layer.moveMatrix(_direction);
    this.updateMasterMatrix();
};

Grid.prototype.addLayer = function(_matrix, _type, _tileset, _tilesetKeys) {
    var layer = new GridLayer(this.game, _matrix, _type, _tileset, _tilesetKeys, this.margin, this.cellWidth, this.cellHeight);
    this.add(layer);
    switch (_type) {
        case 'movable':
        this.movableSprite = layer.getFirstAlive();
        this.movableLayers.push(layer);
        break;
        case 'unmovable':
        this.unMovableLayers.push(layer);
        break;
        case 'final':
        this.finalLayers.push(layer);
        break;
        case 'enemy':
        this.enemiesLayers.push(layer);
        break;
        case 'collectable':
        this.collectableLayers.push(layer);
        break;
        case 'fog':
        this.fogLayers.push(layer);
        break;
    }
    this.updateMasterMatrix();
};

Grid.prototype.createMarker = function() {
    this.marker = game.add.graphics();
    this.changeMarkerColor(0xcc3333);
    this.marker.x = 10;
    this.marker.y = 10;

    /*this.debugS = game.add.graphics();
      this.debugS.beginFill(0xffffff, 1.0);
      this.debugS.drawRect(0, 0, 5, 5);
      this.debugS.endFill();*/

    /*this.debugW = game.add.graphics();
      this.debugW.beginFill(0x964514, 0.5);
      this.debugW.drawRect(0, 0, this.cellWidth, this.cellHeight);
      this.debugW.endFill();*/
  };

  Grid.prototype.changeMarkerColor = function(_color) {
    /* Reset graphic */
    this.marker.clear();
    /* Border style */
    this.marker.lineStyle(2, 0xe3e3e3, 1);
    /* Marker style */
    this.marker.drawRect(0, 0, this.cellWidth, this.cellHeight);
    this.marker.beginFill(_color, 0.5);
    this.marker.drawRect(0, 0, this.cellWidth, this.cellHeight);
    this.marker.endFill();
};

Grid.prototype.updateMarker = function() {
    this.canMove = false;

    /*this.debugS.x = this.marker.x;
    this.debugS.y = this.marker.y;*/

    var markerLimitLeft = game.input.activePointer.worldX > this.limitLeft;
    var markerLimitRight = game.input.activePointer.worldX < this.limitRight;
    var markerLimitTop = game.input.activePointer.worldY > this.limitTop;
    var markerLimitBottom = game.input.activePointer.worldY < this.limitBottom;
    var unMovableLayer = !this.checkLayer(this.marker.x, this.marker.y, 1, this.unMovableLayers);
    var enemyLayer = !this.checkLayer(this.marker.x, this.marker.y, 2, this.enemiesLayers);
    var movableCell = this.checkLayer(this.marker.x, this.marker.y, 9, this.movableLayers);

    if ((markerLimitLeft && markerLimitRight) && (markerLimitTop && markerLimitBottom)) {
        this.marker.x = this.snapToGrid((game.input.activePointer.worldX - this.cellWidth / 2), true);
        this.marker.y = this.snapToGrid((game.input.activePointer.worldY - this.cellHeight / 2), false);
    }

    if (unMovableLayer && movableCell && enemyLayer) {
        this.changeMarkerColor(0x529024);
        this.canMove = true;
    } else {
        this.changeMarkerColor(0xcc3333);
        this.canMove = false;
    }

}

Grid.prototype.collect = function(_x, _y, _layers, _value) {
    var tmpX = 0;
    var tmpY = 0;
    var x = this.snapToGrid(_x, true);
    var y = this.snapToGrid(_y, false);
    var tmpMatrix = [];
    var tmpSprites = [];
    for (var i = _layers.length - 1; i >= 0; i--) {
        tmpMatrix = _layers[i].matrix;
        for (var j = tmpMatrix.length - 1; j >= 0; j--) {
            if (tmpMatrix[j] === _value) {
                tmpX = Math.floor(j / (Math.pow(10, 0)) % 10);
                tmpY = Math.floor(j / (Math.pow(10, 1)) % 10);
                tmpX = this.snapToGrid(((tmpX + 1) * this.cellWidth), true);
                tmpY = this.snapToGrid(((tmpY + 1) * this.cellHeight), false);
                if (x === tmpX && y === tmpY) {
                    /*this.debugW.x = tmpX;
                    this.debugW.y = tmpY;*/
                    _layers[i].matrix[j] = 0;
                }
            }
        }
        tmpSprites.push(_layers[i].getFirstAlive());
    }
    return tmpSprites;
}

Grid.prototype.checkLayer = function(_x, _y, _tileID, _layers) {
    var tmpX = 0;
    var tmpY = 0;
    var x = this.snapToGrid(_x, true);
    var y = this.snapToGrid(_y, false);
    var tmpMatrix = [];
    for (var i = _layers.length - 1; i >= 0; i--) {
        tmpMatrix = _layers[i].matrix;
        for (var j = tmpMatrix.length - 1; j >= 0; j--) {
            if (tmpMatrix[j] === _tileID) {
                tmpX = Math.floor(j / (Math.pow(10, 0)) % 10);
                tmpY = Math.floor(j / (Math.pow(10, 1)) % 10);
                tmpX = this.snapToGrid(((tmpX + 1) * this.cellWidth), true);
                tmpY = this.snapToGrid(((tmpY + 1) * this.cellHeight), false);
                if (x === tmpX && y === tmpY) {
                    return true;
                }
            }
        }
    }
    return false;
}