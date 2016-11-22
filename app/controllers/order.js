
var Cart=require('../models/cart');
var Goods=require('../models/goods');
var Order=require('../models/order')
var _=require('underscore');
const PAGE_SIZE=5;
var  current=1;
module.exports={
    create:function (req,res) {
        var _order=req.body.order;
        Cart.find({
            _id:{$in:req.session.cart}
        }).populate([{
            path:'product',
            select:'name picture'
        }]).exec(function (err,carts) {
            var order={
                code:Date.now().toString().slice(8)+Math.random().toString(4).substr(2).slice(0,6),
                name:'',
                customer:req.session.user._id,
                total:0,
                goods:[],
                status:0,//订单状态：0-已提交、3-待配送、4-待自提、5-配送中、7-已完成、21-已取消、22-已退货
                pay:0
            }
            order=_.extend(order,_order);
            var goods=[];
            var name="";
            var total=0;
            if(carts){
                carts.map((cart)=>{
                    var good={
                        product:cart.product,
                        name:cart.product.name,
                        cover:cart.product.picture[0],
                        sid:cart.sid,
                        customer:req.session.user._id,
                        specify:cart.specify,
                        count:cart.count,
                        price:cart.price,
                        total:parseFloat(cart.price)*parseInt(cart.count)
                    }
                    name+=cart.product.name+' '
                    total+=parseFloat(cart.price)*parseInt(cart.count);
                    goods.push(good);
                })
                order.total=total;
                order.name=name;
                Goods.create(goods,function (err,_goods) {
                    if(_goods){
                        _goods.map((good)=>{
                            order.goods.push(good._id);
                        });
                       new Order(order).save(function (err) {
                           if(err){
                               return res.json({err:'err'})
                           }
                           Cart.remove({'_id':{
                               $in:req.session.cart
                           }},function () {
                               req.session.cart=null;
                               res.json({
                                   success:true
                               })
                           });
                       })

                    }
                })

            }
        })

    },
    order:function (req,res,next) {
        var index=parseInt(req.query.index)||0;
        var page=parseInt(req.query.page)||1;
        var _status={$lt:25};
        switch (index){
            case 1:
                _status={$lt:7}
                break;
            case 2:
                _status=7;
                break;
            case 3:
                _status=21;
                break;
        }
        Order.find({
            customer:req.session.user._id,
            status:_status
        }).sort({'status':1,'meta.createAt':-1}).populate(['goods','address']).exec(function (err,orders) {
            if(err){
                res.send('error');
            }
            var size=Math.ceil(orders.length/PAGE_SIZE);
            Order.find({customer:req.session.user._id}).count({status:{$lt:7}},function (err,count) {
                current=page-1;
                orders=orders.slice(PAGE_SIZE*current,(current+1)*PAGE_SIZE);
                res.render('order',{
                    title:'我的订单',
                    orders:orders,
                    count:count,
                    index:index,
                    previous:page-1,
                    next:page+1,
                    size:size
                })
            })
        })
    },
    cancel:function (req,res) {
        var _id=req.body._id;
        if(_id){
            Order.findById(_id,function (err,order) {
                if(err){
                    res.json({err:'操作失败'})
                }
                if(order.status<5){
                    Order.update({_id:_id,customer:req.session.user._id},{
                        $set:{
                            status:21
                        }
                    }).exec(function (err) {
                        res.json({
                            success:!err
                        })
                    })
                }else {
                    res.json({err:'订单状态不允许取消'})
                }
            })

        }
    },
    complete:function (req,res) {
        var _id=req.body._id;
        if(_id){
            Order.findById(_id,function (err,order) {
                if(err){
                    res.json({err:'操作失败'})
                }
                if(order.status<7){
                    Order.update({_id:_id,customer:req.session.user._id},{
                        $set:{
                            status:7
                        }
                    }).exec(function (err) {
                        res.json({
                            success:!err
                        })
                    })
                }else {
                    res.json({err:'订单状态变更'})
                }
            })
        }
    }
}

