/*
* SolverNode
* Author: Arlefreak
* */
'use strict';

var SolverNode = function (_matrix, _parent, _movableX, _movableY, _direction, _totalCost, _moves) {
    this.matrix = _matrix;
    this.parent = _parent;
    this.movableX = _movableX;
    this.movableY = _movableY;
    this.direction = _direction;
    this.totalCost = _totalCost;
    this.heuristic = 0;
    this.moves = _moves;
};


SolverNode.prototype.calcHueristic = function () {
    var h = 0;/* The new heuristic */
    var i = 0;/* Loop variable */
    var j = 0;/* Loop variable */
    
    /* Objective index */
    var playerIndexX = 0;
    var playerIndexY = 0;

    /* The index wich are going to ve evaluated */
    var initialIndex = 0;
    var finalIndex = 0;

    /* Get the player index */
    for (i = this.matrix.length - 1; i >= 0; i--) {
        for (j = this.matrix[i].length - 1; j >= 0; j--) {
            if (this.matrix[i][j] === 5) {
                playerIndexX = i;
                playerIndexY = j;
            }
        }
    }

    /* Check wich one is going to be the intial and final X index */
    if (this.movableX > playerIndexX) {
        initialIndex = playerIndexX;
        finalIndex = this.movableX;
    } else {
        initialIndex = this.movableX;
        finalIndex = playerIndexX;
    }

    /* Add the obstacles on between the two ondex */
    for (i = finalIndex; i >= initialIndex; i--) {
        if (this.matrix[i][this.movableY] !== 0 || this.matrix[i][this.movableY] !== 9) {
            h++;
        }
    }

    /* Check wich one is going to be the intial and final Y index */
    if (this.movableiY > playerIndexY) {
        initialIndex = playerIndexY;
        finalIndex = this.movableY;
    } else {
        initialIndex = this.movableY;
        finalIndex = playerIndexY;
    }

    /* Add the obstacles on between the two ondex */
    for (i = finalIndex; i >= initialIndex; i--) {
        if (this.matrix[this.movableX][i] !== 0 || this.matrix[this.movableX][i] !== 9) {
            h++;
        }
    }

    /* Add the distance between the two index */
    h += Math.abs(this.movableX - playerIndexX);
    h += Math.abs(this.movableY - playerIndexY);
    this.heuristic = h;
};

SolverNode.prototype.calcTotalCost = function () {
    this.totalCost = this.moves + this.heuristic;
};