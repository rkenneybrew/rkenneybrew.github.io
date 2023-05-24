( function( G, U ) {
  "use strict";
  // создаем адресное пространство модуля
  G.explosion = G.explosion || {};
  G.explosion.lib = G.explosion.lib || {};
  G.explosion.data = G.explosion.data || {};

  /* функция загружает произвольный скрипт по URL и выдает promise */
  function loadScript( url ) {
    let promise = new Promise( function( resolve, reject ) {
      // Adding the script tag to the head as suggested before
      let head = document.getElementsByTagName( 'head' )[ 0 ];
      let script = document.createElement( 'script' );
      script.type = 'text/javascript';
      script.src = url;

      // Then bind the event to the callback function.
      // There are several events for cross browser compatibility.
      script.onreadystatechange = cb;
      script.onload = cb;

      function cb() {
        resolve();
      }

      // Fire the loading
      head.appendChild( script );

    } );
    return promise;
  }

  /* функция загружает набор произвольных скриптов
     options может содержать:
     baseurl - адресс сервера на котором находятся скрипты
               вида "http://server/"
               если не задано берется из window.location
     path    - путь к папке со скриптами
               вида "your/path/to/scriptd/"
               если не задано берется ""
     modules - массив с названиями загружаемых скриптов
               вида ["script1","script2",...,"scriptN"]
     prefix  - добавляется перед каждым именем модуля
               по умолчанию ""
     postfix - добавляется после каждого имени модуля
               по умолчанию ""
     onready - callback функция, вызываемая по завершении загрузки
               всех модулей указанных в modules
  */
  function load( options ) {
    // выход если не указан ни один скрипт для загрузки
    if( !options.modules )
      return;

    // если скрипт для загрузки указан в виде строки - переделываем в массив
    if( typeof options.modules === 'string' )
      options.modules = [options.modules];

    // выход если скрипты для загрузки не массив
    if( typeof options.modules != 'object' )
      return;

    // если не указан URL сервера - берем его из window.location
    if( !options.baseurl || typeof options.baseurl != 'string')
      options.baseurl = window.location;

    // если не указан путь к скриптам - берем ""
    if( !options.path || typeof options.path != 'string')
      options.path = '';

    // если не указана callback функция - создаем заглушку
    if( !options.onready || typeof options.onready != 'function')
      options.onready = function(){};

    // если не указан префикс - берем ""
    if( !options.prefix || typeof options.prefix != 'string')
      options.prefix = '';

    // если не указан постфикс - берем ""
    if( !options.postfix || typeof options.postfix != 'string')
      options.postfix = '';

    // создадим промис, который всегда выполнится
    var sequence = Promise.resolve();

    // Пройдемся по всем загружаемым модулям (скриптам)
    for ( let name of options.modules ) {
      const url =
          options.baseurl
        + options.path
        + options.prefix
        + name
        + options.postfix;

      // Добавляем действия с ними в конец последовательности
      sequence = sequence.then( function() {
        return loadScript( url );
      } );
      // .then(function(chapter) {
      //   addHtmlToPage(chapter.html);
      // });
    }

    sequence.then( function() {
      // все загрузились
      options.onready();
    } );

  }

  // создаем ссылки на функции модуля в адресном пространстве модуля
  G.explosion.lib.loadScript = loadScript;
  G.explosion.lib.load = load;
  G.explosion.lib.init = load;

}( this, undefined ) );
