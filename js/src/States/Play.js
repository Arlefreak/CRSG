(function () {
    'use strict';

    function Play() {}
    Play.prototype = {
	create: function () {
        playerTurn = true;
	    game.stage.backgroundColor = '#333333';
	    this.score = 0;

	    /* Transition */

	    /* Audio */
	    this.fx = game.add.audio('sfx');
	    this.soundtrack = game.add.audio('soundtrack');
	    //this.soundtrack.play('',0,1,true);

	    // Show FPS
	    this.game.time.advancedTiming = true;

	    /* Groups */
	    var margin = 0;
	    if (gameWidth > gameHeight) {
		margin = gameHeight * 0.10;
	    } else {
		margin = gameWidth * 0.10;
	    }

	    /* Grid */
	    this.grid = new Grid(game, 10, 10, gameWidth, gameHeight, margin, true, true);
	    var layers = this.genLayers();
	    this.TilePowerUpsG = game.add.group();
	    var powerup;

	    for (var i = 0; i < powerUps; i++) {
		powerup = this.TilePowerUpsG.create((160 + (50 * i)), 0, 'tiles', 'TilePowerUp');
		powerup.scale.set(0.2);
	    }

	    for (var i = layers.length - 1; i >= 0; i--) {
		var name = 'layer' + i;
		for (var j = layers[i].length - 1; j >= 0; j--) {
		    var numberType = layers[i][j];
		    switch (numberType) {
			case 1:
			    name = 'unmovable';
			break;
			case 2:
			    name = 'enemy';
			break;
			case 3:
			    name = 'final';
			break;
			case 4:
			    name = 'collectable';
			break;
			case 5:
			    name = 'movable';
			break;
			default:
			    break;
		    }
		}
		this.grid.addLayer(layers[i], name, 'tiles', [null, 'TileWall', 'TileEnemy', 'TileExit', 'TilePowerUp', 'TilePlayer']);
	    }

	    /* Text */
	    this.fpsText = this.game.add.text(game.world.width - 50, 10, '0', {
		font: "20px Source Code Pro",
		fill: "#f0f0f0",
		align: "center"
	    });

	    this.levelText = this.game.add.text(50, 10, 'Level: ' + level, {
		font: "20px Source Code Pro",
		fill: "#f0f0f0",
		align: "center"
	    });

	    this.fpsText.anchor.set(1.0, 0);

	    /* Keyboard */

	    this.escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

	    game.input.onDown.add(this.move, this);
	    this.escKey.onDown.add(function () {
		this.quitGame('mainmenu', true);
	    }, this);

	    var bdmTransition = game.add.bitmapData(gameWidth, gameHeight);
	    bdmTransition.context.fillStyle = 'rgba(50, 50, 50, 1.0)';
	    bdmTransition.context.fillRect(0, 0, gameWidth, gameHeight);
	    var transition = game.add.sprite(0, 0, bdmTransition);
	    var e = game.add.tween(transition);
	    e.onStart.add(function () {
		isMoving = true;
	    });
	    e.onComplete.add(function () {
		isMoving = false;
	    })
	    e.to({
		alpha: 0
	    }, 500, Phaser.Easing.Linear.None, false, 0, 0, false);
	    e.start();
	},

	update: function () {
	    if (this.game.time.fps !== 0) {
		this.fpsText.setText(this.game.time.fps + ' FPS');
	    }
	},
	render: function () {
	    //game.debug.spriteInfo(this.grid.movableSprite, gameWidth - 500, 50);
	    //game.debug.spriteCoords(this.grid.movableSprite, gameWidth - 500, 150);
	    //game.debug.spriteCoords(this.grid.marker, gameWidth - 500, 250);
	    //game.debug.spriteCoords(this.grid.debugW, gameWidth - 500, 150);
	},

	quitGame: function (_state, _gameOver) {
        playerTurn = false;
        if(!_gameOver){
            level++;
            BUSTED = false;
            this.grid = {};
            this.fx.play('', 0, 1, false);
            localStorage.setItem('lastScore', this.score);
            game.time.events.remove(this.timer);

            var bdmTransition = game.add.bitmapData(gameWidth, gameHeight);
            bdmTransition.context.fillStyle = 'rgba(50, 50, 50, 1.0)';
            bdmTransition.context.fillRect(0, 0, gameWidth, gameHeight);
            var transition = game.add.sprite(0, 0, bdmTransition);
            transition.alpha = 0;
            var e = game.add.tween(transition);
            e.to({
            alpha: 1
            }, 500, Phaser.Easing.Linear.None, false, 0, 0, false);
            e.start();
            e.onComplete.add(function () {
            game.state.start(_state);
            });
        }else{
            powerUps = 0;
            level = 1;
            BUSTED = false;
            var gameOverText = this.game.add.text(game.world.centerX, game.world.centerY, 'Game Over', {
                font: "50px Source Code Pro",
                fill: "#fff",
                align: "center"
            });
            gameOverText.anchor.set(0.5, 0.5);
            gameOverText.alpha = 0;
            var e = game.add.tween(gameOverText);
            e.to({
            alpha: 1
            }, 1000, Phaser.Easing.Linear.None, false, 0, 0, false);
            e.onComplete.add(this.gameOVerText, this);
            e.start();
        }
	}
    };

    Play.prototype.gameOVerText = function () {
    	var bdmTransition = game.add.bitmapData(gameWidth, gameHeight);
            bdmTransition.context.fillStyle = 'rgba(50, 50, 50, 1.0)';
            bdmTransition.context.fillRect(0, 0, gameWidth, gameHeight);
            var transition = game.add.sprite(0, 0, bdmTransition);
            transition.alpha = 0;
            var e = game.add.tween(transition);
            e.to({
            alpha: 1
            }, 500, Phaser.Easing.Linear.None, false, 0, 0, false);
            e.start();
            e.onComplete.add(function () {
            game.state.start('mainmenu');
            });
    };

    Play.prototype.genLayers = function () {
	var layers = [];
	var enemies = [2];
	var elements = [3, 4];
	var matrix1 = [];
	var matrix2 = [];
	var matrix3 = [];
	var matrix4 = [];
	var matrix5 = [];
	var indexes = [];

	for (var i = level - 1; i > 0; i--) {
	    enemies.push(2);
	}

	for (var i = 100; i >= 0; i--) {
	    matrix1.push(0);
	    matrix2.push(0);
	    matrix3.push(0);
	    matrix4.push(0);
	    matrix5.push(0);
	}

	for (var i = 5; i >= 0; i--) {
	    matrix1[i + 22] = 1;
	    matrix1[i + 72] = 1;

	    matrix1[22 + i * 10] = 1;
	    matrix1[27 + i * 10] = 1;
	}

	for (var i = matrix1.length - 1; i >= 0; i--) {
	    if (matrix1[i] === 1) {
		indexes.push(i);
	    }
	}

	Phaser.Utils.shuffle(elements);
	Phaser.Utils.shuffle(indexes);

	for (var i = elements.length - 1; i >= 0; i--) {
	    switch (elements[i]) {
		case 2: //Enemies
		    matrix2[indexes[i]] = elements[i];
		break;
		case 3: //Final
		    matrix3[indexes[i]] = elements[i];
		break;
		case 4: //Collectable
		    matrix4[indexes[i]] = elements[i];
		break;
		case 5: //Movable
		    matrix5[indexes[i]] = elements[i];
		break;
	    }
	    matrix1[indexes[i]] = 0;
	    if (i > -1) {
		indexes.splice(i, 1);
	    }
	}


	for (var i = enemies.length - 1; i >= 0; i--) {
	    var enemyLayer = [];
	    for (var j = 100; j >= 0; j--) {
		enemyLayer[j] = 0;
	    }
	    var tmpIndex = indexes.pop();
	    matrix1[tmpIndex] = 0;
	    enemyLayer[tmpIndex] = 2;
	    layers.push(enemyLayer);

	}

	var playerIndex = 0;

	matrix5[playerIndex] = 5;

	if (playerIndex >= 10) {
	    if (playerIndex % 10 !== 9) {
		matrix5[playerIndex - 9] = 9;
	    }
	    if (playerIndex % 10 !== 0) {
		matrix5[playerIndex - 11] = 9;
	    }
	    matrix5[playerIndex - 10] = 9;
	}

	if (playerIndex % 10 !== 9) {
	    matrix5[playerIndex + 1] = 9;
	}
	if (playerIndex % 10 !== 0) {
	    matrix5[playerIndex - 1] = 9;
	}

	if (playerIndex < 90) {
	    if (playerIndex % 10 !== 0) {
		matrix5[playerIndex + 9] = 9;
	    }
	    if (playerIndex % 10 !== 9) {
		matrix5[playerIndex + 11] = 9;
	    }
	    matrix5[playerIndex + 10] = 9;
	}

	layers.push(matrix1);
	layers.push(matrix2);
	layers.push(matrix3);
	layers.push(matrix4);
	layers.push(matrix5);

	return layers;
    };

    Play.prototype.move = function () {
	var shield = false;
	if (this.grid.canMove && playerTurn) {
	    if (Math.round(this.grid.movableSprite.x) === Math.round(this.grid.marker.x)) {
		if (Math.round(this.grid.movableSprite.y) < Math.round(this.grid.marker.y)) {
		    this.grid.move(this.grid.movableLayers[0], 'down');
		} else {
		    this.grid.move(this.grid.movableLayers[0], 'up');
		}
	    } else if (Math.round(this.grid.movableSprite.y) === Math.round(this.grid.marker.y)) {
		if (Math.round(this.grid.movableSprite.x) < Math.round(this.grid.marker.x)) {
		    this.grid.move(this.grid.movableLayers[0], 'right');
		} else {
		    this.grid.move(this.grid.movableLayers[0], 'left');
		}
	    } else if (Math.round(this.grid.movableSprite.y) < Math.round(this.grid.marker.y) && Math.round(this.grid.movableSprite.x) > Math.round(this.grid.marker.x)) {
		this.grid.move(this.grid.movableLayers[0], 'bottomleft');
	    } else if (Math.round(this.grid.movableSprite.y) > Math.round(this.grid.marker.y) && Math.round(this.grid.movableSprite.x) > Math.round(this.grid.marker.x)) {
		this.grid.move(this.grid.movableLayers[0], 'topleft');
	    } else if (Math.round(this.grid.movableSprite.y) > Math.round(this.grid.marker.y) && Math.round(this.grid.movableSprite.x) < Math.round(this.grid.marker.x)) {
		this.grid.move(this.grid.movableLayers[0], 'topright');
	    } else if (Math.round(this.grid.movableSprite.y) < Math.round(this.grid.marker.y) && Math.round(this.grid.movableSprite.x) < Math.round(this.grid.marker.x)) {
		this.grid.move(this.grid.movableLayers[0], 'bottomright');
	    }

	    if (this.grid.checkLayer(this.grid.marker.x, this.grid.marker.y, 3, this.grid.finalLayers)) {
		this.quitGame('play', false);
	    }

	    if (this.grid.checkLayer(this.grid.marker.x, this.grid.marker.y, 4, this.grid.collectableLayers)) {
		var spriteArray = this.grid.collect(this.grid.marker.x, this.grid.marker.y, this.grid.collectableLayers);
		for (var i = spriteArray.length - 1; i >= 0; i--) {
		    var tmp = spriteArray[i];
		    var s = game.add.tween(tmp.scale);
		    s.to({
			x: 0.2,
			y: 0.2
		    }, 250, Phaser.Easing.Linear.None);
		    s.start();
		    var e = game.add.tween(tmp);
		    e.onStart.add(function () {
			isMoving = true;
		    });
		    e.onComplete.add(function () {
			isMoving = false;
		    })
		    e.to({
			x: (160 + (50 * powerUps)),
			y: 0
		    }, 250, Phaser.Easing.Linear.None, false, 0, 0, false);
		    e.start();
		    powerUps++;
		    shield = true;
		}
	    }
	    for (var i = this.grid.enemiesLayers.length - 1; i >= 0; i--) {
		this.grid.enemiesLayers[i].callAll('turn');
	    }
	    for (var i = this.grid.enemiesLayers.length - 1; i >= 0; i--) {
		this.grid.enemiesLayers[i].callAll('checkPlayer');
	    }

	    if(BUSTED){
            this.quitGame('mainmenu',true);
	    	console.log('BUSTED !');
	    }
	}
    }
    PlayS = Play;
}());
