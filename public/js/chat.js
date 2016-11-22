
$(function () {
    //聊天室
    var socket = null;
    var msg=0;
    var from=$('.chat-container').data('from')
    if (/Firefox\/\s/.test(navigator.userAgent)){
        var socket = io.connect({transports:['xhr-polling']});
    }
    else if (/MSIE (\d+.\d+);/.test(navigator.userAgent)){
        var socket = io.connect({transports:['jsonp-polling']});
    }
    else {
        var socket = io.connect();
    }
    //最大最小化
    $('.toolbar-icon-minus').on('click',function () {
        $('.chat-container').addClass('minimum')
    })
    $('.toolbar-icon-full').on('click',function () {
        $('.chat-container').removeClass('minimum');
        $('#chat').focus();
    })
    $('.toolbar-icon-close').on('click',function () {
        $('.chat-window-container').addClass('minimum');
        $('.chat-thread').html('');
    })
    $('.chat-user-list').on('click','.item',function () {
        var name=$(this).data('name');
        var id=$(this).attr('id');
        $('.chat-window-toolbar .name').text(name);
        $('.chat-window-toolbar .name').data('id',id);
        $('.toolbar-icon-avatar img').removeClass('twinkling-icon');
        $('.avatar img').removeClass('twinkling-icon');
        $('.chat-window-container').removeClass('minimum');
        $(this).find('.badge').text('');
        msg=0;
    });

    socket.emit('online',{from:from});
    socket.on('online', function (data) {
        var item='';
        $.each(data,function (index,obj) {
             item+=`<li class="item" data-name="${obj.name}" id="${obj._id}">
                            <div class="avatar ${obj.offline}">
                                <img src="${obj.avatar}"/>
                            </div>
                            <div class="name">
                                ${obj.name}
                            </div>
                            <div class="message">
                                <span class="badge"></span>
                            </div>
                        </li>`
        })
        $('.chat-user-list').html(item)
    });
    socket.on('chat', function (data) {
        addToMsg(data)
    });

    $('.enter').on('click',function (e) {
       sendMsg();
    });
    $('#chat').on('keydown',function (e) {
        if(e.shiftKey && e.which==13){
            $("#chat").append("<br/>");
        } else if(e.which == 13)
        {
            e.preventDefault();
            sendMsg();
        }
    });
    function sendMsg() {
        var content=$('#chat').html();
        addFromMsg(content)
        var contents=$('.chat-thread').html()
        var to= $('.chat-window-toolbar .name').data('id');
        if(content!=''){

            socket.emit('chat', JSON.stringify({from:from,to:to,content:content}));
        }

    }
    function addFromMsg() {
        var content=$('#chat').html();
        $('.chat-thread').append($(`<li class="from">${content}</li>`))
        $(".chat-thread").scrollTop($(".chat-thread")[0].scrollHeight);
        $('#chat').html('').focus();
    }
    function readChat(content) {
        $('.chat-thread').html(localStorage.getItem('CHAT'))
        $(".chat-thread").scrollTop($(".chat-thread")[0].scrollHeight);
    }
    function addToMsg(data) {
        msg++;
        var from='#'+data.from;
        var $from=$(from);
        $from.find('.badge').text(msg)
        $('.toolbar-icon-avatar img').addClass('twinkling-icon');
        $from.find('.avatar img').addClass('twinkling-icon');
        $('.chat-thread').append($(`<li class="to">${data.content}</li>`))
        $(".chat-thread").scrollTop($(".chat-thread")[0].scrollHeight);
    }
    function saveChat() {
        var content= $('.chat-thread').html()
        if(content){
            localStorage.setItem('CHAT',content)
        }

    }





})