(function() {
    'use strict';

    function Tutorial() {}

    Tutorial.prototype = {
        create: function() {
            game.stage.backgroundColor = '#333333';
            this.slideIndex = 0;

            /* Keyboard */
            this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.enterKey.onDown.add(function() {
                this.startState('play');
            }, this);

            /* Buttons */
            this.bttBack = game.add.button(game.world.centerX - 200, game.world.centerY + 200, 'buttons', function() {
                this.manageButtons(false);
            }, this, 'bttBackHover', 'bttBackInactive', 'bttBackActive');

            this.bttPlay = game.add.button(game.world.centerX + 200, game.world.centerY + 200, 'buttons', function() {
                this.manageButtons(true);
            }, this, 'bttPlayHover', 'bttPlayInactive', 'bttPlayActive');

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

            /* Text */
            this.textOne = game.add.text(game.world.centerX, game.world.centerY, "What you control", {
                font: (this.bttBack.height) + "px Source Code Pro",
                fill: "#f0f0f0",
                align: "left"
            });

            this.textTwo = game.add.text(0, game.world.centerY, "What you fear", {
                font: (this.bttBack.height) + "px Source Code Pro",
                fill: "#f0f0f0",
                align: "left"
            });

            this.textThree = game.add.text(0, game.world.centerY, "What you can't pass", {
                font: (this.bttBack.height) + "px Source Code Pro",
                fill: "#f0f0f0",
                align: "left"
            });

            this.textFour = game.add.text(0, game.world.centerY, "What protects you", {
                font: (this.bttBack.height) + "px Source Code Pro",
                fill: "#f0f0f0",
                align: "left"
            });

            this.textFive = game.add.text(0, game.world.centerY, "Your goal", {
                font: (this.bttBack.height) + "px Source Code Pro",
                fill: "#f0f0f0",
                align: "left"
            });

            this.textTwo.x = game.world.width + this.textTwo.width;
            this.textThree.x = game.world.width + this.textThree.width;
            this.textFour.x = game.world.width + this.textFour.width;
            this.textFive.x = game.world.width + this.textFive.width;

            /*this.textTwo.alpha = 0;
            this.textThree.alpha = 0;
            this.textFour.alpha = 0;
            this.textFive.alpha = 0;*/

            /* Sprites */
            this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'tiles');
            this.enemy = game.add.sprite(game.world.centerX, game.world.centerY, 'tiles');
            this.wall = game.add.sprite(game.world.centerX, game.world.centerY, 'tiles');
            this.shield = game.add.sprite(game.world.centerX, game.world.centerY, 'tiles');
            this.exit = game.add.sprite(game.world.centerX, game.world.centerY, 'tiles');

            this.enemy.x = game.world.width + this.enemy.width;
            this.wall.x = game.world.width + this.wall.width;
            this.shield.x = game.world.width + this.shield.width;
            this.exit.x = game.world.width + this.exit.width;

            this.player.frameName = 'Player';
            this.enemy.frameName = 'Enemy';
            this.wall.frameName = 'Wall';
            this.shield.frameName = 'Shield';
            this.exit.frameName = 'Exit';

            /* Anchords */
            this.textOne.anchor.setTo(0.5, 0.0);
            this.textTwo.anchor.setTo(0.5, 0.0);
            this.textThree.anchor.setTo(0.5, 0.0);
            this.textFour.anchor.setTo(0.5, 0.0);
            this.textFive.anchor.setTo(0.5, 0.0);
            this.bttBack.anchor.setTo(0.5, 0.0);
            this.bttPlay.anchor.setTo(0.5, 0.0);

            this.player.anchor.setTo(0.5, 1.0);
            this.enemy.anchor.setTo(0.5, 1.0);
            this.wall.anchor.setTo(0.5, 1.0);
            this.shield.anchor.setTo(0.5, 1.0);
            this.exit.anchor.setTo(0.5, 1.0);

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

        outSlide: function(_element, _next) {
            var position = 0;
            if (_next) {
                position = (game.world.width / 2) * -1;
            } else {
                position = game.world.width + _element.width;
            }
            var tweenOutSprite = game.add.tween(_element).to({
                x: position
            }, 500, Phaser.Easing.Linear.None).start();
        },

        inSlide: function(_element) {
            var tweenInSprite = game.add.tween(_element).to({
                    x: (game.world.centerX)
                }, 500, Phaser.Easing.Linear.None)
                .start();
        },

        manageButtons: function(_next) {
            if (_next) {
                this.slideIndex++;
                switch (this.slideIndex) {
                    case 1:
                        this.outSlide(this.player, _next);
                        this.outSlide(this.textOne, _next);
                        this.inSlide(this.enemy);
                        this.inSlide(this.textTwo);
                        break;
                    case 2:
                        this.outSlide(this.enemy, _next);
                        this.outSlide(this.textTwo, _next);
                        this.inSlide(this.wall);
                        this.inSlide(this.textThree);
                        break;
                    case 3:
                        this.outSlide(this.wall, _next);
                        this.outSlide(this.textThree, _next);
                        this.inSlide(this.shield);
                        this.inSlide(this.textFour);
                        break;
                    case 4:
                        this.outSlide(this.shield, _next);
                        this.outSlide(this.textFour, _next);
                        this.inSlide(this.exit);
                        this.inSlide(this.textFive);
                        break;
                    default:
                        this.startState('play');
                        break;
                }
            } else {
                this.slideIndex--;
                switch (this.slideIndex) {
                    case 0:
                        this.outSlide(this.enemy, _next);
                        this.outSlide(this.textTwo, _next);
                        this.inSlide(this.player);
                        this.inSlide(this.textOne);
                        break;
                    case 1:
                        this.outSlide(this.wall, _next);
                        this.outSlide(this.textThree, _next);
                        this.inSlide(this.enemy);
                        this.inSlide(this.textTwo);
                        break;
                    case 2:
                        this.outSlide(this.shield, _next);
                        this.outSlide(this.textFour, _next);
                        this.inSlide(this.wall);
                        this.inSlide(this.textThree);
                        break;
                    case 3:
                        this.outSlide(this.exit, _next);
                        this.outSlide(this.textFive, _next);
                        this.inSlide(this.shield);
                        this.inSlide(this.textFour);
                        break;
                    default:
                        this.startState('mainmenu');
                        break;
                }
            }
        }
    };
    TutorialS = Tutorial;
}());