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

			/* Buttons */
			this.bttPlay = game.add.button(game.world.centerX , game.world.centerY , 'buttons', function () { this.startState('play'); }, this, 'bttStartHover', 'bttStartInactive', 'bttStartActive');
			this.bttAbout = game.add.button(game.world.centerX  - 200, game.world.centerY + 200, 'buttons', function () { this.startState('credits'); }, this, 'bttAboutHover', 'bttAboutInactive', 'bttAboutActive');
			this.bttLeader = game.add.button(game.world.centerX + 200, game.world.centerY + 200, 'buttons', function () { this.startState('leaderboards'); }, this, 'bttLeaderHover', 'bttLeaderInactive', 'bttLeaderActive');
			
			/* Scales */
			var convertion = 0;
			if (gameWidth > gameHeight){
				convertion = gameHeight;
			}else{
				convertion = gameWidth;
			}

			this.bttPlay.scale.set((convertion/6)/this.bttPlay.width);
			this.bttAbout.scale.set((convertion/10)/this.bttAbout.width);
			this.bttLeader.scale.set((convertion/10)/this.bttLeader.width);

			this.bttPlay.x = game.world.centerX;
			this.bttPlay.y = game.world.centerY;
			this.bttAbout.x = game.world.centerX - (this.bttAbout.width*1.5);
			this.bttAbout.y = game.world.centerY + (this.bttAbout.height*3);
			this.bttLeader.x = game.world.centerX + (this.bttLeader.width*1.5);
			this.bttLeader.y = game.world.centerY + (this.bttLeader.height*3);


			/* Text */
			this.titleTxt = game.add.text(game.world.centerX, game.world.centerY - this.bttPlay.height + 10, "CRSG", {
				font: (this.bttPlay.height / 2) + "px Source Code Pro",
				fill: "#f0f0f0",
				align: "center"
			});

			/* Anchords */
			this.bttPlay.anchor.setTo(0.5, 0.5);
			this.bttAbout.anchor.setTo(0.5, 0.5);
			this.bttLeader.anchor.setTo(0.5, 0.5);
			this.titleTxt.anchor.setTo(0.5, 0.5);

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
	MainMenuS = Menu;
}());