"use strict";

exports.Session = Session;
exports.SessionManager = SessionManager;

function Session(sid) {
	if(!(this instanceof Session)) return new Session(sid);
	this.sid = sid;		//session Id
	this._updateTime = new Date().getTime();
	this._map = {};
};

Session.prototype.set = function(name, value) {
	this._map[name] = value;
};

Session.prototype.get = function(name) {
	return this._map[name];
};

Session.prototype.remove = function(name) {
	delete this._map[name];
};

Session.prototype.removeAll = function() {
	delete this._map;
	this._map = {};
};

Session.prototype.updateTime = function() {
	this._updateTime = new Date().getTime();
};

function SessionManager(options) {
	if(!(this instanceof SessionManager)) return new SessionManager(options);
	if(!options || typeof options !== 'object') throw new Error('options must be a object!');
	this.maxAge = options.maxAge || 3600000;   //set maxAge in 'ms',default one hour 
	this.sidKey = options.sidKey || 'sid';
	this._sessionMap = {};
};

SessionManager.prototype.generate = function(res) {
	let that = this;
	let sid = [new Date().getTime(), Math.round(Math.random() * 1000)].join('');
	let session = new Session(sid);
	console.dir(this);
	this._sessionMap[sid] = session;
	res.setCookie({
		key: that.sidKey, 
		vlaue: sid, 
		path: '/', 
		expires: new Date(new Date().getTime() + that.maxAge).toUTCString(),
		HttpOnly: true
	});
	return session;
};

SessionManager.prototype.get = function(sid) {
	return this._sessionMap[sid];
};

SessionManager.prototype.remove = function(sid) {
	delete this._sessionMap[sid];
};

SessionManager.prototype.isTimeout = function(sid) {
	console.log(this._sessionMap);
	return this._sessionMap[sid]._updateTime + this.maxAge < new Date().getTime();
};