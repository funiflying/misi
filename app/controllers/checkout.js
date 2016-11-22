
var Address=require('../models/address');
var Cart=require('../models/cart');
var Product=require('../models/product');
module.exports={
    checkout:function (req,res) {
        Address.find({customer:req.session.user._id}).exec(function (err,addresses) {
            if(err){
                return res.status(500).send('系统出错了');
            }
            Cart.find({
                _id:{
                    $in:req.session.cart
                },
                customer:req.session.user._id
            }).populate([{
                path:'product',
                select:'name picture'
            }]).exec(function (err,carts) {
                if(err){
                    return res.status(500).send('系统出错了');
                }
                var total=0
                carts.map((cart)=>{
                    total+=(cart.count*cart.price);
                })
                res.render('checkout',{
                    title:'订单结算',
                    addresses:addresses,
                    carts:carts,
                    total:total
                })
            })

        });
    },
    create:function (req,res) {
        var _checkout=req.body.checkout;
        var cids=[];
        _checkout.map((_check)=>{
            cids.push(_check.cid);
            Cart.update({_id:_check.cid},{
                $set:{
                    count:_check.count
                }
            }).exec(function (err,count) {

            })
        });
        req.session.cart=cids;
        res.json({
            success:true
        })
    },
    buy:function (req,res) {
        var _product=req.body;
        Cart.findOne({
            customer:req.session.user._id,
            product:_product.pid,
            specify:_product.content,
            price:_product.price
        }).exec(function (err,cart) {
            if(err){
                req.status(500).send({error:'出错'})
            }
            if(cart){
                Cart.update({_id:cart.cid},{
                    $set:{
                        count:_product.count
                    }
                }).exec(function (err) {
                    res.json({
                        success:"添加成功"
                    });
                    req.session.cart=[cart._id]
                })

            }else {
                if(_product.pid){
                    Product.findOne({_id:_product.pid},function (err,product) {
                        if(err){
                            req.status(500).send({error:'出错'})
                        }else{
                            var cart=null;
                            cart={
                                customer:req.session.user._id,
                                sid:_product.sid,
                                product:product._id,
                                count:_product.count,
                                total:parseFloat(_product.price)*parseInt(_product.count),
                                price:_product.price,
                                specify:_product.content
                            }
                            new Cart(cart).save(function (err,_cart) {
                                if(err){
                                    res.status(500).send({error:'出错'})
                                }
                                req.session.cart=[_cart._id]
                                res.json({
                                    success:"添加成功"
                                })
                            })
                        }
                    })
                }
            }
        })

    }
    



}