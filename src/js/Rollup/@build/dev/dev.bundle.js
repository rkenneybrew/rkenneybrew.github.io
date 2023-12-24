'use strict';

var package_json = require('package.json');

// src/main.js

function main () {
	console.log('version ' + package_json.version);
}

module.exports = main;
