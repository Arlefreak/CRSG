(function() {
	'use strict';
	function Play() {}
	Play.prototype = {
		create: function() {
			game.stage.backgroundColor = '#333333';
			this.score = 0;

			/* Audio */
			this.fx = game.add.audio('sfx');
			this.soundtrack = game.add.audio('soundtrack');
			//this.soundtrack.play('',0,1,true);

			// Show FPS
			this.game.time.advancedTiming = true;

			/* Bit Map Data */

			/* Grid */

			/* Groups */
			this.grid = new Grid(10, 10, gameWidth, gameHeight, 50, true, true);
			var layers = this.genLayers();
			this.TilePowerUpsG = game.add.group();
			var powerup;

			for (var i = 0; i < powerUps; i++)
			{
				powerup = this.TilePowerUpsG.create((160 + (50*i)), 0, 'tiles', 'TilePowerUp');
				powerup.scale.set(0.2);
			}
			
			this.grid.addLayer(layers[0], 'unmovable', 'tiles',[null,'TileWall','TileEnemy','TileExit','TilePowerUp','TilePlayer']);
			this.grid.addLayer(layers[1], 'enemy', 'tiles',[null,'TileWall','TileEnemy','TileExit','TilePowerUp','TilePlayer']);
			this.grid.addLayer(layers[2], 'final', 'tiles',[null,'TileWall','TileEnemy','TileExit','TilePowerUp','TilePlayer']);
			this.grid.addLayer(layers[3], 'collectable', 'tiles',[null,'TileWall','TileEnemy','TileExit','TilePowerUp','TilePlayer']);
			this.grid.addLayer(layers[4], 'movable', 'tiles',[null,'TileWall','TileEnemy','TileExit','TilePowerUp','TilePlayer']);

			/* Sprites */
			/*this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'tiles');
			this.player.frameName = 'TilePlayer';
			var convertion = this.grid.cellWidth/256;
			
			this.player.scale.set(convertion);*/

			/* Text */
			this.fpsText = this.game.add.text(game.world.width - 50, 10, '0',{
				font: "20px Source Code Pro",
				fill: "#f0f0f0",
				align: "center"
			});

			this.levelText = this.game.add.text(50, 10, 'Level: ' + level,{
				font: "20px Source Code Pro",
				fill: "#f0f0f0",
				align: "center"
			});

			this.fpsText.anchor.set(1.0,0);

			/* Timer */

			/* Particles */

			/* Keyboard */
			/*this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
			this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
			this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
			this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);*/
			this.escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

			/*this.upKey.onDown.add(function () { this.grid.move(this.player,'up'); },this);
			this.downKey.onDown.add(function () { this.grid.move(this.player,'down'); },this);
			this.leftKey.onDown.add(function () { this.grid.move(this.player,'left'); },this);
			this.rightKey.onDown.add(function () { this.grid.move(this.player,'right'); },this);*/
			game.input.onDown.add(this.move, this);
			this.escKey.onDown.add(function () { this.quitGame('mainmenu'); }, this);
		},

		update: function() {
			if (this.game.time.fps !== 0) {
				this.fpsText.setText(this.game.time.fps + ' FPS');
			}
		},
		render: function() {
			//game.debug.spriteInfo(this.grid.movableSprite, gameWidth - 500, 50);
			//game.debug.spriteCoords(this.grid.movableSprite, gameWidth - 500, 150);
			//game.debug.spriteCoords(this.grid.marker, gameWidth - 500, 250);
			//game.debug.spriteCoords(this.grid.debugW, gameWidth - 500, 150);
		},

		quitGame: function (state) {
			level++;
			this.grid = {};
			this.fx.play('',0,1,false);
			localStorage.setItem('lastScore', this.score);
			game.time.events.remove(this.timer);
			game.state.start(state);
		}
	};

	Play.prototype.die = function() {
		this.score--;
	};

	Play.prototype.genLayers = function() {
		var layers = [];
		var enemies = [2];
		var elements = [3,4];
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

		for (var i = 6-1; i >= 0; i--) {
			matrix1[i+22] = 1;
			matrix1[i+72] = 1;
			matrix1[22 + i*10] = 1;
			matrix1[27 + i*10] = 1;

			indexes.push(i + 22);
			indexes.push(i + 72);
			indexes.push(22 + i*10);
			indexes.push(27 + i*10);
		}

		for (var i = enemies.length - 1; i >= 0; i--) {
			elements.push(enemies.pop());
		}

		Phaser.Utils.shuffle(elements);
		Phaser.Utils.shuffle(indexes);
		
		for (var i = elements.length - 1; i >= 0; i--) {
			switch(elements[i]){
				case 2://Enemies
				matrix2[indexes[i]] = elements[i];
				matrix1[indexes[i]] = 0;
				break;
				case 3://Final
				matrix3[indexes[i]] = elements[i];
				matrix1[indexes[i]] = 0;
				break;
				case 4://Collectable
				matrix4[indexes[i]] = elements[i];
				matrix1[indexes[i]] = 0;
				break;
				case 5://Movable
				matrix5[indexes[i]] = elements[i];
				matrix1[indexes[i]] = 0;
				break;
			}
		}
		matrix5[55] = 5;
		matrix5[54] = 9;
		matrix5[56] = 9;
		
		matrix5[44] = 9;
		matrix5[45] = 9;
		matrix5[46] = 9;

		matrix5[64] = 9;
		matrix5[65] = 9;
		matrix5[66] = 9;
		

		layers.push(matrix1);
		layers.push(matrix2);
		layers.push(matrix3);
		layers.push(matrix4);
		layers.push(matrix5);

		return layers;
	};

	Play.prototype.move = function() {
		if(this.grid.canMove){
			if(Math.round(this.grid.movableSprite.x) === Math.round(this.grid.marker.x)){
				if(Math.round(this.grid.movableSprite.y) < Math.round(this.grid.marker.y)){
					this.grid.move(null, 'down');
				}else{
					this.grid.move(null, 'up');
				}
			}else if(Math.round(this.grid.movableSprite.y) === Math.round(this.grid.marker.y)){
				if(Math.round(this.grid.movableSprite.x) < Math.round(this.grid.marker.x)){
					this.grid.move(null, 'right');
				}else{
					this.grid.move(null, 'left');
				}
			}else if(Math.round(this.grid.movableSprite.y) < Math.round(this.grid.marker.y) && Math.round(this.grid.movableSprite.x) > Math.round(this.grid.marker.x)){
				this.grid.move(null,'bottomleft');
			}else if(Math.round(this.grid.movableSprite.y) > Math.round(this.grid.marker.y) && Math.round(this.grid.movableSprite.x) > Math.round(this.grid.marker.x)){
				this.grid.move(null,'topleft');
			}else if(Math.round(this.grid.movableSprite.y) > Math.round(this.grid.marker.y) && Math.round(this.grid.movableSprite.x) < Math.round(this.grid.marker.x)){
				this.grid.move(null,'topright');
			}else if(Math.round(this.grid.movableSprite.y) < Math.round(this.grid.marker.y) && Math.round(this.grid.movableSprite.x) < Math.round(this.grid.marker.x)){
				this.grid.move(null,'bottomright');
			}

			if(this.grid.checkLayer(this.grid.marker.x, this.grid.marker.y,3,this.grid.finalLayers)){
				this.quitGame('play');
			}

			if(this.grid.checkLayer(this.grid.marker.x, this.grid.marker.y,4,this.grid.collectableLayers)){
				var tmp = this.grid.collect(this.grid.marker.x, this.grid.marker.y,this.grid.collectableLayers);
				var s = game.add.tween(tmp.scale);
				s.to({x: 0.2, y: 0.2}, 250, Phaser.Easing.Linear.None);
				s.start();
				var e = game.add.tween(tmp);
				e.onStart.add(function(){isMoving = true;});
				e.onComplete.add(function(){isMoving = false;})
				e.to({ x: (160 + (50*powerUps)) ,y: 0}, 250, Phaser.Easing.Linear.None, false, 0 , 0, false);
				e.start();
				powerUps ++;
				console.log('Shield');
			}
		}
	}

	PlayS = Play;
}());
