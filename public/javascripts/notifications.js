var originalTitle, 
		intervalID,
		currentlyNotifying = false;

window.onload = function () {
	originalTitle = document.title;
}


function flashPageTitle (message) {
	if (!currentlyNotifying) {
		intervalID = window.setInterval(function () {
									 document.title = message;
									 window.setTimeout(function () { 
									   document.title = originalTitle; 
									  }, 1500, true);
								}, 3000);	

		currentlyNotifying = true;
	}
	
}

function clearNotifications () {
	document.title = originalTitle;
	window.clearInterval(intervalID);

	currentlyNotifying = false;
}

function sendNotification(message) {
	if (document.hidden) {
		flashPageTitle(message);	
	}
}

document.addEventListener("visibilitychange", function () {
	if (!document.hidden) {
		clearNotifications();
	}
});
