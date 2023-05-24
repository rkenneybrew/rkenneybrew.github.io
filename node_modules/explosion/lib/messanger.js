'use strict';

var WebSocketServer = require( 'ws' ).Server;
//var EventEmitter = require('events').EventEmitter;
//var util = require('util');
var unique = require( './unique' );
var pathparser = require( './pathparser' );


function Messanger( options ) {
	// всякая инициализационная хрень
	if ( this instanceof Messanger === false ) {
		return new Messanger( options );
	}

	// всегда имеем доступ к this через self
	var self = this;

	// задаем параметры по умолчанию
	this.options = options;

	// создаем объект WebSocketServer-а слушающий на порту options.port
	// будет доступен из внешнего объекта object.wss
	this.wss = new WebSocketServer( options );

	// создаем в объекте хранилище для регистрации рассылок
	this.mailing = {};

	// создаем в объекте хранилище для middlewares
	this.middlewares = [];

	// создаем системную рассылку. на нее будут подписанны все входящие соединения
	this.create( "/system", {} );
	this.create( "/system/onconnect", {} );


	// какойто клиент подключился к нам
	this.wss.on( 'connection', function connection( ws ) {

		// создаем в объекте с клиентским соединением уникальный идентификатор
		if ( !( 'unique_id' in ws ) )
			ws.unique_id = unique();

		// все входящие подключения подписываем на системную рассылку
		self.register( "/system", ws );

		// вызываем обработчик для "/system/onconnect"
		incoming({
			name: "/system/onconnect",
			data: {}
		});

		// если мы получили сообщение от клиента
		ws.on( 'message',incoming );

		function incoming( message ) {
			try {
				// допустимое сообщение - json
				let json = message;

				if( typeof message === "string")
					json = JSON.parse(message);

				// если сообщение не json выходим
				if ( typeof json !== "object" )
					console.log( "это не является сообщением: ", json );

				// если в сообщении нет name и data - выходим
				if ( !( 'name' in json ) || !( 'data' in json ) )
					console.log( "это не является сообщением: ", json );

				// формируем объект request
				let req = {
					"app": self,
					"client": ws,
					"message": json
				};

				// флаг остановки обработки middlewares
				// выставляется в false если вызван broadcast или не вызван next
				let next_turn = false;



				// формируем объект response
				let res = {
					//"client": ws,
					//"req": ws.upgradeReq,

					// вносим в объект res (response) полученное сообщение
					"message": json,

					// задаем подтверждение о получении сообщения по умолчанию
					// отрабатывает только если в сообщении от клиента было поле id
					// (поле id формируется автоматически если клиент при отправке сообщения указал callback функцию)
					// подтверждение может быть изменено для отправки клиенту специфических данных (например сообщения об ошибке)
					"confirm": {},

					/* функция прекращает цикл вызова последующих обработчиков для данного сообщения */
					"end": function() {
						// прекращаем обработку сообщения
						next_turn = false;
					},

					/* функция отправляет ответ клиенту приславшему сообщение
						 принимает параметры:
						 name - (не обязателный) имя рассылки, если не указанно,
						        берется имя рассылки из сообщения клиента
						 data - данные для отправки
					*/
					"send": function( name, data ) {
						if ( !name )
						// отправляем обратно отправителю от имени рассылки
							return self._send( ws, json.name, json.data );
						if ( !data )
						// отправляем обратно отправителю от имени рассылки с произвольной data
							return self._send( ws, json.name, name );
						// отправляем обратно отправителю от произвольной рассылки и data
						self._send( ws, name, data );
					},

					/* функция отправляет сообщение всем клиентам подписанным на рассылку name
						 принимает параметры:
						 name - (не обязателный) имя рассылки, если не указанно,
						        берется имя рассылки из сообщения клиента
						 data - данные для отправки
					*/
					"broadcast": function( name, data ) {
						// прекращаем обработку сообщения в последующих middlewares
						// выполнив в текущем middleware next(); можно возобновить обработку последующих middlewares
						next_turn = false;

						// отправляем всем от имени рассылки
						if ( !name )
							return self._broadcast( json.name, json.data );

						// отправляем всем от имени рассылки с произвольной data
						if ( !data )
							return self._broadcast( json.name, name );

						// позволяем отправить всем от произвольного имени рассылки
						self._broadcast( name, data );
					}
				};

				/* функция выставляет флаг позволяющий вызвать последующие обработчики */
				let next = function( ) {
					next_turn = true;
				};

				// обходим в цикле все зарегестрированные middleware
				for ( let key in self.middlewares ) {
					const middleware = self.middlewares[ key ];

					// проверяем, является ли данный middleware - обработчиком полученного сообщения
					if ( pathparser( middleware.name, json.name ) ) {
						next_turn == false;

						// вызываем все обработчики для очередного подходящего middleware
						middleware.cb( req, res, next );

						// прервать цепочку middlewares если в очередном не был вызван next
						if ( next_turn == false )
							break;
					}
				}

				// по завершении выполнения цикла обработчиков отправляем подтверждение о получении сообщения
				if ( json.confirm )
					self._send( ws, json.confirm, res.confirm );

			} catch ( err ) {
				return console.log( "ошибка обработки сообщения от ...: ", err );
			}

		}

	} );

}

