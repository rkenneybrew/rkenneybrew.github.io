'use strict'
var id_num = 0;

function unique(){
	id_num++;
	let date = new Date();
	let id = date.getTime();
	let plus = ''+id_num;
	let len = plus.length;
	for(let i=len;i<3;i++){
		plus='0'+plus;
	}
	return id+plus;
}

module.exports = unique;
