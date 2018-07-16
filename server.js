const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const cookieSession = require('cookie-session')
const path = require('path');
const mysql = require('mysql');

const server = express();
server.use(bodyParser.urlencoded({ extended: false }));


//the cores config
server.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if(req.url == "/" || req.url == "/*"){
        res.redirect('/view/login.html');
    }
    if (req.method == 'OPTIONS') {
        res.send(200);
        /make the require of options turn back quickly/
    } else {
        next();
    }
});

server.use(express.static(path.join(__dirname, 'server')));
server.listen(80, () => {
    console.log("正在监听80端口");

});

//deal (cookie,session)
(() => {
    server.use(cookieParser());
    server.use(session({
        secret:'ls',
        cookie:{maxAge:1000 * 60 * 60 * 24},
        resave:false,
        saveUninitialized:true
    }));
    require('body-parser-xml')(bodyParser);
    server.use(bodyParser.xml({
        limit: '2MB',   // Reject payload bigger than 1 MB
        xmlParseOptions: {
            normalize: true,     // Trim whitespace inside text nodes
            normalizeTags: true, // Transform tags to lowercase
            explicitArray: false // Only put nodes in array if >1
        }
    }));

    // let keyArr = [];
    // for (let i = 0; i < 100000; i++) {
    //     keyArr[i] = "xsa_" + Math.random() * 100 + i;
    // }
    // server.use(cookieSession({
    //     name: 'wx',
    //     keys: keyArr,
    //
    //     // Cookie Options
    //     maxAge: 30 * 60 * 1000
    // }))

})();


//deal router
server.use('/', require('./route/index.js')());
server.use('/', require('./route/wx.js')());
server.use('/', require('./route/server.js')());