// создать middleware
// где:
// name - название списка рассылки (строка)
// cb - промежуточный обработчик
Messanger.prototype.use = function( name, cb ) {

	// возврат если name не задан
	if ( !name )
		return console.log( "не задано имя рассылки: ", name );

	// если передан 1 параметр и он объект
	if ( !cb && (typeof name === 'object' || typeof name === 'function') ){
		cb = name;
		name = '/';
	}

	if ( typeof name !== 'string' )
		return console.log( "не задано имя рассылки: ", name );


	name = '/'+name;
	name = name.replace(/\/+/g,'/');
	name = name.replace(/\/+$/g,'');

	// возврат если cb не функция или не объект
	if ( !cb )
		return console.log( "1 не задан обработчик для: ", name );

	if ( typeof cb === 'object' )
		return cb.handler(name, this);

	if ( typeof cb !== 'function' )
		return console.log( "2 не задан обработчик для: ", name );

	// формируем объект с обработчиком и его именем
	const middleware = {
		name: name,
		cb: cb
	};

	// сохраняем обработчик
	this.middlewares.push( middleware );

	// создаем рассылку
	this.create( name, {} );

	return console.log( "middleware ",name," успешно добавлен" );

};

// создаем рассылку
// где:
// name - название списка рассылки
// options - параметры рассылки
Messanger.prototype.create = function( name, options ) {

	// возврат если не указанно название рассылки
	if ( !name && typeof name !== 'string' && name.length == 0 )
		return console.log( "не указанно название рассылки" );

	// возврат если рассылка с таким именем уже существует
	if ( name in this.mailing )
		return console.log( "рассылка " + name + " уже существует" );

	// создаем рассылку
	this.mailing[ name ] = {
		clients: {},
		filters: options.filters || {},
		story: options.story || false,
		queue: options.queue || false
	};
	return console.log( "рассылка " + name + " успешно создана" );
};

// подписаться на рассылку
// где:
// name - название списка рассылки
// client - объект с соединением с конкретным клиентом
Messanger.prototype.register = function( name, client ) {

	// возврат если не указанно название рассылки
	if ( !name && typeof name !== 'string' && name.length == 0 )
		return console.log( "не указанно название рассылки" );

	// возврат если рассылки с таким именем не существует
	if ( !( name in this.mailing ) )
		return console.log( "рассылка " + name + " не существует" );

	// возврат если клиент уже подписан на эту рассылку
	if ( client.unique_id in this.mailing[ name ].clients )
		return console.log( "клиент уже подписанн на рассылку " + name );

	// подписываем клиента на рассылку
	this.mailing[ name ].clients[ client.unique_id ] = client;
	return console.log( "клиент успешно подписанн на рассылку " + name );

};

// внутренняя функция отправки сообщения
// где:
//	client - объект с соединением с конкретным клиентом
//	name - название списка рассылки
//	data - данные для отправки
Messanger.prototype._send = function( client, name, data ) {
	const json = {
		name: name,
		data: data
	};

	try {
		client.send( JSON.stringify( json ) );
	} catch ( err ) {}
};

// внутренняя функция отправки сообщения всем
// где:
// name - список рассылки
// data - json с данными для отправки
Messanger.prototype._broadcast = function( name, data ) {
	// возврат если не указанно название рассылки
	if ( !name && typeof name !== 'string' && name.length == 0 )
		return console.log( "не указанно название рассылки" );

	// возврат если рассылка с таким именем уже существует
	if ( !( name in this.mailing ) )
		return console.log( "рассылки " + name + " не существует" );

	// в цикле просматриваем подключенных клиентов и отправляем им сообщение

	const self = this;

	// получаем клиентов подписанных на рассылку name
	const clients = self.mailing[ name ].clients

	// отправляем им всем сообщение от имени рассылки name
	Object.keys( clients ).forEach( function( key ) {
		try {
			// фильтры должны применятся гдето тут :)
			self._send( clients[ key ], name, data );
		} catch ( err ) {
			console.log( "ERROR ", err );
		}
	} );
};

module.exports = Messanger;
