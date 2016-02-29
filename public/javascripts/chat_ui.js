//TODO: use module pattern
var socket = io();

var chat = new Chat(socket);

var getMessage = function () {
	var chatInput = document.getElementById('chat-input');         
	var message = chatInput.value;	
	chatInput.value = null;
	return message;
}

var sendMessage = function (message) {
	chat.sendMessage(message);
}

var updateUserCount = function (numberOfUsers) {
	var output; 

	switch (numberOfUsers) {
		case 1: 
			output = "All alone...";
			break;
		case 2:
			output = "1 other";
			break;
		default:
			output = (numberOfUsers - 1) + " others"; 
	}

	document.getElementById("number-of-users-present").innerHTML = output;
}

var start = function () {
	var chatInput = document.getElementById('chat-input');
	var chatLogs = document.getElementById('chat-history');
	var chatForm = document.getElementsByTagName('form')[0];

	chatForm.addEventListener('submit', function (evt) {
		evt.preventDefault();

		var message = getMessage(); 

		sendMessage(message);	
	})
	
	chat.listenForMessages(function (data) {
		chatLogs.innerHTML += ("<div style='color:" + data.color + ";'>" + data.text + "</div>");
		sendNotification("*** INCOMING TRANSMISSION ***");
	});

	chat.listenForEntrance();
	chat.listenForExit();
}

document.addEventListener("DOMContentLoaded", start);

