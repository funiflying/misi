var Index=require('../app/controllers/index')
var Category=require("../app/controllers/category")
var Customer=require( '../app/controllers/customer');
var Product=require('../app/controllers/product');
var Cart=require('../app/controllers/cart');
var Address=require('../app/controllers/address');
var Checkout=require('../app/controllers/checkout');
var Order=require('../app/controllers/order');
var Admin=require('../app/controllers/admin');
var Account=require('../app/controllers/account');
module.exports=function (app) {
    // pre handle user
    app.use(function(req, res, next) {
        var _user = req.session.user;
        app.locals.USER = _user;
        app.SESSIONID=req.sessionID;
        next()
    })
    app.get("/",Index.get.index);
    app.get("/result",Index.get.search);

    app.get('/',Index.get.index)
    //login
    app.get('/login',function (req,res) {
        req.session.redirectURL=req.query.redirectURL;
        if(req.query.type=='logout'){
            req.session.user=null;
            app.locals.USER=null;
        }
        res.render('login',{
            title:'用户登录',
            customer:{
                name:'',
                password:''
            }
        })
    })
    app.post('/login',Customer.login)
    //register
    app.get('/register',function (req,res) {
        res.render('register',{
            title:'用户注册',
            error:null,
            success:null
        })
    });
    app.post('/register',Customer.create)
    app.get('/customer/name',Customer.findByName);

    //goods
    app.get('/goods',Category.list);
    app.get('/category/:_id',Product.list)
    //detail
    app.get('/goods/:_id',Product.detail)
    //search
    app.get('/search',Product.search)

    //cart
    app.get('/admin/cart',Cart.cart);
    app.post('/admin/cart/add',Cart.create);
    app.get('/admin/cart/list',Cart.list);
    app.post('/admin/cart/remove',Cart.remove);
    app.post('/admin/cart/removeByIds',Cart.removeByIds);
    app.get('/cart/amount',Cart.amount);

    //checkout
    app.get('/admin/checkout',Checkout.checkout);
    app.post('/admin/checkout/create',Checkout.create);
    app.post('/admin/checkout/buy',Checkout.buy);
    //order
    app.post('/admin/order/create',Order.create);
    app.get('/admin/order',Order.order);
    app.post('/admin/order/cancel',Order.cancel);
    app.post('/admin/order/complete',Order.complete)
    //admin
    app.get('/admin',Admin.index)
    app.get('/admin/address',Address.address)
    app.post('/admin/address/create',Address.create);
    app.post('/admin/address/remove',Address.remove);
    //customer
    app.get('/admin/user/info',Customer.info);
    app.get('/user/list',Customer.list);
    app.get('/admin/user/password',Customer.password);
    app.get('/admin/user/verify',Customer.verify)
    app.post('/admin/customer/update',Customer.update);
    app.post('/admin/customer/changePassword',Customer.changePassword);
    app.post('/admin/customer/verify',Customer.verifyEmail);
    app.get('/cipher',function (req,res) {
        res.render('cipher',{
            title:'找回密码',
            customer:{
                name:'',
                email:''
            }
        })
    });
    app.get('/cipher-step',function (req,res) {
        console.log(req.session.validCode)
        res.render('cipher-step',{
            title:'找回密码',
            success:"验证码已发送到您的邮箱"
        })
    });
    app.get('/cipher-success',function (req,res) {
        console.log(req.session.validCode)
        res.render('cipher-success',{
            title:'找回密码',
        })
    });
    app.post('/cipher',Customer.validate);
    app.post('/cipher-step',Customer.resetPassword)
    //account
    app.get('/admin/account',Account.account);
    app.get('/repassword',Customer.resetPassword)
    // confirmation
    app.get('/confirmation',Customer.confirmation)
    // 404
    app.get('*', function(req, res){
        res.render('404', {
            title: 'No Found'
        })
    });

}