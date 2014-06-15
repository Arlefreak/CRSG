(function() {
    'use strict';

    function LeaderBoards() {}

    LeaderBoards.prototype = {
        create: function() {
            game.stage.backgroundColor = '#333333';
            this.highScore = 0;
            this.lastScore = 0;
            this.getScore();
            console.log('test');

            /* Keyboard */
            this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.enterKey.onDown.add(function() {
                this.startState('play');
            }, this);


            /* Buttons */
            this.bttBack = game.add.button(game.world.centerX - 200, game.world.centerY + 200, 'buttons', function() {
                this.startState('mainmenu');
            }, this, 'bttBackHover', 'bttBackInactive', 'bttBackActive');

            this.bttPlay = game.add.button(game.world.centerX + 200, game.world.centerY + 200, 'buttons', function() {
                this.startState('play');
            }, this, 'bttPlayHover', 'bttPlayInactive', 'bttPlayActive');

            this.bttGooglePlus = game.add.button(game.world.centerX, game.world.centerY + 200, 'buttons', function() {
                gapi.auth.signIn({
                    'callback': signinCallback
                });
            }, this, 'bttGooglePlusHover', 'bttGooglePlusInactive', 'bttGooglePlusActive');

            var convertion = 0;
            if (gameWidth > gameHeight) {
                convertion = gameHeight;
            } else {
                convertion = gameWidth;
            }

            this.bttBack.scale.set((convertion / 10) / this.bttBack.width);
            this.bttBack.x = game.world.centerX - (this.bttBack.width * 1.5);
            this.bttBack.y = game.world.centerY + (this.bttBack.height * 3);

            this.bttPlay.scale.set((convertion / 10) / this.bttPlay.width);
            this.bttPlay.x = game.world.centerX + (this.bttPlay.width * 1.5);
            this.bttPlay.y = game.world.centerY + (this.bttPlay.height * 3);

            this.bttGooglePlus.scale.set((convertion / 10) / this.bttGooglePlus.width);
            this.bttGooglePlus.x = game.world.centerX;
            this.bttGooglePlus.y = game.world.centerY + (this.bttGooglePlus.height * 3);

            /* Text */
            this.text = game.add.text(game.world.centerX, game.world.centerY, "High Score\n Loading...\n Last Score\n " + this.lastScore, {
                font: (this.bttBack.height) + "px Source Code Pro",
                fill: "#f0f0f0",
                align: "center"
            });

            /* Anchords */
            this.text.anchor.setTo(0.5, 0.5);
            this.bttBack.anchor.setTo(0.5, 0.5);
            this.bttPlay.anchor.setTo(0.5, 0.5);
            this.bttGooglePlus.anchor.setTo(0.5, 0.5);

            /* Transition */
            var bdmTransition = game.add.bitmapData(gameWidth, gameHeight);
            if (BUSTED) {
                bdmTransition.context.fillStyle = 'rgba(255, 84, 76, 1.0)';
            }else{
                bdmTransition.context.fillStyle = 'rgba(50, 50, 50, 1.0)';
            }
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
            BUSTED = false;
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
            var ref = this;
            this.lastScore = localStorage.getItem('lastScore');
            this.highScore = 100000000;

            gapi.client.load('games', 'v1', function(response) {
                console.log(response);
                console.log(gapi.client);
                var request = gapi.client.games.scores.get({
                    leaderboardId: "CgkIlcH21rkDEAIQBw",
                    playerId: 'me',
                    timeSpan: 'ALL_TIME'
                });
                request.execute(function(response) {
                    console.log(response);
                    console.log(response['items'][0]['scoreValue']);
                    ref.highScore = response['items'][0]['scoreValue'];
                    ref.text.setText("High Score\n" + ref.highScore + "\n Last Score\n " + ref.lastScore);
                });
            });
            this.lastScore = parseInt(this.lastScore, 10);
        }
    };
    LeaderBoardsS = LeaderBoards;
}());