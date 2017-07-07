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
                $("#textarea").html($("#textarea").html() + data.name + ':' + data.text + '<br>')
            });
            
        }
    })
    $("#submit").on('click', function () {
        debugger
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