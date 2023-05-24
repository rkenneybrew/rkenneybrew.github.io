( function( G, U ) {
	"use strict";

	// создаем адресное пространство модуля
	G.explosion = G.explosion || {};
	G.explosion.lib = G.explosion.lib || {};
	G.explosion.data = G.explosion.data || {};

	// тут храним обработчики подписанные на рассылки
	let collections = new explosion.lib.EventEmitter();

	// тут храним подключение по websocket
	let ws;

	// если подключены, выставляем в true
	let isReady = false;

	// параметры инициализации соединения по умолчанию
	let options = {
		url: explosion.lib.get_host().ws,
		timeout: 5000,
		cb: function() {}
	};

	/* функция инициализации соединения
		 opt может содержать:
		 url     - адресс websocket сервера с которым устанавливаем соединение
		 timeout - время ожидания до следующей попытки установки соединения
		 onready - callback функция, вызываемая при успешной установке соединения
	*/
	function connect( opt ) {
		opt = opt || {};
		options.url = opt.url || options.url;
		options.timeout = opt.timeout || options.timeout;
		options.onready = opt.onready || options.onready;
		options.collections = opt.collections || [];

		console.log( 'explosion.ws.js. Подключаюсь к серверу ' + options.url );
		ws = new WebSocket( options.url );
		ws.onopen = onopen;
		ws.onmessage = onmessage;
		ws.onerror = onerror;
		ws.onclose = onclose;
	}


	/* функция инициализации соединения
		 opt может содержать:
		 url     - адресс websocket сервера с которым устанавливаем соединение
		 timeout - максимальное время ожидания установки соединения
		 onready - callback функция, вызываемая при успешной установке соединения
	*/
	function onclose( event ) {
		isReady = false;
		if ( event.wasClean )
			console.log( 'explosion.ws.js. Соединение закрыто чисто' );
		else
			console.log( 'explosion.ws.js. Обрыв соединения' );
		console.log( 'explosion.ws.js. Код: ' + event.code + ' причина: ' + event.reason );
		setTimeout( function() {
			connect();
		}, options.timeout );
	}

	/* функция вызывается при удачной попытке установить соединение	*/
	function onopen() {
		console.log( "explosion.ws.js. Соединение c " + options.url + " установлено." );
		isReady = true;
		options.onready( ws );
		options.onready = function (){};
	}

	/* функция вызывается при неудачной попытке установить соединение	*/
	function onerror( error ) {
		console.log( "explosion.like.firebase.js. Ошибка " + error.message );
	}

	/* функция - обработчик данных поступающих по websocket	*/
	function onmessage( event ) {
		//console.log("explosion.like.firebase.js. Получены данные " + event.data);

		// выходим если входящие данные не содержат поле data или data не строка
		if ( !event.data && typeof event.data != "string" )
			return false;

		// преобразуем поле data в json формируя из него объект req (request)
		let req = JSON.parse( event.data );

		// выходим если полученные данные не содержит поле name и data (это не наш тип сообщений)
		if ( !req.name && !req.data )
			return false;

		// добавляем метод send в объект req (request)
		req.send = function( data, cb ) {
			if ( !data )
				return;
			send( req.name, data, cb );
		}

		// вызываем обработчик сообщений для рассылки req.name и передаем ему объект req (request)
		collections.emit( req.name, req );
	}

	/* функция подписывания на рассылку
		 принимает параметры:
		 name - имя рассылки вида "/system/users"
		 cb   - callback функция-обработчик вызываемая  каждый раз
		        при получении сообщения от рассылки name
	*/
	function on( name, cb ) {
		collections.on( name, cb );
	}

	/* функция разового подписывания на рассылку
		 принимает параметры:
		 name - имя рассылки вида "/system/users"
		 cb   - callback функция-обработчик вызываемая единожды
		        при получении сообщения от рассылки name
	*/
	function once( name, cb ) {
		collections.once( name, cb );
	}

	/* обобщенная функция отправки сообщения
		 принимает параметры:
		 name - имя рассылки вида "/system/users"
		 data - данные для отправки (string или object)
		 cb   - (не обязятелен) callback функция-обработчик вызываемая единожды
		        при получении ответа сервера на отправляемое сообщение
	*/
	function send( name, data, cb ) {

		// формируем инициализационный запрос
		const json = {
			name: name,
			data: data || {}
		};

		// если задан callback формируем обработчик события, ожидающий ответ на запрос
		if ( cb ) {
			const unique = G.explosion.lib.unique();
			json.confirm = unique;
			collections.once( unique, cb );
		}

		// и отправляем его серверу
		ws.send( JSON.stringify( json ), {
			mask: true
		} );
	}

	// создаем объект и размещаем его в пространстве имен модуля
	G.explosion.lib.messanger = {
		connect: connect,
		options: options,
		on: on,
		once: once,
		send: send
	};

}( this, undefined ) );
