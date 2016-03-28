"use strict";

exports.parse = cookie => {
	let map = {};

	let pairs = cookie.split(';');

	pairs.forEach(pair => {
		let kv = pair.trim().split('=');

		map[kv[0]] = kv[1] || '';
	});

	return map;
};

exports.stringify = cookie => {
	let attrs = [`${cookie['key']}=${cookie['value']}`];

	if(cookie['expires']){
		attrs.push(` expires=${cookie['expires']}`);
	}

	if(cookie['path']){
		attrs.push(` path=${cookie['path']}`);
	}

	if(cookie['domain']){
		attrs.push(` domain=${cookie['domain']}`);
	}

	if(cookie['secure']){
		attrs.push(' secure');
	}

	if(cookie['HttpOnly']){
		attrs.push(' HttpOnly');
	}

	return attrs.join(';');
};