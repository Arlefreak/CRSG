(function() {
	'use strict';
	function LeaderBoards() {}

	LeaderBoards.prototype = {
		create: function() {
			game.stage.backgroundColor = '#333333';
			this.highScore = 0;
			this.lastScore = 0;
			this.getScore();

			/* Keyboard */
			this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
			this.enterKey.onDown.add(function () { this.startState('play'); }, this);

			/* Buttons */
			this.bttBack = game.add.button(game.world.centerX  - 200, game.world.centerY + 200, 'buttons', function () { this.startState('mainmenu'); }, this, 'bttBackHover', 'bttBackInactive', 'bttBackActive');
			this.bttBack.scale.set((gameWidth/10)/this.bttBack.width);

			this.bttBack.x = game.world.centerX - (this.bttBack.width*1.5);
			this.bttBack.y = game.world.centerY + (this.bttBack.height*3);

			/* Text */
			this.text = game.add.text(game.world.centerX, game.world.centerY, "High Score\n " + this.highScore + "\n Last Score\n " + this.lastScore, {
				font: (this.bttBack.height) + "px Source Code Pro",
				fill: "#f0f0f0",
				align: "center"
			});

			/* Anchords */
			this.text.anchor.setTo(0.5, 0.5);
			this.bttBack.anchor.setTo(0.5, 0.5);

			/* Transition */
			var bdmTransition =  game.add.bitmapData(gameWidth, gameHeight);
			bdmTransition.context.fillStyle = 'rgba(50, 50, 50, 1.0)';
			bdmTransition.context.fillRect(0,0, gameWidth, gameHeight);
			var transition = game.add.sprite(0,0,bdmTransition);
			var e = game.add.tween(transition);
			e.onStart.add(function(){isMoving = true;});
			e.onComplete.add(function(){isMoving = false;})
			e.to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, false, 0 , 0, false);
			e.start();
		},

		startState: function(_state) {
			var bdmTransition =  game.add.bitmapData(gameWidth, gameHeight);
			bdmTransition.context.fillStyle = 'rgba(50, 50, 50, 1.0)';
			bdmTransition.context.fillRect(0,0, gameWidth, gameHeight);
			var transition = game.add.sprite(0,0,bdmTransition);
			transition.alpha = 0;
			var e = game.add.tween(transition);
			e.to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, false, 0 , 0, false);
			e.start();
			e.onComplete.add(function(){game.state.start(_state);});
		},

		getScore: function(){
			this.lastScore = localStorage.getItem('lastScore');
			this.highScore = localStorage.getItem('highScore');
			if (typeof(this.highScore) == 'undefined' || this.highScore == null || isNaN(this.highScore)){
				this.highScore = 0;
				this.lastScore = 0;
				localStorage.setItem('highScore', this.highScore);
				localStorage.setItem('lastScore', this.lastScore);
			}
			this.highScore = parseInt(this.highScore,10);
			this.lastScore = parseInt(this.lastScore,10);
			if(this.highScore < this.lastScore ){
				this.highScore = this.lastScore;
				localStorage.setItem('highScore', this.lastScore);
			}
		}
	};
	LeaderBoardsS = LeaderBoards;
}());