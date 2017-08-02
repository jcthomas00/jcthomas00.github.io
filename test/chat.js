var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(client){
	client.on('join',function(name){
		console.log(name+':joined:');
		client.nickname = name;
		console.log(client.nickname+':joined:');
	});
	client.on('messages', function(data){
		var name = client.nickname;
		console.log(data);
		client.broadcast.emit('messages', client.nickname+" : "+data);
		client.emit('messages', client.nickname+" : "+data);
	});
	console.log('Client connected...');
	client.emit('messages',{hello:'world'});
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.htm');
});

server.listen(8080);