'use strict';


//var Unique = require( './unique' );

function Router() {
  // всякая инициализационная хрень
  if ( this instanceof Router === false ) {
    return new Router();
  }
  // создаем в объекте хранилище для middlewares
  this.middlewares = [];

  // создаем в объекте ссылку на приложение
  this.app = {};
}

// обработчик всех сообщений передаваемых роутеру
Router.prototype.handler = function( name, app ) {
  console.log( "Router: сработал handler" );
  this.app = app;
  this.name = name;
  while( this.middlewares.length ) {
    const middleware = this.middlewares.shift();
    app.use(name+middleware.name,middleware.cb);
  }
};


// создать middleware
// где:
//  name - название списка рассылки (строка или regexp)
//  cb - промежуточный обработчик
Router.prototype.use = function( name, cb ) {

  // формируем объект с обработчиком и его именем
  const middleware = {
    name: name,
    cb: cb
  };

  if(typeof name === 'function'){
    middleware.cb=name;
    middleware.name='/';
  }else if( !name || typeof name != 'string' ){
    middleware.name='/';
  }

  // сохраняем обработчик
  this.middlewares.push( middleware );

};

module.exports = Router;
