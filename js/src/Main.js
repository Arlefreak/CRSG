'use strict';
var gameWidth, gameHeight, isMoving, level, powerUps;
var BootS, PreloaderS, MainMenuS, PlayS, CreditsS, LeaderBoardsS, game;

var WebFontConfig;
WebFontConfig = {
	google: { families: [ 'Source+Code+Pro::latin' ] }
};

(function() {
	var wf = document.createElement('script');
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
	'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.type = 'text/javascript';
	wf.async = 'true';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
})();


window.onload = function () {
	gameWidth = window.innerWidth;
	gameHeight = window.innerHeight;
	isMoving = false;
	level = 1;
	powerUps = 0;
	game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'gameContainer');
	
	// Game States
	game.state.add('boot', BootS);
	game.state.add('preloader', PreloaderS);
	game.state.add('credits', CreditsS);
	game.state.add('leaderboards', LeaderBoardsS);
	game.state.add('mainmenu', MainMenuS);
	game.state.add('play', PlayS);
	game.state.start('boot');
};