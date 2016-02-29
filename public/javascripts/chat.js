
function Chat (socket) {
	this.socket = socket;
}

Chat.prototype.sendMessage = function (text) {
	this.socket.emit('message', { text: text });
}

Chat.prototype.listenForMessages = function (callback) {
	this.socket.on('message', function (message) {
		callback(message);
	});
}

Chat.prototype.listenForEntrance = function (callback) {
	var that = this;

	this.socket.on('entrance', function (numUsers) {
		updateUserCount(numUsers);
	});
}

Chat.prototype.listenForExit = function (callback) {
	this.socket.on('exit', function (numUsers) {
		updateUserCount(numUsers);
	});
}
