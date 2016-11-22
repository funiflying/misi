var Category=require('../models/category');
var _=require('underscore');
module.exports={
    create:function (req,res) {
        var _category=req.body.category
        var _name=_category.name;
        var _id=_category._id;
        //更新
        if(_id){
            Category.findById(_id,function (err,category) {
                if(err){
                    console.log(err);
                    return res.status(500).send('系统出错了');
                }
                category=_.extend(category,_category)
                category.save(function (err) {
                    if(err){
                        console.log(err);
                        ;return res.status(500).send('系统出错了');
                    }
                    return  res.json({
                        success:'编辑成功'
                    })
                })
            })
        }else {
            //新增
            Category.findOne({name:_name},function (err,category) {
                if(err){
                    console.log(err)
                    ;return res.status(500).send('系统出错了');
                }
                if(category){
                    return  res.json({
                        err:'名称已存在'
                    })
                }
                new Category(_category).save(function (err) {
                    if(err){
                        console.log(err);
                        return res.status(500).send('系统出错了');
                    }
                    return  res.json({
                        success:'添加成功'
                    })
                })
            })
        }
    },
    list:function (req,res) {
        Category.find({
            size:{
                $gt:0
            }
        }).populate([{
            path:'product',
            select:'name picture subtitle type material flavor discount',
            match:{
                shelves:true
            },
            options:{
                limit:4,
                order:{'meta.createAt':-1}
            }
        }]).sort('serial').exec(function (err,categories) {
            if(err){
                console.log(err);
                return res.status(500).send('系统出错了');
            }
            res.render('goods',{
                categories:categories
            })
        })
    },
    remove:function (req,res) {
        var _id=req.body._id;
        if(_id){
            Category.remove({_id:_id},function (err) {
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
    }
}