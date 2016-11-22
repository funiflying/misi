var Product=require('../models/product');
var Category=require('../models/category');
var Cart=require('../models/cart');
var _=require('underscore');
module.exports={
    create:function (req,res) {
        var _product=req.body.product;
        var _name=_product.name;
        var _id=_product._id;
        //更新
        if(_id){
            Product.findById(_id,function (err,product) {
                if(err){
                    console.log(err);
                    return res.status(500).send('系统出错了');
                }
                product=_.extend(product,_product);
                product.save(function (err) {
                    if(err){
                        console.log(err);
                        return res.status(500).send('系统出错了');
                    }
                    Category.findById(product.category,function (err,category) {
                        if(err){
                            console.log(err);
                            return res.status(500).send('系统出错了');
                        }
                        category.product=_.uniq(category.product.push(product._id))
                        category.save(function (err) {
                            if(err){
                                console.log(err);
                                return res.status(500).send('系统出错了');
                            }
                            return  res.json({
                                success:'编辑成功'
                            })
                        })
                    })
                })
            })
        }else {
            //新增
            Product.findOne({name:_name},function (err,product) {
                if(err){
                    console.log(err)
                    return res.status(500).send('系统出错了');
                }
                if(product){
                    return  res.json({
                        err:'商品已存在'
                    })
                }
                new Product(_product).save(function (err,product) {
                    if(err){
                        console.log(err);
                        return res.status(500).send('系统出错了');
                    }
                    Category.findById(product.category,function (err,category) {
                        if(err){
                            console.log(err);
                            return res.status(500).send('系统出错了');
                        }
                        category.product.push(product._id)
                        category.save(function (err) {
                            if(err){
                                console.log(err);
                                return res.status(500).send('系统出错了');
                            }
                            return  res.json({
                                success:'添加成功'
                            })
                        })
                    })
                })
            })
        }
    },
    list:function (req,res) {
        Product.find({category:req.params._id}).populate([{
            path:'category',
            select:'name subtitle -_id'
        }]).exec(function (err,products) {
            if(err){
                console.log(err);
                return res.status(500).send('系统出错了');
            }
            res.render('category',{
                products:products,
                category:products[0]?products[0].category:''
            })
        })
    },
    remove:function (req,res) {
        var _id=req.body._id;
        if(_id){
            Product.remove({_id:_id},function (err) {
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
    detail:function (req,res) {
        var _id=req.params._id;
        if(_id){
            Product.findOne({_id:_id,},function (err,product) {
                if(err){
                    return res.render('404', {
                        title: 'No Found'
                    })
                }
                product.describe=JSON.stringify(product.describe);
                if(req.session.user){
                    Cart.find({
                        customer:req.session.user._id
                    }).populate([{
                        path:'product',
                        select:'name picture'
                    }]).exec(function (err,carts) {
                        if(err){
                            res.status(500).send("出错了")
                        }
                        return  res.render('detail',{
                            title:product.name,
                            product:product,
                            sid:req.query.sid,
                            carts:carts
                        })
                    })
                }else {
                    return  res.render('detail',{
                        title:product.name+product.subtitle,
                        product:product,
                        sid:req.query.sid,
                        carts:[]
                    })
                }

            })
        }else {
            return res.status(404).send('找不到资源');
        }
    },
    search:function (req,res) {
        var keyword=req.query.keyword||req.body.keyword;
        if(keyword){
            Product.find({name:{$regex:keyword}},function (err,products) {
                if(products.length>0){
                    res.render('search',{
                        title:'搜索-'+keyword,
                        keyword:keyword,
                        products:products
                    })
                }
                else {
                    Product.find({}).limit(8).exec(function (err,products) {
                        res.render('search',{
                            title:'搜索',
                            keyword:keyword,
                            recommend:products
                        })
                    })
                }

            })
        }else {
            Product.find({}).limit(8).exec(function (err,products) {
                res.render('search',{
                    title:'搜索',
                    keyword:keyword,
                    recommend:products
                })
            })
        }




    }
}