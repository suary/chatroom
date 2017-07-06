

function quitlogin(){
    $.cookie('username',null,{path:'/'});
    location.href='/login'
}
var skipcount = 0;
function gotocenter(){
    $("#userinfo").show();
    $(".miantext").hide();
    $.ajax({
        url: "apis/selectuserinfo",
        async: false,
        data: {
            partyid: $.cookie('partyid')
        }
    }).then(function (data) {
        data = JSON.parse(data)
        data=data.data;
        console.log(data)
        var templeteuserinfo=''
        templeteuserinfo+='<h1>'+data.username+'的个人中心</h1>'
        templeteuserinfo+='<h4>性别：'+(data.sex=='man'?'男':'女')+'</h4>'
        templeteuserinfo+='<h4>个人宣言：'+data.slogun+'</h4>'
        templeteuserinfo+='<h4>所在地：'+data.province+'省'+data.city+'市'+'</h4>'
        templeteuserinfo+='<h4 onclick="return returntomian()">返回主页</h4>'

        $("#userinfo").html(templeteuserinfo)
        
        
    })
}
function returntomian(){
    $("#userinfo").hide();
    $(".miantext").show();
}
function newdata() {
    $.ajax({
        url: "apis/fetchlist",
        async: false,
        data: {
            id: $("#keyword").val(),
            skipcount: skipcount,
            pagesize: 10
        }
    }).then(function (data) {
        data = JSON.parse(data)
        var tatalCount=data.count
        data=JSON.parse(data.data);
        $("#router").html('')
        var th = '<table class="table table-hover"><thead><tr><th class="w200">序号</th>'
        for (x in data[0]) {
            th += '<th class="w200">' + x + '</th>'
        }
        th += '</tr></thead><tbody>'
        console.log(th)
        for (x in data) {
            th += '<tr><th>' + (parseInt(x)+parseInt(skipcount)+1) + '</th>'
            for (y in data[x]) {
                th += '<th>' + (data[x][y] === null ? '' : data[x][y]) + '</th>'
            }
            th += '</tr>'
        }
        $("#router").append(th + '</tbody></table>')
        setpage(tatalCount,skipcount)
    })
};
function setpage(count,skip){
    $(".pagination").html('')
    page=skip/10+1;
    var pagenation ='<li><a aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>'
    for(x = 1;((x-1)*10)<count;++x){
        if (x==page) {
            pagenation+='<li class="active page"><a>'+x+'</a></li>'
        }else{
            pagenation+='<li><a class="page">'+x+'</a></li>'
        }
    }
     pagenation+='<li><a aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>'
    
    $(".pagination").append(pagenation)
    $(".page").on('click', function (event) {
        skipcount = (event.target.innerHTML-1)*10;
        newdata()
    });
}


$("#fetch").on('click', function () {
    skipcount = 0
    newdata()
});
function submit22() {
    $.ajax({
        url: "apis/insertnode",
        async: false,
        data: {
            id: $("#id").val(),
            text: $("#text").val()
        }
    }).then(function (data) {
        newdata()
    })
}
$("#submit2").on('click', function () {
    submit22()
});
if((!$.cookie('username'))||$.cookie('username')=='null'){
			location.href='/login'
}else{
    $("#loginman").html($.cookie('username')+'<span class="caret"></span>')
    $("#self").attr('href','/partycenter/?id='+$.cookie('partyid'))
    newdata()
}
