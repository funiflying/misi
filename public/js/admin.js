/**
 * Created by Tian on 2016/10/16.
 */
$(function () {

    $('#name').bind('focus',function (e) {
        $(this).removeClass('has-error')
        $('.has-error').remove();
    })
    $('#name').keyup('keydown',function (e) {
        $('.help-block').css('color','red').text('')
        var value=e.target.value;
        if(value){
            $.ajax({
                type:'get',
                url:'/customer/name?name='+value,
                success:function (res) {
                    if(res.success){
                        $('#name').addClass('has-error');
                        $('.help-block').css('color','red').text('用户已存在')
                    }else {
                        $('#name').removeClass('has-error')
                        $('.help-block').css('color','red').text('')
                    }
                }
            })
        }
    })
    $('#name').bind('blur',function (e) {
        var value=e.target.value;
        if(value){
            $.ajax({
                type:'get',
                url:'/customer/name?name='+value,
                success:function (res) {
                    if(res.success){
                        $('#name').addClass('has-error');
                        $('.help-block').css('color','red').text('用户已存在')
                    }else {
                        $('#name').removeClass('has-error')
                        $('.help-block').css('color','red').text('')
                    }
                }
            })
        }
    })
    $('#password').bind('focus',function (e) {
        $(this).removeClass('has-error');

    })
    $('.btn-register').click(function (e) {
        var name=$('#name').val();
        var password=$('#password').val();
        if(!name||!password){
            if(!name){
                $('#name').addClass('has-error')
            }
            if(!password){
                $('#password').addClass('has-error')
            }
            return false
        }
    })

    if(document.getElementById("editor")){
        var quill=new Quill('#editor')
        quill.setContents($("#editor").data("content"))
        $(".ql-editor").attr("contenteditable",false).css("cursor","default")
    }
    $('.specify').on('click',function () {
        var price=parseFloat($(this).data('price'));
        var num=parseInt($('#buy-num').val());
        $('#price-total').text(parseFloat(price*(num+1)).toFixed(2));
        $(this).addClass('active')
        $(this).siblings('.specify').removeClass('active')
    })
    $('.choose-amount .btn-add').on('click',function () {
        var num=parseInt($('#buy-num').val());
        var price=parseFloat($('.specify.active').data('price'));
        $('#buy-num').val(num+1)
        $('#price-total').text(parseFloat(price*(num+1)).toFixed(2));
    })
    $('.choose-amount .btn-reduce').on('click',function () {
        var num=parseInt($('#buy-num').val());
        var price=parseFloat($('.specify.active').data('price'));
        if(num>1){
            $('#buy-num').val(num-1)
            $('#price-total').text(parseFloat(price*(num-1)).toFixed(2));
        }
    })
    $('.choose-amount .buy-num').on('keyup',function (e) {
        var num=parseInt($(this).val());
        var price=parseFloat($('.specify.active').data('price'));
        if(!isNaN(num)&&num>0){
            $('#price-total').text(parseFloat(price*num).toFixed(2));
        }else {
            $(this).val('');
        }
    })
    $('.cart-btn').on('click',function () {
        $('.cart-icon').toggleClass('open')
    })
    $('.top-btn').on('click',function () {
        $('body').animate({scrollTop:0},1000)
    })
    $('.cart-selected').on('change',function (e) {
        var checked=e.target.checked;
        if(checked){
            $(this).parents('tr').addClass('danger');
            var i=0;
            $('.cart-selected').each(function (index,obj) {
                if(obj.checked){
                    i++
                }
            })
            if(i==$('.cart-selected').length)
            {
                $('#cart-selected-all').prop('checked',true)
            }
        }else {
            $(this).parents('tr').removeClass('danger')
            $('#cart-selected-all').prop('checked',false)
        }
        cart_total()

    });
    $('#cart-selected-all').bind('change',function (e) {
        var checked=e.target.checked;
        if(checked){
            $('.cart-table tbody tr').addClass('danger')
            $('.cart-selected').prop('checked',true)
        }else {
            $('.cart-table tbody tr').removeClass('danger')
            $('.cart-selected').prop('checked',false)
        }
        cart_total()
    })
    $('.cart-delete-btn').bind('click',function () {
        var title=$(this).data('title')
        var args={
            title: "删除购物车", //当值为false则不显示title区域，同时需要调整右上角close按钮位置
            close: true, //是否显示右上角的close按钮
            cover: true, //是否显示遮罩层
            coverClose: false, //点击遮罩层是否关闭对话框
            container: "body", //在哪个容器，默认"body"，对话框位置position为fixed，其他情况对话框位置为absolute
            html: '删除"'+title+'"', //当html为一个有效的url链接时，会开启iframe模式； html支持保留jquery事件
            btn: { //底部的按钮，默认会显示
                ok: {
                    name: "确定", //显示的文本
                    callback: function (g) { if (g.ok) { return g.ok(); } } //回调
                },
                cancel: {
                    name: "取消",
                    callback: function (g) { if (g.cancel) { return g.cancel(); } }
                }
            },
            drag: true, //是否支持拖动
            ghost: true, //拖动是否开启影子模式
            animate: "ui-box-zoomIn", //动画效果，可参考http://pageborn.cm/ui/effect/css/
            addClass: "", //自定义的叠加的样式
            zIndex: 1000, // 设置层级
            offset: { x: "center", y: "middle" }, //起始位置，x:[left|center|right], y:[top|middle|bottom]；也可混杂数字如：left-20
            callback: function () { }, //在创建对话框之后回调
            remove: function () { }, //在销毁对话框之后回调， close按钮默认先执行cancel()，没return false再执行remove()
            ok: ()=>{
                var id=$(this).data('id');
                var $this=$(this);
                if (id) {
                    $.ajax({
                        type: 'post',
                        url: '/admin/cart/remove',
                        data: {_id: id},
                        success: function (res) {
                            if (res.success) {
                                $this.parents('tr').remove();
                                cart_total()
                            }

                        }
                    })
                }



            }, //确定按钮的点击事件
            cancel: function () { }, //取消按钮的点击事件
        }
        ui.box(args)
    });
    $('#cart-delete-all').bind('click',function () {
        var args={
            title: "删除购物车", //当值为false则不显示title区域，同时需要调整右上角close按钮位置
            close: true, //是否显示右上角的close按钮
            cover: true, //是否显示遮罩层
            coverClose: false, //点击遮罩层是否关闭对话框
            container: "body", //在哪个容器，默认"body"，对话框位置position为fixed，其他情况对话框位置为absolute
            html: '删除商品', //当html为一个有效的url链接时，会开启iframe模式； html支持保留jquery事件
            btn: { //底部的按钮，默认会显示
                ok: {
                    name: "确定", //显示的文本
                    callback: function (g) { if (g.ok) { return g.ok(); } } //回调
                },
                cancel: {
                    name: "取消",
                    callback: function (g) { if (g.cancel) { return g.cancel(); } }
                }
            },
            drag: true, //是否支持拖动
            ghost: true, //拖动是否开启影子模式
            animate: "ui-box-zoomIn", //动画效果，可参考http://pageborn.cm/ui/effect/css/
            addClass: "alert-content", //自定义的叠加的样式
            zIndex: 1000, // 设置层级
            offset: { x: "center", y: "middle" }, //起始位置，x:[left|center|right], y:[top|middle|bottom]；也可混杂数字如：left-20
            callback: function () { }, //在创建对话框之后回调
            remove: function () { }, //在销毁对话框之后回调， close按钮默认先执行cancel()，没return false再执行remove()
            ok: ()=>{
                var ids=[];
                var $this=$(this);
                $('.cart-selected').each(function (index,obj) {
                    if(obj.checked){
                        ids.push(obj.value)
                    }
                })
                if (ids) {
                    $.ajax({
                        type: 'post',
                        url: '/admin/cart/removeByIds',
                        data: {_ids: ids},
                        success: function (res) {
                            if (res.success) {
                                $('.cart-selected:checked').parents('tr').remove();
                                cart_total()
                            }
                        }
                    })
                }
            }, //确定按钮的点击事件
            cancel: function () { }, //取消按钮的点击事件
        }
        ui.box(args)
    });
    $(".cart-choose-amount").on('click','.btn-add',function () {
        var $num=$(this).parent().find('.buy-num');
        var num=$num.val();
        var price=$num.data('price');
        $num.val(++num);
        $(this).parents('tr').find('.total').text(parseFloat(num*price).toFixed(2));
        cart_total();
    });
    $(".cart-choose-amount").on('click','.btn-reduce',function () {
        var $num=$(this).parent().find('.buy-num');
        var num=$num.val();
        var price=$num.data('price');
        if(num>1){
            var count=$num.val(--num);
            $(this).parents('tr').find('.total').text(parseFloat(num*price).toFixed(2));
            cart_total()
        }
    });
    $('.cart-choose-amount').on('keyup','.buy-num',function (e) {
        var num=$(this).val();
        var price=$(this).data('price');
        if(num>0){
            $(this).parents('tr').find('.total').text(parseFloat(num*price).toFixed(2));
        }else {
            $(this).val(1)
        }
        cart_total()
    })
    
    function  cart_total() {
        var $checked=$('.cart-selected:checked');
        if($checked.length>0){
            var total_price=0;
            var amount=0;
            $checked.each(function (index,obj) {
                var $input=$(obj).parents('tr').find('.buy-num');
                var num=$input.val();
                var price=$input.data('price');
                var total=parseFloat(price)*parseInt(num,10).toFixed(2);
                total_price+=total;
                amount=parseInt(num,10)+parseInt(amount,10)
            })
            $('#amount').text(amount)
            $('#total-price').text(parseFloat(total_price).toFixed(2));
        }else {
            $('#total-price').text(0.00);
            $('#amount').text(0)
        }

        
        
        
    }
    $('.address-list .del-btn').bind('click',function () {
        var args={
            title: "删除地址", //当值为false则不显示title区域，同时需要调整右上角close按钮位置
            html: '删除地址', //当html为一个有效的url链接时，会开启iframe模式； html支持保留jquery事件
            ok: ()=>{
                var id=$(this).data('id');
                var $this=$(this);
                if (id) {
                    $.ajax({
                        type: 'post',
                        url: '/admin/address/remove',
                        data: {_id: id},
                        success: function (res) {
                            console.log(res)
                            if (res.success) {
                                $this.parents('.item').remove();
                            }
                        }
                    })
                }
            }
        }
        ui.box(args)
    });
    $('.address-list .edit-btn').on('click',function () {
        var address=$(this).data('address');
        $('#addressModel').modal('show');
        $('#address-id').val(address._id);
        $("#addressForm").find('[name=name]').val(address.name);
        $("#addressForm").find('[name=phone]').val(address.phone);
        $("#addressForm").find('[name=province]').val(address.province)
        $("#addressForm").find('[name=city]').val(address.city)
        $("#addressForm").find('[name=county]').val(address.county);
        $("#addressForm").find('[name=content]').val(address.content);
    });
    $('#addressForm').on('submit',function (e) {
        e.preventDefault();
        $(this).ajaxSubmit({
            success: function (res) {
                if(res.success){
                    $('#addressModel').modal('hide');
                    window.location.reload();
                }
            },
            beforeSubmit:function (formDate, $form, options) {
                $.each(formDate,function (index,data) {
                    if(data.required&&data.value==''){
                        return false
                    }
                })
                return true
            },
            clearForm:true,
            resetForm:true,
        })
    });
    $('.address-add-btn').on('click',function () {
        $('#addressForm').clearForm();
    });
    $('.consignee-content .select-btn').on('click',function () {
        $(this).addClass('selected')
        $(this).parents('.address-list').siblings().find('.select-btn').removeClass('selected')
    })
    $('.peisong-select').on('click',function () {
        $(this).addClass('selected').siblings().removeClass('selected')
    });
    $('.order-submit').on('click',function () {
        var address=$('.address-select.selected').data('id');
        var peisong=$('.peisong-select.selected').data('id');
        var note=$('.note').val()
        if(!address){
            ui.box.alert('请选择收货地址');
            return false
        }
        if(!peisong){
            ui.box.alert('请选择配送方式');
            return false
        }
        $.ajax({
            type:'post',
            url:'/admin/order/create',
            data:{order:{address:address,distribution:peisong,note:note}},
            error:function (err) {
                ui.box.alert(err)
            },
            success:function (res) {
                if(res.success){
                    window.location.href="/admin/order";
                }else {
                    ui.box.alert('提交失败')
                }
            }
        })
    });
    $('.order-cancel').on('click',function () {
        var _id=$(this).data('id');
            var args={
                title: "取消订单", //当值为false则不显示title区域，同时需要调整右上角close按钮位置
                html: '取消订单?', //当html为一个有效的url链接时，会开启iframe模式； html支持保留jquery事件
                ok: ()=>{
                    if (_id) {
                        $.ajax({
                            type: 'post',
                            url: '/admin/order/cancel',
                            data: {_id: _id},
                            success: function (res) {
                                if(res.success){
                                    window.location.reload();
                                }else {
                                    ui.box.alert('操作失败')
                                }
                            }
                        })
                    }
                }
            }
            ui.box(args)
    });
    $('.order-complete').on('click',function () {
        var _id=$(this).data('id');
        var args={
            title: "订单完成", //当值为false则不显示title区域，同时需要调整右上角close按钮位置
            html: '确认完成订单?', //当html为一个有效的url链接时，会开启iframe模式； html支持保留jquery事件
            ok: ()=>{
                if (_id) {
                    $.ajax({
                        type: 'post',
                        url: '/admin/order/complete',
                        data: {_id: _id},
                        success: function (res) {
                            if(res.success){
                                window.location.reload();
                            }else {
                                ui.box.alert('操作失败')
                            }

                        }
                    })
                }
            }
        }
        ui.box(args)
    });

})
