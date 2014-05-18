/*
* Solver
* Author: Arlefreak
* */

'use strict';

Array.prototype.equals = function (array) {
	if (!array){
		return false;
	}

	if (this.length != array.length){
		return false;
	}

	for (var i = 0, l=this.length; i < l; i++) {
		if (this[i] instanceof Array && array[i] instanceof Array) {
			if (!this[i].compare(array[i])){
				return false;
			}
		}
		else if (this[i] != array[i]) {
			return false;
		}
	}
	return true;
};

var Solver = function (_matrixI, _matrixF, _movableX, _movableY) {
	this.open = [];
	this.close = [];
	this.moves = 0;
	this.movableX = _movableX;
	this.movableY = _movableY;
	this.matrixI = _matrixI;
	this.matrixF = _matrixF;
	this.open.push(Phaser.Utils.extend(true,{},_matrixI));
};

Solver.prototype.calcHueristic = function(_matrix){
	var h = 0;
	var i = 0;
	var tmpArray;

	for(var i = 0; i < _matrix.length; i++)
	{
		tmpArray = newArr.concat(_matrix[i]);
	}

	for (i = tmpArray.length - 1; i >= 0; i--) {
		if(tmpArray[i] !== 0){
			h +=  Math.abs(i - (tmpArray[i] - 1));
		}
	}

	return h;
};

Solver.prototype.calcTotalCost = function(_matrix){
	return (this.moves + calcHueristic(_matrix));
};

Solver.prototype.checkClosed = function(_matrix){
	var i = 0;
	for (i = this.close.length - 1; i >= 0; i--) {
		if (this.close[i].equals(_matrix)){
			return true;
		}
	}
	return false;
};

Solver.prototype.compare = function(a,b) {
	if (calcTotalCost(a) > calcTotalCost(b)){
		return -1;
	}
	if (calcTotalCost(a) < calcTotalCost(b)){
		return 1;
	}
	return 0;
};


Solver.prototype.solve = function(){
	var count = 0;

	while(!this.open[this.open.length - 1].equals(this.matrixF) && this.open.length > 0){
		var matrixC = this.open.pop();
		var position = 0;
		this.moves++;

		this.close.push(Phaser.Utils.extend(true,{},matrixC));

		//position = matrixC.checkPosition(0);
		this.swap(matrixC,'left');
		this.swap(matrixC,'up');
		this.swap(matrixC,'right');
		this.swap(matrixC,'down');

		this.open.sort(this.compare);

		if(this.open.length !== 0){
			this.matrixI = this.open[this.open.length - 1];
			count++;
			console.log('solving - ' + 'count: ' + count + ' - board: ' + this.open[0] + ' - closed-size: ' + this.close.length + ' - position: ' + this.movable);
		}
	}
	//this.matrixI.draw();
	console.log('Solved!!');
	console.table(this.open[this.open.length - 1]);
};

Solver.prototype.swap = function(_matrixC,_direction){
	var tmpMatrix = Phaser.Utils.extend(true,{},_matrixC);
	var arrTemp = [];
	var valueA = _matrixC[this.movableX][this.movableY];
	var valueB = 0;
	switch(_direction){
		case 'left':
		valueB = _matrixC[this.movableX - 1][this.movableY];
		if(valueB === 0 || valueB === 9){
			_matrixC[this.movableX][this.movableY] = valueB;
			_matrixC[this.movableX - 1][this.movableY] = valueA;
		}
		break;

		case 'right':
		valueB = _matrixC[this.movableX + 1][this.movableY];
		if(valueB === 0 || valueB === 9){
			_matrixC[this.movableX][this.movableY] = valueB;
			_matrixC[this.movableX + 1][this.movableY] = valueA;
		}
		break;

		case 'up':
		valueB = _matrixC[this.movableX][this.movableY - 1];
		if(valueB === 0 || valueB === 9){
			_matrixC[this.movableX][this.movableY] = valueB;
			_matrixC[this.movableX][this.movableY - 1] = valueA;
		}
		break;

		case 'down':
		valueB = _matrixC[this.movableX][this.movableY + 1];
		if(valueB === 0 || valueB === 9){
			_matrixC[this.movableX][this.movableY] = valueB;
			_matrixC[this.movableX][this.movableY + 1] = valueA;
		}
		break;
	}

	/*arrTemp = tmpMatrix.arrNumbs;
	tmpMatrix= new Board(arrTemp,_matrixC);
	tmpMatrix.moves = _matrixC.moves + 1;
	tmpMatrix.calcHueristic();
	tmpMatrix.calcTotalCost();*/


	if(!this.checkClosed(tmpMatrix)){
		this.open.push(tmpMatrix);
	}
};