var Category=require('../models/category');
var Product=require('../models/product');
var Banner=require('../models/banner')
module.exports={
    get:{
        index:function (req,res) {
            Category.fetch(function (err,categories) {
                if(err){
                    return console.log(err)
                }
                Product.find({singkek:true,shelves:true}).limit(4).exec(function (err,products) {
                    Banner.find({}).exec(function (err,banners) {
                        res.render('index',{
                            title:"首页",
                            categories:categories,
                            products:products,
                            banners:banners
                        })
                    })



                })

            })
        },
        search:function (req,res) {

        }
    }
}