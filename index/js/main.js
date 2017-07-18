var usermode = ''
    
    $("#sure").on('click', function () {
        $("#phase1").css('display', 'none');
        $("#phase2").css('display', '');
        socket = io(location.hostname + ':880/' + $('input:radio:checked').val());
        socket.on('userinfo', function (data) {
                console.log(data)
                beginway(data.usertype)
            });
        

    })
    $("#sure2").on('click', function () {
        if ($('input:radio:checked').val()) {
            $("#phase2").css('display', 'none');
            $("#phase3").css('display', '')
            socket.emit('new user', { username: $("#yourname").val()});
            
            socket.on('new message', function (data) {
                console.log(data)
                $("#textarea").html($("#textarea").html() +'<div class="ofh mt20 mb20"><span class="fl username">'+data.name+'</span><div class="left-tangle"></div><div class="left-bubble">'+ data.text  +'</div></div>')
                $("#textarea").scrollTop($("#textarea")[0].scrollHeight);
            });
            socket.on('my message', function (data) {
                console.log(data)
                $("#textarea").html($("#textarea").html() +'<div class="ofh mt20 mb20"><span class="fr username">'+data.name+'</span><div class="right-tangle"></div><div class="right-bubble">'+ data.text  +'</div></div>')
                $("#textarea").scrollTop($("#textarea")[0].scrollHeight);
            });
            socket.on('new talker', function (data) {
                console.log(data)
                $("#textarea").html($("#textarea").html() +'<div class="ofh mt20 mb20"><span class="fl username">系统提示</span><div class="left-tangle"></div><div class="left-bubble">'+data.name+'：'+ data.text  +'</div></div>')
                $("#textarea").scrollTop($("#textarea")[0].scrollHeight);
            });
            socket.on('new join', function (data) {
                console.log(data)
                $("#textarea").html($("#textarea").html() +'<p class="tc"><span class="newusertootip">'+ data.name + ':' + data.text  +'</span></p>')
                $("#textarea").scrollTop($("#textarea")[0].scrollHeight);
            });
            
        }
    })
    $("#submit").on('click', function () {
        console.log(usermode)
        if (usermode == 'fst' || usermode == 'sec') {
            if ($("#input").val()) {
                socket.emit('input event', { name: $("#yourname").val(), text: $("#input").val() });
            }
        } else {
            alert('当前聊天室人数已经超过两人，您已经被限制发言')
        }
    })
    function beginway(type) {
        if (type == 'whiteuser') {
            usermode = 'fst'
            waitmove = true
        } else if (type == 'blackuser') {
            usermode = 'sec'
            waitmove = false
        } else {
            usertype = 'none'
        }
    }