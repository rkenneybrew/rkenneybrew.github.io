node-pkgin
==========

A Node.JS wrapper for pkgin specifically for SmartOS

Installation
------------

    npm install pkgin

Examples
--------

Given

``` js
var pkgin = require('pkgin');
```

### List

Get installed packages

``` js
pkgin.list(function(err, result) {
  console.log(result);
});
```

yields

    [ { name: 'GraphicsMagick-1.3.16nb1',
        description: 'X application for displaying and manipulating images' },
      { name: 'autoconf-2.69',
        description: 'Generates automatic source code configuration scripts' },
      { name: 'bootstrap-mk-files-20120415',
        description: '*.mk files for the bootstrap bmake utility' },
        ...
    ]

### Available

Show all available packages

``` js
pkgin.available(function(err, result) {
  console.log(result);
});
```

yields


    [ { name: 'GConf-2.32.4nb4',
        description: 'Configuration database system used by GNOME' },
      { name: 'GeoIP-1.4.8',
        description: 'Find the country from any IP address' },
      { name: 'GeoLiteCity-201208',
        description: 'Free alternative for the GeoIP City database' },
      { name: 'GraphicsMagick-1.3.16nb1',
        description: 'X application for displaying and manipulating images' },
      { name: 'ImageMagick-6.7.6.6nb3',

### Repositories

Show repositories in use on the system

``` js
console.log(pkgin.repositories);
```

yields

    [ 'http://pkgsrc.joyent.com/sdc6/2012Q2/x86_64/All',
      'http://smartos.boundary.com/i386/' ]

### Search

Search for available packages

``` js
pkgin.search('nginx', function(err, result) {
  console.log(result);
});
```

yields

    [ { name: 'nginx-passenger-1.2.5',
        installed: false,
        description: 'Lightweight HTTP server and mail proxy server' },
      { name: 'nginx-passenger-1.0.15',
        installed: false,
        description: 'Lightweight HTTP server and mail proxy server' },
      { name: 'nginx-1.2.5',
        installed: false,
        description: 'Lightweight HTTP server and mail proxy server' },
      { name: 'nginx-1.0.15',
        installed: false,
      description: 'Lightweight HTTP server and mail proxy server' } ]

Usage
-----

All functions can be optionally called like:

``` js
// search for nginx
pkgin.search('nginx', function(err result) {})

// optionally search like this
pkgin('search', 'nginx', function(err result) {})
```

License
-------

MIT License
