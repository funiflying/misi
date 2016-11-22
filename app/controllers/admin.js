/**
 * Created by Tian on 2016/11/14.
 */
var Order=require('../models/order');
var Goods=require('../models/goods')
module.exports={
    index:function (req,res) {
        Order.find({
            customer:req.session.user._id
        }).limit(4).sort({'status':1,'meta.createAt':-1}).populate(['goods','address']).exec(function (err,orders) {
            if(err){
                res.send('error');
            }
            Goods.find({}).limit(4).exec(function (err,goods) {
                res.render('admin',{
                    title:'个人中心-首页',
                    orders:orders,
                    goods:goods
                })
            })

        })
    }
}
