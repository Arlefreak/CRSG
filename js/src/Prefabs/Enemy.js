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
    this.awake = true;
    this.game = _game;
    this.anchor.set(0.5, 0.5);
    this.game.add.existing(this);

    this.name = 'Enemy-' + _i;
    this.cellWidth = _cellWidth;
    this.cellHeight = _cellHeight;
    this.indexX = _indexX;
    this.indexY = _indexY;
    var randomColor = Math.floor(Math.random()*359)+1;
    this.colorPath = COLORS[game.math.wrapValue(randomColor, 1, 359)].rgba;

    this.direction = 'down';
    this.canMove = false;

    this.nodes = [];
    this.path = game.add.group();

    /* Random Rotation */
    var rotate = Math.floor(Math.random() * 5) + 1;
    for (var i = rotate; i > 0; i--) {
        this.angle += 90;
    }

    //console.log('Enemy created at x: ' + _indexX + ' y: ' + _indexY);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.updateDirection = function (_direction) {
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
}

Enemy.prototype.turn = function () {
    if(this.awake){
        this.nodes = [];
        this.updateDirection();

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
        this.nodes = [];
        this.nodes.push(nodeSolved);
        while (nodeSolved.parent !== null) {
            this.nodes.push(nodeSolved.parent);
            nodeSolved = nodeSolved.parent;
        }

        var desireDirection = this.nodes[this.nodes.length - 2].direction;
        //console.log('Direction: ' + this.direction + ' DesireDirection: ' + desireDirection);

        /* Decide where to rotate*/
        if (this.direction === desireDirection) {
            this.indexX = this.nodes[this.nodes.length - 2].movableX;
            this.indexY = this.nodes[this.nodes.length - 2].movableY;
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

    var ref = this;

    e.onStart.add(function () {
        playerTurn = false;
    });

    e.to({
        angle: tmpAngle
    }, 500, Phaser.Easing.Linear.None, false, 0, 0, false);

    e.start();

    e.onComplete.add(function () {
        if(!_shield){
            ref.checkPlayer();
            ref.drawPath();
        }
        playerTurn = true;
    });
}

Enemy.prototype.move = function (_direction) {
    this.parent.parent.move(this.parent, _direction);
    this.checkPlayer();
    this.drawPath();
}

Enemy.prototype.drawPath = function (_direction) {
    console.log("drawPath");
    this.path.callAll('kill');

    for (var i = this.nodes.length - 2; i > 0; i--) {
        var x = this.parent.parent.snapToGrid(((this.nodes[i].movableX + 1) * this.cellWidth + 10),true);
        var y = this.parent.parent.snapToGrid(((this.nodes[i].movableY + 1) * this.cellWidth + 10),true);
        var enough = this.path.getFirstExists(false);
        if (enough)
        {
            enough.revive();
            enough.x = (y + this.cellWidth/2) - 5;
            enough.y = (x + this.cellHeight/2) - 5;
        }else{
            var pathTexture = game.add.bitmapData(10,10);
            pathTexture.context.fillStyle = this.colorPath;
            pathTexture.context.fillRect(0,0, 50, 50);
            var tmpPath = game.add.sprite(0, 0, pathTexture);
            tmpPath.alpha = 0.4;
            tmpPath.x = (y + this.cellWidth/2) - 5;
            tmpPath.y = (x + this.cellHeight/2) - 5;
            this.path.add(tmpPath);
        }
    }
}

Enemy.prototype.checkAwake = function () {
    if(!this.awake){
        var i = 0;
        var j = 0;
        var playerPositionX = 0;
        var playerPositionY = 0;
        var top, bottom, left, right, topLeft, topRight, bottomRight, bottomLeft;

        var tmpMatrix = this.parent.parent.masterMatrix;
        for (i = tmpMatrix.length - 1; i >= 0; i--) {
            for (j = tmpMatrix[i].length - 1; j >= 0; j--) {
                if(tmpMatrix[i][j] === 5){
                    playerPositionX = i;
                    playerPositionY = j;
                }
            }
        }

        left = playerPositionX - 1 === this.indexX && playerPositionY === this.indexY;
        right = playerPositionX + 1 === this.indexX && playerPositionY === this.indexY;
        top = playerPositionY - 1 === this.indexY && playerPositionX === this.indexX;
        bottom = playerPositionX + 1 === this.indexY && playerPositionX === this.indexX;

        topLeft = playerPositionX - 1 === this.indexX && playerPositionY - 1 === this.indexY;
        topRight = playerPositionX + 1 === this.indexX && playerPositionY - 1 === this.indexY;
        bottomLeft = playerPositionX - 1 === this.indexX && playerPositionY + 1 === this.indexY;
        bottomRight = playerPositionX + 1 === this.indexX && playerPositionY + 1 === this.indexY;

        if(top || bottom || left || right || topLeft || topRight || bottomRight || bottomLeft){
            this.awake = true;
        }
    }
}

Enemy.prototype.checkPlayer = function () {
    this.updateDirection();

    console.log('CheckPlayer');
    var i = 0
    var nodesDifDirection = false;
    var directionNull = false;
    var thisDifDirection = false;

    if (this.nodes[this.nodes.length - 2].direction !== this.direction){
        return false;
    }
    for (i = this.nodes.length - 1; i > 0; i--) {
        nodesDifDirection = this.nodes[i].direction !== this.nodes[i-1].direction;
        directionNull = this.nodes[i].direction !== null;
        if(nodesDifDirection && directionNull){
            return
        }
    };
    if(powerUps > 0){
        this.rotate(true,true);
        powerUps--;
    }else{
        BUSTED = true;
    }
}