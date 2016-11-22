var socket=require('socket.io');
var mongoose=require('mongoose');
var bodyParser=require("body-parser");
var cookieParser=require('cookie-parser');
var session=require('express-session');
var multipart=require("connect-multiparty")
var mongoStore=require('connect-mongo')(session);
var methodOverride=require('method-override')
var moment=require('moment');
var utils=require('./app/utils/index');
const path=require('path');
const express = require('express');
var http = require('http');
const app=express();
const port=process.env.PORT||80;
const DB_URL='mongodb://localhost/misi';
mongoose.connect(DB_URL);
app.use(multipart());
app.use(session({
    secret:"misi",
    store:new mongoStore({
        url:DB_URL,
        collection:"session"
    })
}))
app.locals.moment=moment;
app.locals.utils=utils;
app.set("views","./app/views/pages");
app.set("view engine","jade");
app.use(express.static(path.join(__dirname,"public")));
//  RESTful API
const publicPath = path.resolve(__dirname);
app.use(bodyParser.urlencoded({
    extended:true,
    verify: function (req, res, buf, encoding) {
        req.rawBody = buf;
    }
}));
app.use(bodyParser.json({ type: 'application/json',limit : '50m' }))
app.use(express.static(publicPath));


app.use(function(req, res, next) {
    var _user = req.session.user;
    var _path=req.path
    if(_path.match(/^\/api/g)&&!req.session.user){
        res.status(403).send('您没有权限');
    }
    if(_path.match(/^\/admin/g)&&!req.session.user){
          res.redirect('/login')
    }
    next()
});
app.use(methodOverride());
app.use(function (err,req,res,next) {
    res.render('404',{
        err:err,
        title:'500'
    })
})
require('./config/routes')(app)
var server = http.createServer(app);
var io=socket.listen(server);
server.listen(port,function (err, result) {
    if(err){
        console.log(err);
    }
    console.log('Server running on port --' + port);
});
var Chat=require('./app/chat/chat')(io,app);
