'use strict';

var package_json = require('package.json');
var app$1 = require('firebase/app');
var analytics = require('firebase/analytics');

// src/main.js
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDb9KC9w8ddmgXfkUjdddA_eEz2ZRzR3_0",
  authDomain: "fire-base006.firebaseapp.com",
  databaseURL: "https://fire-base006-default-rtdb.firebaseio.com",
  projectId: "fire-base006",
  storageBucket: "fire-base006.appspot.com",
  messagingSenderId: "350814581616",
  appId: "1:350814581616:web:c816525bd645565cc355b5",
  measurementId: "G-K56PLD4SKS"
};

// Initialize Firebase
const app = app$1.initializeApp(firebaseConfig);
analytics.getAnalytics(app);
////

function main () {
	console.log('version ' + package_json.version);
}

module.exports = main;
