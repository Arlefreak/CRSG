(function() {
    'use strict';

    function Menu() {}

    Menu.prototype = {
        create: function() {
            game.stage.backgroundColor = '#333333';
            this.LIGHT_RADIUS = gameWidth / 2;
            this.highScore = 0;
            this.lastScore = 0;
            this.getScore();

            /* Keyboard */
            this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.enterKey.onDown.add(function() {
                this.startState('play');
            }, this);

            this.tutorialKey = game.input.keyboard.addKey(Phaser.Keyboard.H);
            this.tutorialKey.onDown.add(function() {
                this.startState('tutorial');
            }, this);

            /* Buttons */
            this.bttPlay = game.add.button(game.world.centerX, game.world.centerY, 'buttons', function() {
                this.startState('play');
            }, this, 'bttStartHover', 'bttStartInactive', 'bttStartActive');
            this.bttAbout = game.add.button(game.world.centerX - 200, game.world.centerY + 200, 'buttons', function() {
                this.startState('credits');
            }, this, 'bttInfoHover', 'bttInfoInactive', 'bttInfoActive');
            this.bttLeader = game.add.button(game.world.centerX + 200, game.world.centerY + 200, 'buttons', function() {
                this.startState('leaderboards');
            }, this, 'bttLeaderHover', 'bttLeaderInactive', 'bttLeaderActive');

            this.bttTutorial = game.add.button(game.world.centerX - 10, game.world.centerY + 200, 'buttons', function() {
                this.startState('tutorial');
            }, this, 'bttAboutHover', 'bttAboutInactive', 'bttAboutActive');
            this.bttSettings = game.add.button(game.world.centerX + 10, game.world.centerY + 200, 'buttons', function() {
                this.startState('mainmenu');
            }, this, 'bttSettingsHover', 'bttSettingsInactive', 'bttSettingsActive');

            /* Scales */
            var convertion = 0;
            if (gameWidth > gameHeight) {
                convertion = gameHeight;
            } else {
                convertion = gameWidth;
            }

            this.bttPlay.scale.set((convertion / 6) / this.bttPlay.width);
            this.bttAbout.scale.set((convertion / 10) / this.bttAbout.width);
            this.bttLeader.scale.set((convertion / 10) / this.bttLeader.width);
            this.bttTutorial.scale.set((convertion / 10) / this.bttTutorial.width);
            this.bttSettings.scale.set((convertion / 10) / this.bttSettings.width);

            this.bttPlay.x = game.world.centerX;
            this.bttPlay.y = game.world.centerY;

            this.bttAbout.x = game.world.centerX - (this.bttAbout.width + 20);
            this.bttAbout.y = game.world.centerY + (this.bttAbout.height * 3);
            this.bttLeader.x = game.world.centerX + (this.bttLeader.width + 20);
            this.bttLeader.y = game.world.centerY + (this.bttLeader.height * 3);

            this.bttTutorial.x = game.world.centerX - (this.bttLeader.width + 5);
            this.bttSettings.x = game.world.centerX + (this.bttLeader.width + 5);
            this.bttTutorial.y = game.world.centerY + (this.bttLeader.height * 3);
            this.bttSettings.y = game.world.centerY + (this.bttLeader.height * 3);

            /* Text */
            /*this.titleTxt = game.add.text(game.world.centerX, game.world.centerY - this.bttPlay.height + 10, "CRSG", {
                font: (this.bttPlay.height / 2) + "px Source Code Pro",
                fill: "#f0f0f0",
                align: "center"
            });*/
            this.title = game.add.sprite(game.world.centerX, game.world.centerY - this.bttPlay.height + 10, 'title');
            this.title.scale.set((convertion / 3) / this.title.width);

            /* Anchords */
            this.title.anchor.setTo(0.5, 0.5);
            this.bttPlay.anchor.setTo(0.5, 0.5);
            this.bttAbout.anchor.setTo(1.0, 0.5);
            this.bttLeader.anchor.setTo(0.0, 0.5);
            this.bttTutorial.anchor.setTo(0.0, 0.5);
            this.bttSettings.anchor.setTo(1.0, 0.5);

            /* Transition */
            var bdmTransition = game.add.bitmapData(gameWidth, gameHeight);
            bdmTransition.context.fillStyle = 'rgba(50, 50, 50, 1.0)';
            bdmTransition.context.fillRect(0, 0, gameWidth, gameHeight);
            var transition = game.add.sprite(0, 0, bdmTransition);
            var e = game.add.tween(transition);
            e.onStart.add(function() {
                isMoving = true;
            });
            e.onComplete.add(function() {
                isMoving = false;
            })
            e.to({
                alpha: 0
            }, 500, Phaser.Easing.Linear.None, false, 0, 0, false);
            e.start();
        },

        startState: function(_state) {
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
            e.onComplete.add(function() {
                game.state.start(_state);
            });
        },

        getScore: function() {
            this.lastScore = localStorage.getItem('lastScore');
            this.highScore = localStorage.getItem('highScore');
            if (typeof(this.highScore) == 'undefined' || this.highScore == null || isNaN(this.highScore)) {
                this.highScore = 0;
                this.lastScore = 0;
                localStorage.setItem('highScore', this.highScore);
                localStorage.setItem('lastScore', this.lastScore);
            }
            this.highScore = parseInt(this.highScore, 10);
            this.lastScore = parseInt(this.lastScore, 10);
            if (this.highScore < this.lastScore) {
                this.highScore = this.lastScore;
                localStorage.setItem('highScore', this.lastScore);
            }
        }
    };
    MainMenuS = Menu;
}());