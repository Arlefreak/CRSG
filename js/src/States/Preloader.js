(function () {
	'use strict';
	function Preload() {
		this.preloadBarBg = null;
		this.preloadBar = null;
	}

	Preload.prototype = {
		preload: function() {
			game.stage.backgroundColor = '#000';
			this.preloadBarBg = this.add.sprite(game.world.centerX, game.world.centerY, 'loadingBG');
			this.preloadBar = this.add.sprite(game.world.centerX + 4, game.world.centerY , 'loading');
			this.preloadBarBg.anchor.setTo(0.5, 0.5);
			this.preloadBar.anchor.setTo(0.5, 0.5);

			game.load.audio('sfx', [ 'js/res/sound/die.mp3', 'js/res/sound/die.ogg' ]);
			game.load.audio('soundtrack', [ 'js/res/sound/soundtrack.mp3', 'js/res/sound/soundtrack.ogg' ]);
			this.load.setPreloadSprite(this.preloadBar);
			this.load.atlasJSONHash('buttons', 'js/res/spritesheets/buttons.png', 'js/res/spritesheets/buttons.json');
			this.load.atlasJSONHash('tiles', 'js/res/spritesheets/tiles.png', 'js/res/spritesheets/tiles.json');
		},
		create: function() {
			this.preloadBar.cropEnabled = false;
			game.state.start('mainmenu');
		}
	};

	PreloaderS = Preload;
}());