//'use strict';

var WebSocketServer = require('ws').Server;
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Options = require('options');
var unique = require('./unique');


// приведение метода запроса к внутреннему стандарту, честно слизаному с firebase:
//	get	Получить запись/данные
//	set	Заменить запись/данные
//	update	Модифицировать запись/данные
//	push	Вставить запись/данные
//	remove 	Удалить запись/данные
const res_methods = {
	"get": "get",
	"load": "get",
	"set": "set",
	"put": "set",
	"push": "push",
	"post": "push",
	"insert": "push",
	"update": "update",
	"upsert": "update",
	"remove": "remove",
	"delete": "remove"
};


function LFBserver(options) {
	// всякая инициализационная хрень
	if (this instanceof LFBserver === false) {
		return new LFBserver(options);
	}

	// всегда имеем доступ к this xthtp self
	var self = this;

	// задаем парамеиры по умолчанию
	this.options = options;
	// = new Options({
	//	port: null, // требуем явного указания порта
	//}).merge(options);

	// создаем объект WebSocketServer-а слушающий на порту options.port
	// будет доступен из внешнего объекта object.wss
	this.wss = new WebSocketServer({
		port: options.port
	});

	// создаем в объекте хранилище для роутеров коллекций
	this.routers = {};

	// какойто клиент подключился к нам
	this.wss.on('connection', function connection(ws) {
		// пробегаем по всем подключенным роутерам
		Object.keys(this.routers).forEach(function(router) {
			var response = {};
			response.send = function(name, method, data) {
				self.send(ws, name || router, method || "connect", data);
			};
			response.broadcast = function(name, method, data, filters) {
				self.broadcast(name || router, method || "connect", data, filters || []);
			};

			// вызываем событие "connect" у каждого из подключенных роутеров
			likeFirebase.routers[router].emit("connect", ws, {}, res, {});
		});



		ws.on('message', function incoming(message) {
			console.log('received: %s', message);
		});

		ws.send('something');
	});

}



// отправить сообщение
// где:
//	client - объект с соединением с конкретным клиентом
//	name - название списка рассылки
//	method - метод обработки
//	data - json с данными для отправки
LFBserver.prototype.send = function(client, name, method, data) {
	// тут надобы сделать проверку параметров, но пока не ясно что и как проверять
	const json = {
		name: name,
		method: method,
		data: data
	};
	try {
		client.send(JSON.stringify(json));
	} catch (err) {}
};

// отправить сообщение всем
// где:
//	name - список рассылки
//	method - метод обработки
//	data - json с данными для отправки
//	filters - функции фильтрации
LFBserver.prototype.broadcast = function(name, method, data, filters) {
	// в цикле просматриваем подключенных клиентов и отправляем им сообщение
	this.wss.clients.forEach(function(client) {
		try {
			// фильтры должны применятся гдето тут :)
			this.send(client, name, method, data);
		} catch (err) {}
	});
};


module.exports = LFBserver;