$(function () {
	// Is the user-agent an iPhone or iPod Touch?
	if (navigator.appVersion.indexOf('iPhone OS ') < 0) {
		$('#loading').text('Tesseract is for the iPhone or iPod Touch only');
	}
	else {
		// Was the game launched from the home screen?
		if (window.navigator.standalone == undefined || window.navigator.standalone == false) {
			$('#loading')
				.text('Add Tesseract to your home screen to play')
				.after('<div id=add_to_home_screen>Click ‘+’ below and then ‘Add to Home Screen’</div>');
		}
		else {
			// We have an iPhone or iPod Touch, and the game was launched from
			// the home screen.  We're ready to rock.
			return Tesseract.init();
		}
	}
});
