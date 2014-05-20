/*
 * Solver
 * Author: Arlefreak
 * */
'use strict';

var Solver = function (_matrixI, _matrixF, _movableX, _movableY) {
    this.open = [];
    this.close = [];
    this.moves = 0;
    this.movableX = _movableX;
    this.movableY = _movableY;
    this.matrixI = _matrixI;
    this.matrixF = _matrixF;
    var tmpNode = new SolverNode(Phaser.Utils.extend(true, [], _matrixI), null, _movableX, _movableY, null, 0, 0);
    this.open.push(tmpNode);
};

Solver.prototype.checkClosed = function (_matrix) {
    var i = 0;
    for (i = this.close.length - 1; i >= 0; i--) {
        if (this.close[i].matrix.equals(_matrix)) {
            return true;
        }
    }
    return false;
};

Solver.prototype.solve = function () {
    var count = 0;

    while (!this.open[this.open.length - 1].matrix.equals(this.matrixF) && this.open.length > 0) {
        /* nodeC the current node that is going to be evaluated */
        var nodeC = this.open.pop();
        this.close.push(Phaser.Utils.extend(true, {}, nodeC));
        this.moves++;
        //console.log('solving - ' + 'count: ' + count + ' - closed-size: ' + this.close.length + ' - positionX: ' + nodeI.movableX + ' positionY: ' + nodeI.movableY);

        /* Gen new nodes */
        this.swap(nodeC, 'left');
        this.swap(nodeC, 'up');
        this.swap(nodeC, 'right');
        this.swap(nodeC, 'down');

        /* Sort open nodes */
        this.open.sort(function (a, b) {
            if (a.totalCost > b.totalCost) {
                return -1;
            }
            if (a.totalCost < b.totalCost) {
                return 1;
            }
            return 0;
        });
    } /* end while */

    console.log('Solved!!');
    return this.open.pop();
};

Solver.prototype.swap = function (_nodeC, _direction) {
    var tmpNode = Phaser.Utils.extend(true, {}, _nodeC);
    //console.log('ValueA: ' + _nodeC.matrix[_nodeC.movableX][_nodeC.movableY] + ' x: ' + _nodeC.movableX + ' y: ' + _nodeC.movableY + ' Direction: ' + _direction);

    /* Value that is going to be moved */
    var valueA = _nodeC.matrix[_nodeC.movableX][_nodeC.movableY];
    var valueB = 0;
    var limit = false;

    /* Swap depending the direction */
    switch (_direction) {
    case 'up':
        /* Check if the new position is out of limits */
        limit = (tmpNode.movableX - 1 >= 0);
        if (limit) {
            valueB = tmpNode.matrix[tmpNode.movableX - 1][tmpNode.movableY];
            /* Check if there isn't ocupied by other game object */
            if (valueB === 0 || valueB === 9 || valueB === 5) {
                if (valueB === 5) {
                    tmpNode.matrix[tmpNode.movableX][tmpNode.movableY] = 0;
                    tmpNode.isFinal = true;
                } else {
                    tmpNode.matrix[tmpNode.movableX][tmpNode.movableY] = valueB;
                }
                tmpNode.matrix[tmpNode.movableX - 1][tmpNode.movableY] = valueA;
                tmpNode.movableX--;
            } else {
                return;
            }
        } else {
            return;
        }
        break;

    case 'down':
        limit = (tmpNode.movableX + 1 <= 9);
        if (limit) {
            valueB = tmpNode.matrix[tmpNode.movableX + 1][tmpNode.movableY];
            if (valueB === 0 || valueB === 9 || valueB === 5) {
                if (valueB === 5) {
                    tmpNode.matrix[tmpNode.movableX][tmpNode.movableY] = 0;
                    tmpNode.isFinal = true;
                } else {
                    tmpNode.matrix[tmpNode.movableX][tmpNode.movableY] = valueB;
                }
                tmpNode.matrix[tmpNode.movableX + 1][tmpNode.movableY] = valueA;
                tmpNode.movableX++;
            } else {
                return;
            }
        } else {
            return;
        }

        break;

    case 'left':
        limit = (tmpNode.movableY - 1 >= 0);
        if (limit) {
            valueB = tmpNode.matrix[tmpNode.movableX][tmpNode.movableY - 1];
            if (valueB === 0 || valueB === 9 || valueB === 5) {
                if (valueB === 5) {
                    tmpNode.matrix[tmpNode.movableX][tmpNode.movableY] = 0;
                    tmpNode.isFinal = true;
                } else {
                    tmpNode.matrix[tmpNode.movableX][tmpNode.movableY] = valueB;
                }
                tmpNode.matrix[tmpNode.movableX][tmpNode.movableY - 1] = valueA;
                tmpNode.movableY--;
            } else {
                return;
            }
        } else {
            return;
        }
        break;

    case 'right':
        limit = (tmpNode.movableY + 1 <= 9);
        if (limit) {
            valueB = tmpNode.matrix[tmpNode.movableX][tmpNode.movableY + 1];
            if (valueB === 0 || valueB === 9 || valueB === 5) {
                if (valueB === 5) {
                    tmpNode.matrix[tmpNode.movableX][tmpNode.movableY] = 0;
                    tmpNode.isFinal = true;
                } else {
                    tmpNode.matrix[tmpNode.movableX][tmpNode.movableY] = valueB;
                }
                tmpNode.matrix[tmpNode.movableX][tmpNode.movableY + 1] = valueA;
                tmpNode.movableY++;
            } else {
                return;
            }
        } else {
            return;
        }
        break;
    }

    /* Gen the node that is going to be saved*/
    tmpNode.moves++;
    var finalNode = new SolverNode(tmpNode.matrix, _nodeC, tmpNode.movableX, tmpNode.movableY, _direction, tmpNode.totalCost, tmpNode.moves);
    finalNode.isFinal = tmpNode.isFinal;
    finalNode.calcHueristic();
    finalNode.calcTotalCost();
    /* Add the node to the open list */
    if (!this.checkClosed(finalNode.matrix)) {
        this.open.push(finalNode);
    }
};