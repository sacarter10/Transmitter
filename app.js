var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	timestamps = require('mongoose-timestamp'),	
	chatServer = require('./server/chat_server'),
	port = process.env.PORT || 5000; //whatever port Heroku is using, or default to 5000

try {
	var credentials = require('./server/credentials');
} catch (e) {
	console.log('Mongo credentials missing');
}

// TODO: break up into more files?
var messageSchema = mongoose.Schema({
	text: String,
	color: String
});

messageSchema.plugin(timestamps); //3rd party library, adds createdAt and updatedAt properties to Message schema
var Message = mongoose.model('Message', messageSchema);

var twentyFourHoursAgo = function () {
	var now = new Date();
	var oneDay = 24 * 60 * 60 * 1000; //milliseconds in a day
	var yesterday = new Date(now.getTime() - oneDay);

	return yesterday;
}

// connect to production database if environment variable=production; 
// otherwise default to development database
switch(app.get('env')) { 
	case 'production':
    mongoose.connect(process.env.mongoose_credentials);
		break; 
	default:
		mongoose.connect(credentials.mongo.development.connectionString);
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("Connected to database!");
});

//show tests on page in non-prod, if testing=1 is in query parameters
app.use(function(req, res, next) {
	res.locals.showTests = (app.get('env') !== 'production') && (req.query.testing === "1");
  next();
});


//use handlebars as template engine
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

//serve static files 
app.use(express.static('public'));

app.get('/', function (req, res) {
	var yesterday = twentyFourHoursAgo();

	Message.where('createdAt').gt(yesterday).sort('createdAt').exec(function (error, messages) {
		if (error) {
			console.log(error);	
		} else {
			var data = {
				messages: messages,
				pageTestScript: '/qa/tests-chat.js'
			};

			res.render('index', data);	
		}
	});
});

var server = app.listen(port, function() {
  console.log("Chat app is running at localhost:" + port);
});

var io = require('socket.io')(server);

//start up chat room
chatServer.createChat(io, Message);


