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

 var Enemy = function (_game, _x, _y, _cellWidth, _cellHeight, _tileset, _i, _indexX, _indexY) {
    Phaser.Sprite.call(this, _game, _x + (_cellWidth / 2), _y + (_cellHeight / 2), 'tiles');
    this.game = _game;
    this.anchor.set(0.5, 0.5);
    this.game.add.existing(this);

    this.name = 'Enemy-' + _i;
    this.cellWidth = _cellWidth;
    this.cellHeight = _cellHeight;
    this.indexX = _indexX;
    this.indexY = _indexY;

    this.direction = 'down';
    this.canMove = false;

    /* Random Rotation */
    var rotate = Math.floor(Math.random() * 5) + 1;
    for (var i = rotate; i > 0; i--) {
        this.angle += 90;
    }

    //console.log('Enemy created at x: ' + _indexX + ' y: ' + _indexY);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.turn = function () {
    /* Get current direction of the enemy*/
    if (this.angle === 0) {
        this.direction = 'down';
    } else if (this.angle === 90) {
        this.direction = 'left';
    } else if (this.angle === -90) {
        this.direction = 'right';
    } else if (this.angle === -180) {
        this.direction = 'up';
    }

    /* Final Matrix */
    var masterMatrix = Phaser.Utils.extend(true, [], this.parent.parent.masterMatrix);
    masterMatrix[this.indexX][this.indexY] = 0;

    for (var i = masterMatrix.length - 1; i >= 0; i--) {
        for (var j = masterMatrix[i].length - 1; j >= 0; j--) {
            if (masterMatrix[i][j] === 5) {
                masterMatrix[i][j] = 2;
            }
        }

    }

    /* Solver  */
    //console.log('New Solver x: ' + this.indexX + ' y: ' + this.indexY);
    this.solver = new Solver(this.parent.parent.masterMatrix, masterMatrix, this.indexX, this.indexY);
    var nodeSolved = this.solver.solve();
    var nodes = [];
    nodes.push(nodeSolved);
    while (nodeSolved.parent !== null) {
        nodes.push(nodeSolved.parent);
        nodeSolved = nodeSolved.parent;
    }

    var desireDirection = nodes[nodes.length - 2].direction;
    //console.log('Direction: ' + this.direction + ' DesireDirection: ' + desireDirection);
    
    /* Decide where to rotate*/
    if (this.direction === desireDirection) {
        this.indexX = nodes[nodes.length - 2].movableX;
        this.indexY = nodes[nodes.length - 2].movableY;
        this.move(desireDirection);
    } else {
        switch (desireDirection) {
            case 'up':
            if (this.direction === 'right') {
                this.rotate(false, false);
            } else {
                this.rotate(true, false);
            }
            break;
            case 'down':
            if (this.direction === 'left') {
                this.rotate(false, false);
            } else {
                this.rotate(false, false);
            }
            break;
            case 'left':
            if (this.direction === 'down') {
                this.rotate(true, false);
            } else {
                this.rotate(false, false);
            }
            break;
            case 'right':
            if (this.direction === 'up') {
                this.rotate(true, false);
            } else {
                this.rotate(false, false);
            }
            break;
        }
    }
}

Enemy.prototype.rotate = function (_direction, _shield) {
    var e = this.game.add.tween(this);
    var tmpAngle = this.angle;

    if (_direction) {
        if (_shield) {
            tmpAngle += 180;
        } else {
            tmpAngle += 90;
        }
    } else {
        if (_shield) {
            tmpAngle -= 180;
        } else {
            tmpAngle -= 90;
        }
    }

    e.onStart.add(function () {
        playerTurn = false;
    });

    e.to({
        angle: tmpAngle
    }, 500, Phaser.Easing.Linear.None, false, 0, 0, false);

    e.start();
    
    e.onComplete.add(function () {
        playerTurn = true;
    });
}

Enemy.prototype.move = function (_direction) {
    this.parent.parent.move(this.parent, _direction);
}