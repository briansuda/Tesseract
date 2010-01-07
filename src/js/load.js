(function ($) {

$(window).load(function (e) {
	// Does the browser support the canvas element?
	if (!document.createElement('canvas').getContext) {
		$('#loading').inner("Sorry, but Tesseract isn't supported in your browser.");
	}
	else {
		// If the user-agent an iPhone or iPod Touch the game needs to be run
		// from the home screen to be played full-screen.
		if (navigator.appVersion.indexOf('iPhone OS ') > 0 && !window.navigator.standalone) {
		  // RS: this shouldn't be a requirement - we should be able to play online without having to install, 
		  // since the "install" process is fiddly. Hide the url bar with window.scrollTo(0, 1) in non standalone mode
			$('#loading').inner('Add Tesseract to your home screen to play');
			$('body').bottom('<div id=add_to_home_screen>Click ‘+’ below and then ‘Add to Home Screen’</div>');
		}
		else {
			// We have an HTML 5 capable browser ready to play the game.
			$('#loading').remove();
			return Tesseract.init();
		}
	}
});

})(xui);