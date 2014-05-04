(function() {
	'use strict';
	function Menu() {}

	Menu.prototype = {
		create: function() {
			game.stage.backgroundColor = '#333333';
			this.LIGHT_RADIUS = gameWidth/2;
			this.highScore = 0;
			this.lastScore = 0;
			this.getScore();

			/* Keyboard */
			this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
			this.enterKey.onDown.add( function () { this.startState('play'); }, this);

			/* Text */
			this.titleTxt = game.add.text(game.world.centerX, game.world.centerY - 250, "CRSG", {
				font: "100px Source Code Pro",
				fill: "#f0f0f0",
				align: "center"
			});

			/* Buttons */
			this.bttPlay = game.add.button(game.world.centerX , game.world.centerY , 'buttons', function () { this.startState('play'); }, this, 'bttStartHover', 'bttStartInactive', 'bttStartActive');
			this.bttAbout = game.add.button(game.world.centerX  - 200, game.world.centerY + 200, 'buttons', function () { this.startState('credits'); }, this, 'bttAboutHover', 'bttAboutInactive', 'bttAboutActive');
			this.bttLeader = game.add.button(game.world.centerX + 200, game.world.centerY + 200, 'buttons', function () { this.startState('leaderboards'); }, this, 'bttLeaderHover', 'bttLeaderInactive', 'bttLeaderActive');
			
			/* Anchords */
			this.bttPlay.anchor.setTo(0.5, 0.5);
			this.bttAbout.anchor.setTo(0.5, 0.5);
			this.bttLeader.anchor.setTo(0.5, 0.5);
			this.titleTxt.anchor.setTo(0.5, 0.5);
			
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
	MainMenuS = Menu;
}());