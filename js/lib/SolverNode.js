/*
 * SolverNode
 * Author: Arlefreak
 * */

'use strict';

var SolverNode = function (_matrix, _parent, _movableX, _movableY, _direction,_totalCost,_moves) {
    this.matrix = _matrix;
    this.parent = _parent;
    this.movableX = _movableX;
    this.movableY = _movableY;
    this.direction = _direction;
    this.totalCost = _totalCost;
    this.heuristic = 0;
    this.moves = _moves;
};


SolverNode.prototype.calcHueristic = function(){
    var h = 0;
    var i = 0;
    var j = 0;
    var playerIndexX = 0;
    var playerIndexY = 0;

    for (i = this.matrix.length - 1; i >= 0; i--){
	for (j = this.matrix[i].length - 1; j >= 0; j--){
	    if(this.matrix[i][j] === 5){
		playerIndexX = i;
		playerIndexY = j;
	    }
	}
    }
    h  = Math.abs(this.movableX - playerIndexX);
    h += Math.abs(this.movableY - playerIndexY);
    this.heuristic =  h;
};

SolverNode.prototype.calcTotalCost = function(){
    this.totalCost = this.moves + this.heuristic;
};


