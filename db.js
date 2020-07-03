var mysql = require("mysql");

var con = mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database: ""
});

con.connect(function (err) {
    if (err) throw err;
    console.log("connected");
});


module.exports.appPost = function (morser, mors) {
    var insertSQL = "insert into mors (morser , mors)" +
        "VALUES ('" + morser + "' , '" + mors + "')";
    con.query(insertSQL, function (err, result) {
        if (err) throw err;
        console.log("1 sütun eklendi");
    });
}



module.exports.kullaniciGirisYap = function (ad, res) {
    var sql = "select * from kullanicilar where kullaniciAd = '" + ad + "'";

    con.query(sql, function (err, result, fields) {
        if (result.length === 0) {
            console.log("böyle bir kullanıcı yok");
        } else {
            // yönlendirme
            // kullanıcı adı ve şifre doğru giriş ekranı açılsın
            // özel mesajları çeksin
            console.log(result[0].kullaniciID);
            res.send({ kullanici: result[0] });
        }
    });
}

module.exports.vecizeEkle = function (vecize) {
    var insertSQL = "insert into vecizeler (vecize)" +
        "VALUES ('" + vecize + "')";
    con.query(insertSQL, function (err, result) {
        if (err) throw err;
        console.log("1 sütun eklendi");
    });
}

module.exports.mostposts = function (res) {
    var sql = "select * from mors";

    con.query(sql, function (err, result, fields) {
        if (result.length === 0) {
            console.log("vecize yok");
        } else {
            // yönlendirme
            // kullanıcı adı ve şifre doğru giriş ekranı açılsın
            // özel mesajları çeksin
            res.send(result);
        }
    });
}
