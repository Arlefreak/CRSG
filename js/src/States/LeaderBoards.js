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

			/* Text */
			this.text = game.add.text(game.world.centerX, game.world.centerY - 20, "You Won!! \n High Score\n " + this.highScore + "\n Last Score\n " + this.lastScore, {
				font: "17px Source Code Pro",
				fill: "#f0f0f0",
				align: "center"
			});

			/* Buttons */
			this.bttBack = game.add.button(game.world.centerX  - 200, game.world.centerY + 200, 'buttons', function () { this.startState('mainmenu'); }, this, 'bttBackHover', 'bttBackInactive', 'bttBackActive');

			/* Anchords */
			this.text.anchor.setTo(0.5, 0.5);
			this.bttBack.anchor.setTo(0.5, 0.5);
		},

		startState: function(_state) {
			game.state.start(_state);
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