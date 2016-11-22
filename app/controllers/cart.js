var Product=require('../models/product');
var Cart=require('../models/cart');
var _=require('underscore');
module.exports={
    create:function (req,res) {
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
                var entity={
                    count:cart.count+parseInt(_product.count)
                }
                cart=_.extend(cart,entity)
                cart.save(function (err) {
                    if(err){
                        res.status(500).send({error:'出错'})
                    }
                    res.json({
                        success:"添加成功"
                    })
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
                            new Cart(cart).save(function (err) {
                                if(err){
                                    res.status(500).send({error:'出错'})
                                }
                                res.json({
                                    success:"添加成功"
                                })
                            })
                        }
                    })
                }
            }
        })

















    },
    list:function (req,res) {
         Cart.find({
             customer:req.session.user._id
         }).populate([{
             path:'product',
             select:'name picture'
         }]).exec(function (err,carts) {
             if(err){
                 res.status(500).send("出错了")
             }
             res.json(carts)
         })
    },
    remove:function (req,res) {
        var _id=req.body._id;
        if(_id){
            Cart.remove({_id:_id},function (err) {
                if(err){
                    console.log(err);
                    return res.status(500).send('系统出错了');
                }
                return  res.json({
                    success:'操作成功'
                })
            })
        }else {
            return  res.json({
                err:'操作的数据不存在'
            })
        }
    },
    cart:function (req,res) {
        Cart.find({
            customer:req.session.user._id
        }).populate([{
            path:'product',
            select:'name picture subtitle'
        }]).exec(function (err,carts) {
            if(err){
                res.status(500).send("出错了")
            }
            res.render('cart',{
                carts:carts
            })
        })

    },
    removeByIds:function (req,res) {
        var _ids=req.body._ids;
        if(_ids){
            Cart.remove({'_id':{
                $in:_ids
            }},function (err) {
                if(err){
                    console.log(err);
                    return res.status(500).send('系统出错了');
                }
                return  res.json({
                    success:'操作成功'
                })
            })
        }else {
            return  res.json({
                err:'操作的数据不存在'
            })
        }
    },
    amount:function (req,res) {
        if(req.session.user){
            Cart.count({
                customer:req.session.user._id
            }).exec(function (err,count) {
                res.json({
                    amount:count
                })
            })
        }else {
            res.json({
                amount:0
            })
        }



    }
}