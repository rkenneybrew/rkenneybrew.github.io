## explosion

This JS library provides exchange of signaling messages between all client applications.

## By implementing proposed

### WebSocket server on the basis of which includes the following features:

- routers (by analogy with the express)
- lists service messaging
- controllers access to service messages, mailing lists (It will be sold as an additional module)
- service messaging filter creation (It will be sold as an additional module)
- creation of posts on the validity of the test circuit (It will be sold as an additional module)
- deferred queue service messages, mailings (It will be sold as an additional module)


### Browser WebSocket server and clients include the following features:
- subscription service messaging
- create your own mailing service messages with the ability to set them right, filters and client handlers (routers)
- deferred messaging queue (offline mode)

## Download this repository
```
git clone https://github.com/lastuniverse/explosion.git
```
## Install  via npm
```
npm install explosion
```

for latest unstable version use:
```
npm install https://github.com/lastuniverse/explosion/tarball/master
```

## Usage

### on server side

index.js
```
let explosion = require( 'explosion' );
let app = explosion( server );
let path = require('path');

// Get all messages send from all clients to "/system/..." distributions
wsapp.use( "/system", function( req, res, next ) {
  // at this point your code
  ...

  let answer = {data: "test"};

  // Resend incomong message to all clients subscribe to "/system" distribution
  res.broadcast();
  // Resend incomong message to sender
  res.send();

  // Send answer message to all clients subscribe to "/system" distribution
  res.broadcast(answer);
  // Send answer message to sender on behalf of the "/system" distribution
  res.send(answer);

  // Send answer message for all clients subscribe to "/you/distribution" distribution
  res.broadcast("/you/delivery", answer);
  // Send answer message to sender on behalf of the "/you/distribution" distribution
  res.send("/you/delivery",answer);

  // Define confirmation of receipt message.
  // It will be sent automatically when the client is waiting for confirmation
  res.confirm = {test: "Your message is ok"}
  
  // allow processing of the next middleware handler
  next();
} );

let yourouter = require('./yourouter');
app.use('/yourouter', yourouter);

// start explosion server
var port = 3000;
server.on( 'request', app );
server.listen( port, function() {
  console.log( 'Listening on ' + server.address().port )
} );
```

yourouter.js
```
var explosion = require('explosion');
var router = explosion.Router();

// Get all messages send from all clients to "/system/..." distributions
router.use(function timeLog(req, res, next) {
  // at this point your code
  ...

  // allow processing of the next middleware handler
  next();
});

// Get all messages send from all clients to "/system/templates..." distributions
router.use('/templates', function(req, res) {
  // at this point your code
  ...

  // deny processing of the next middleware handler
  //res.end();
});


module.exports = router;

```

### on client side
index.html
```
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <script src="js/explosion/explosion.js" type="text/javascript" charset="utf-8"></script>
</head>
<body class="my_body">
</body>

<script type="text/javascript" charset="utf-8">

// download the client part of the explosion
explosion.lib.init({
  url: "http://you.web.server/",
  path: "path/to/explosion/client/scripts",
  prefix: "explosion.",
  postfix: ".js",
  modules: ["host","unique","eventemmiter","messanger"],
  onready: explosionOnReady
});

// if the download was successful ...
function explosionOnReady(){
  // establish a connection to the explosion server
  explosion.lib.messanger.connect({
    url: "http://address.your.explosion.server:port_your_explosion_server",
    onready: messangerOnReady
  });
}

function messangerOnReady(){
  let messanger = explosion.lib.messanger;

  // Get all messages send to you from server "/system" distribution
  messanger.on("/system",function(req){
    console.log("message",req);
  });

  let data = "you message data"; // or {sample: "sample data"}
  
  // Send message to server "/system/template" distribution
  messanger.send("/system/template", data);

  // Send message to the server "/system" distribution with the expectation of an acknowledgment of receipt
  messanger.send("/system", data, function (req){
    console.log("confirm", req);
  });
}

</script>
</html>
```


## Participation in development
```
https://github.com/lastuniverse/explosion/issues
```
## License

MIT

## Important

library development is not yet complete


[![NPM](https://nodei.co/npm/explosion.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/explosion/)
