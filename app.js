"use strict";

const http = require('http');
const url = require('url');
const qs = require('querystring');
const cookie = require('./lib/cookie.js');
const SessionManager = require('./lib/session.js').SessionManager;
const Session = require('./lib/session.js').Session;
const server = http.createServer();
const PORT = process.env.PORT || 80;

let sessMan = new SessionManager({
    maxAge: 7200000,
    sidKey: 'my.id'
});

function handle(req, res) {
    let sid = req.cookie('my.id');
    let session = sessMan.get(sid);
    if (sid && session) {
        if (sessMan.isTimeout(sid)) {
            sessMan.remove(sid);
            session = sessMan.generate(res);
            res.end('you are visited, but session has timeout!');
        } else {
            session.updateTime();
            res.end('you are visited!');
        }
    } else {
        session = sessMan.generate(res);
        res.end('welecome to visit my websit!');
    }
};

server.on('request', (req, res) => {

    let _queryMap = null;
    req.query = name => {
        if (!_queryMap) {
            _queryMap = url.parse(req.url, true).query;
        }

        return _queryMap[name];
    };

    let _cookieMap = null;
    req.cookie = name => {
        if (!_cookieMap) {
            _cookieMap = cookie.parse(req.headers['cookie'] || '');
        }

        return _cookieMap[name];
    };

    res.setCookie = cookieObj => {
        res.setHeader('Set-Cookie', cookie.stringify(cookieObj));
    };

    if (req.method === 'POST') {
        let chunks = [],
            _bodyMap = null;

        req.on('data', data => {
            console.log('asdf');
            chunks.push(data);
        }).on('end', () => {
            req._body = Buffer.concat(chunks).toString('utf8');
            req.body = name => {
                if (!_bodyMap) {
                    _bodyMap = qs.parse(req._body);
                }

                return _bodyMap[name];
            };
            handle(req, res);
        });
    } else {
        handle(req, res);
    }
});

server.listen(PORT, () => {
    console.log(`server start on port: ${PORT}!`);
});
