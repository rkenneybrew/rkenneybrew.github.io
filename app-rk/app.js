// function sayHello(name) {

// console.log('Hello ' + name);

// }

// sayHello('Mosh');

// console.log(window);


console.log("Test");

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


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


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);