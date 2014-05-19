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
    var tmpNode = new SolverNode(Phaser.Utils.extend(true,[],_matrixI),null, _movableX, _movableY, null, 0, 0);
    this.open.push(tmpNode);
};

Solver.prototype.checkClosed = function(_matrix){
    var i = 0;
    for (i = this.close.length - 1; i >= 0; i--) {
	if (this.close[i].matrix.equals(_matrix)){
	    return true;
	}
    }
    return false;
};

Solver.prototype.solve = function(){
    var count = 0;

    while(!this.open[this.open.length - 1].matrix.equals(this.matrixF) && this.open.length > 0){
	var nodeC = this.open.pop();
	this.moves++;

	this.close.push(Phaser.Utils.extend(true,{},nodeC));

	//position = nodeC.checkPosition(0);

	if(this.open.length !== 0){
	    var nodeI = this.open[0];
	    count++;
	    console.log('solving - ' + 'count: ' + count + ' - closed-size: ' + this.close.length + ' - positionX: ' + nodeI.movableX + ' positionY: ' + nodeI.movableY);
	    //console.table(nodeI.matrix);
	}

	this.swap(nodeC,'left');
	this.swap(nodeC,'up');
	this.swap(nodeC,'right');
	this.swap(nodeC,'down');

	//this.open.sort(this.ORDER);

	this.open.sort(function(a,b){
	    if (a.calcTotalCost() > b.calcTotalCost()){
		return -1;
	    }
	    if (b.calcTotalCost(a) < b.calcTotalCost()){
		return 1;
	    }
	    return 0;
	});
	for(var i = this.open.length -1; i >= 0; i--){
		if(this.open[i].isFinal){
			console.log('IsFinal !!!');
			return this.open[i];
		}
	}

    }
    //this.nodeI.draw();
    console.log('Solved!!');
    //console.table(this.open[this.open.length - 1]);
};

Solver.prototype.swap = function(_nodeC,_direction){
    var tmpNode = Phaser.Utils.extend(true,{},_nodeC);
    console.log('ValueA: ' + _nodeC.matrix[_nodeC.movableY][_nodeC.movableX] + ' x: ' + _nodeC.movableX + ' y: ' + _nodeC.movableY);

    var valueA = _nodeC.matrix[_nodeC.movableY][_nodeC.movableX];
    var valueB = 0;
    var limit = false;
    switch(_direction){
	case 'left':
	    limit = (tmpNode.movableY - 1 >= 0);
	if(limit){
	    valueB = tmpNode.matrix[tmpNode.movableY - 1][tmpNode.movableX];
	    if(valueB === 0 || valueB === 9 || valueB === 5){
		if(valueB === 5){
		    tmpNode.matrix[tmpNode.movableY][tmpNode.movableX] = 0;
		    tmpNode.isFinal = true;
		}else{
		    tmpNode.matrix[tmpNode.movableY][tmpNode.movableX] = valueB;
		}
		tmpNode.matrix[tmpNode.movableY - 1][tmpNode.movableX] = valueA;
		tmpNode.movableY --;
	    }else{
		return;
	    }
	}
	else{
	    return;
	}
	break;

	case 'right':
	    limit = (tmpNode.movableY + 1 <= 9);
	if(limit){
	    valueB = tmpNode.matrix[tmpNode.movableY + 1][tmpNode.movableX];
	    if(valueB === 0 || valueB === 9 || valueB === 5){
		if(valueB === 5){
		    tmpNode.matrix[tmpNode.movableY][tmpNode.movableX] = 0;
		    tmpNode.isFinal = true;
		}else{
		    tmpNode.matrix[tmpNode.movableY][tmpNode.movableX] = valueB;
		}
		tmpNode.matrix[tmpNode.movableY + 1][tmpNode.movableX] = valueA;
		tmpNode.movableY ++;
	    }else{
		return;
	    }
	}else{
	    return;
	}

	break;

	case 'up':
	    limit = (tmpNode.movableX - 1 >= 0);
	if(limit){
	    valueB = tmpNode.matrix[tmpNode.movableY][tmpNode.movableX - 1];
	    if(valueB === 0 || valueB === 9 || valueB === 5){
		if(valueB === 5){
		    tmpNode.matrix[tmpNode.movableY][tmpNode.movableX] = 0;
		    tmpNode.isFinal = true;
		}else{
		    tmpNode.matrix[tmpNode.movableY][tmpNode.movableX] = valueB;
		}		
		tmpNode.matrix[tmpNode.movableY][tmpNode.movableX - 1] = valueA;
		tmpNode.movableX --;
	    }else{
		return;
	    }
	}else{
	    return;
	}
	break;

	case 'down':
	    limit = (tmpNode.movableX + 1 <= 9);
	if(limit){
	    valueB = tmpNode.matrix[tmpNode.movableY][tmpNode.movableX + 1];
	    if(valueB === 0 || valueB === 9 || valueB === 5){
		if(valueB === 5){
		    tmpNode.matrix[tmpNode.movableY][tmpNode.movableX] = 0;
		    tmpNode.isFinal = true;
		}else{
		    tmpNode.matrix[tmpNode.movableY][tmpNode.movableX] = valueB;
		}		
		tmpNode.matrix[tmpNode.movableY][tmpNode.movableX + 1] = valueA;
		tmpNode.movableX ++;
	    }else{
		return;
	    }
	}else{
	    return;
	}
	break;
    }

    //var SolverNode = function (_matrix, _parent, _movableY, _movableY, _direction,_totalCost,_moves) {
    tmpNode.moves ++;
    tmpNode.calcHueristic();
    tmpNode.calcTotalCost();
    var finalNode = new SolverNode(tmpNode.matrix,_nodeC,tmpNode.movableX,tmpNode.movableY,_direction,tmpNode.totalCost,tmpNode.moves);
    finalNode.isFinal = tmpNode.isFinal;
    /*arrTemp = tmpMatrix.arrNumbs;
      tmpMatrix= new Board(arrTemp,_nodeC);
      tmpMatrix.moves = _nodeC.moves + 1;
      tmpMatrix.calcHueristic();
      tmpMatrix.calcTotalCost();*/
    //console.table(tmpMatrix);

    if(!this.checkClosed(finalNode.matrix)){
	this.open.push(finalNode);
    }
};
