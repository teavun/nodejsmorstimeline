var express = require('express')

var socket = require('socket.io')

var bodyParser = require('body-parser')
var path = require('path')
var app = express()
var db = require('./db')

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// mors alfabe api
app.get('/api/mors', function (req, res) {
    var morsAlfabesiJSON = require('./public/mors.json');
    res.send(morsAlfabesiJSON);
})

// mors post method
app.post('/morspost', function (req, res) {
    var mors = req.body.mors;
    var morser = req.body.morser;
    db.appPost(morser, mors);
})

// mors postes api
app.get('/api/morsposts', function (req, res) {
    db.mostposts(res);
});

app.get('/giris', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/giris.html'));
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/timeline.html'));
});

app.post('/giris', function (req, res) {
    var ad = req.body.ad;
    db.kullaniciGirisYap(ad, res);
});

app.get('/admin', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/admin.html'));
});

app.get('/kullanici', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/kullanici.html'));
});

var server = app.listen(4000, function () {
    console.log('listening for requests on port 4000,');
});

var io = socket(server);
io.on('connection', (socket) => {
    socket.on('mors', function (data) {
        console.log("1. emit tmm");
        io.sockets.emit('mors', data)
    });
});
