var Customer=require('../models/customer')
module.exports={
    account:function (req,res) {
        Customer.findById(req.session.user._id,function (err,customer) {
            res.render('account',{
                title:'账户安全',
                customer:customer
            })
        })
    }
}
