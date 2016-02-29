var 				_ = require('underscore-node'),
		showdown  = require('showdown'),
    converter = new showdown.Converter({ simplifiedAutoLink: true }),
    sanitizeHtml = require('sanitize-html');

module.exports = {
	handleNewUser: function (socket) {
		var newUser = this.userInfo[socket.id] = {};
		newUser['color'] = this.randomColor();

		this.numConnections++;
		this.io.emit("entrance", this.numConnections);
	},

	numConnections: 0,

	createChat: function (io, MessageModel) {		
		this.io = io;
		this.MessageModel = MessageModel;
		var that = this;

		io.on('connection', function (socket) {
			that.handleNewUser(socket);
			that.handleMessages(socket);
			that.handleExit(socket);
		});
	},
	// convert markdown in input to html, then sanitize it
	escapeMessage: function (message) {
    var html  = converter.makeHtml(message);
    var cleanedHtml = sanitizeHtml(html);

    return cleanedHtml;
	},

	lookupColor: function (socketID) {
		return this.userInfo[socketID].color;
	},

	handleExit: function (socket) {
		var that = this;

		socket.on('disconnect', function () {
	  	that.numConnections--;
	  	that.io.emit("exit", that.numConnections);

	  	delete that.userInfo[this.id];
	  });
	},

	handleMessages: function (socket) {
		var that = this;

		socket.on('message', function (data) {
	  	data.color = that.lookupColor(this.id);
	  	data.text = that.escapeMessage(data.text);

	  	that.io.emit('message', data);

	  	var newMessage = that.MessageModel(data);

	  	newMessage.save(function (err, message) {
			  if (err) return console.error(err);
			  console.log("saved a message to mongodb");
			});
	  });
	},

	randomColor: function () {
		var zeroes = "000000";


		//generate a random number in hexadecimal, between 0 and ffffff
		var randomHex = Math.floor(Math.random()*16777215).toString(16);

		//pad number with leading zeroes if less than 6 digits
		var result = (zeroes + randomHex).slice(-6);

		return ("#" + result);
	}, 

	userInfo: {}
}
