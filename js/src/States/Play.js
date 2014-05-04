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

			/* Sprites */
			this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'tiles');
			this.player.frameName = 'TilePlayer';
			var convertion = this.grid.cellWidth/256;
			
			this.player.scale.set(convertion);

			/* Text */

			/* Timer */

			/* Particles */

			/* Keyboard */
			this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
			this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
			this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
			this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

			this.upKey.onDown.add(function () { this.grid.move(this.player,'up'); },this);
			this.downKey.onDown.add(function () { this.grid.move(this.player,'down'); },this);
			this.leftKey.onDown.add(function () { this.grid.move(this.player,'left'); },this);
			this.rightKey.onDown.add(function () { this.grid.move(this.player,'right'); },this);

		},

		update: function() {
			
		},

		quitGame: function (state) {
			this.fx.play('',0,1,false);
			localStorage.setItem('lastScore', this.score);
			game.time.events.remove(this.timer);
			game.state.start(state);
		}
	};

	Play.prototype.die = function() {
		this.score--;
	};


	PlayS = Play;
}());
