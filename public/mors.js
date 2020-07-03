var socket = io.connect("localhost:4000");

var postInput = $("#post_input"), btnNokta = $("#btn_nokta"),
    btnTire = $("#btn_tire"), btnBosluk = $("#btn_bosluk"),
    btnSil = $("#btn_sil"), btnGonder = $("#btn_gonder"),
    btnMorsAlfabe = $("#btn_mors_alfabe"), btnSos = $("#btn_sos");

var morsAlfabe = $("#mors_alfabe"),
    not = $("#not"),
    notCountSpan = $("#not_count"),
    timeline = $("#timeline");

postInput.text("|");
var post = "";

var userInput = $("#user_input");

$("#post_note").hide();

btnNokta.click(function () {
    post += ".";
    postInput.text(post + "|");
});
btnTire.click(function () {
    post += "-";
    postInput.text(post + "|");
});
btnBosluk.click(function () {
    post += " ";
    postInput.text(post + "|");
});
btnSil.click(function () {
    post = post.substr(0, post.length - 1);
    postInput.text(post + "|");
});
var i = 0;
var morsForTranslate = [];
var morsAlfabeYaz = function () {
    if (i % 2 != 0) {
        morsAlfabe.text("");
    } else {
        $.ajax({
            method: 'get',
            url: '/api/mors',
            dataType: 'json',
            success(res) {
                for (var i in res) {
                    var element = res[i]
                    morsForTranslate[i] = res[i];
                    morsAlfabe.append(element.harf + " " + element.kod + "&emsp;")
                }
            }
        });
    }
    i++;
}
morsAlfabeYaz();
btnMorsAlfabe.click(morsAlfabeYaz);

btnSos.click(function () {
    post = "... --- ...";
    sendMors();
});

var sendMors = function () {
    var userName = userInput.val();
    // boş mors kontrolü
    if (post == "" || post == " " || userName == "" || userName == " ") {
        $("#post_note").show(1500); $("#post_note").hide(500);

        return;
    }

    // postu sockete gönder
    socket.emit('mors', { mors: post });

    // postu db ye ekle
    $.ajax({
        method: 'post',
        url: '/morspost',
        data: { mors: post, morser: userName },
        success: function () { }
    });

    // boş değilse
    // postu temizle
    postInput.text("|"); post = "";

}

btnGonder.click(sendMors);

var timelineAll = function () {

    $.ajax({
        method: 'get',
        url: '/api/morsposts',
        success: function (res) {
            timeline.empty();
            notCountSpan.empty();
            notCount = 0;
            console.log(res)
            var morsArray = []
            var morsArrayDefault = []
            for (var r in res) {
                morsArray[r] = res[r]
                morsArrayDefault[r] = res[r]
            }
            for (var i = morsArray.length - 1; i >= 0; i--) {
                timeline.append(
                    '<div class="row"> <div class="col-2"></div>' +
                    '<div class="" style="border:1px solid gray;margin:1px;margin-bottom:5px;padding:5px; width:70%;border-radius:20px">' +
                    '<div> <h4 class="text-primary" style="padding:3px;margin:3px">' + morsArray[i].morser + '</h4></div>' +
                    '<h5 style="padding:5px; margin:5px;margin-left:20px">' + morsArray[i].mors + '</h5>' +
                    '<div class="col-4"> </div>'
                    + '</div>' +
                    '<button name="translate" id="tr' + i + '" style="height:50px; margin-left:10px;margin-top:20px" class="btn btn-primary"> çevir </button>' +
                    '</div>');
            }

            $("[name = 'translate'").click(function () {
                var id = ($(this).attr('id')).substr(2, ($(this).attr('id')).length);
                var id2 = parseInt(id + "")
                console.log(id2 + 5);
                morsTranslate(morsArrayDefault[id2].mors);
            });
        }
    });
}

var morsTranslate = function (mors) {
    var splitMors = mors.split(' ');
    var elemanlar = "";

    for (var j in splitMors) {
        for (var i in morsForTranslate) {
            if (morsForTranslate[i].kod == splitMors[j])
                elemanlar += morsForTranslate[i].harf;
        }
    }
    alert(elemanlar);
}


// yenileme buttonuna basınca
not.click(timelineAll);

// bildirim parametreleri
var notCount = 0, nots = [];
socket.on('mors', function (data) {
    nots[notCount] = data.mors;
    notCount++;
    notCountSpan.text("(" + notCount + ")");
});


timelineAll();
