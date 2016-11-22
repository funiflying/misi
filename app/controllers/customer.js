
var Customer=require('../models/customer');
var _=require('underscore');
var mailer=require('../utils/mailer');
var moment=require('moment');
var utils=require('../utils/index');
module.exports={
    login:function (req,res) {
        var _user=req.body.customer;
        var _name=_user.name;
        var _password=_user.password;
        var _redirectURL=req.session.redirectURL;
        Customer.findOne({name:_name},function (err,user) {
          if(err){
              return res.status(500).send('系统出错了');
          }
          if(!user){
              res.render('login',{
                  title:'用户登录',
                  customer:_user,
                  error:'用户不存在'
              })
          }else {
              user.comparePassword(_password,function (err,isMatch) {
                  if(err){
                      return res.status(500).send('系统出错了');
                  }
                  if(isMatch){
                      req.session.user=user;
                      _redirectURL?res.redirect(_redirectURL):res.redirect("/admin")
                  }else {
                      res.render('login',{
                          title:"用户登录",
                          customer:_user,
                          error:"密码不匹配"
                      })
                  }
              })
          }
        })
    },
    create:function (req,res) {
        var _user=req.body.customer;
        var _name=_user.name;
        var _id=_user._id;
        if(!_user.password){
            res.render('register',{
                error:'请输入密码'
            })
        }
        if(!_name){
            res.render('register',{
                error:'请输入用户名'
            })
        }
        //更新
        if(_id){
            Customer.findById(_id,function (err,user) {
                if(err){
                    console.log(err);return res.status(500).send('系统出错了');
                }
                user=_.extend(user,_user)
                user.save(function (err) {
                    if(err){
                        console.log(err);return res.status(500).send('系统出错了');
                    }
                    return  res.json({
                        success:'编辑成功'
                    })
                })
            })
        }else {
            //新增
            Customer.findOne({name:_name},function (err,user) {

                if(err){
                    console.log(err);return res.status(500).send('系统出错了');
                }
                if(user){
                    return res.render('register',{
                        error:'用户已存在'
                    })
                }
                new Customer(_user).save(function (err) {
                    if(err){
                        return res.status(500).send('系统出错了');
                    }
                   res.render('register',{
                       result:true,
                       title:'用户注册'
                   })
                })
            })
        }
    },
    list:function (req,res) {
        Customer.find({},'name _id avatar').exec(function (err, users) {
            if (err) {
                console.log(err);return res.status(500).send('系统出错了');
            }
            res.json(users)
        })
    },
    remove:function (req,res) {
        var _id=req.body._id;
        if(_id){
            Customer.remove({_id:_id},function (err) {
                if(err){
                    console.log(err);return res.status(500).send('系统出错了');
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
    findByName:function (req,res) {
        var _name=req.query.name;
        Customer.findOne({name:_name},function (err,user) {
            if(user){
                return res.json({
                    success:'用户存在'
                })
            }else {
                return res.json({
                    error:'用户不存在'
                })
            }
        })
    },
    info:function (req,res) {
        Customer.findById(req.session.user._id,function (err,customer) {
            res.render('info',{
                title:'用户信息',
                customer:customer
            })
        })

    },
    password:function (re1,res) {
      res.render('password',{
          title:'修改密码'
      })
    },
    update:function (req,res) {
        var _customer=req.body;
        Customer.update({_id:req.session.user._id},{$set:_customer},function (err,customer) {
            if(err){
                res.json({err:"操作失败"})
            }
            res.json({success:"操作成功"})
        })


    },
    changePassword:function (req,res) {
        var _pwd=req.body;
        if(!_pwd.password){
            res.render('password',{
                title:'修改密码',
                err:'请输入原密码'
            })
        }
        if(_pwd.new!==_pwd.configure){
            res.render('password',{
                title:'修改密码',
                err:'两次密码不一致'
            })
        }
        if(_pwd.password){
            Customer.findOne({name:req.session.user.name},function (err,user) {
                if(err){
                    return res.status(500).send('系统出错了');
                }
                if(!user){
                    res.render('password',{
                        title:'修改密码',
                        error:'用户不存在'
                    })
                }else {
                    user.comparePassword(_pwd.password,function (err,isMatch) {
                        if(err){
                            return res.status(500).send('系统出错了');
                        }
                        if(isMatch){
                            user=_.extend(user,{password:_pwd.new})
                            user.save(function (err) {
                                if(err){
                                    return res.status(500).send('系统出错了');
                                }
                                res.render('password',{
                                    title:'修改密码',
                                    success:'修改成功请重新登录'
                                })
                            })
                        }else {
                            res.render('password',{
                                title:'修改密码',
                                error:'原密码错误'
                            })
                        }
                    })
                }
            })
        }
    },
    verify:function (req,res) {
        res.render('verify',{
            title:'邮箱验证',
            email:req.session.user.email
        })
    },
    verifyEmail:function (req,res) {
        var email=req.body.email
        if (email){
            var randomString=encodeURIComponent(utils.randomString(30,50));
            var redirect='http://www.ieator.cn/confirmation?action='+randomString+"&action_id="+req.session.user._id;
            var mail_body=`<table width="590" cellpadding="0" cellspacing="0" border="0" style=" font-family:Verdana;margin:0 auto"> 
       <tbody>
        <tr> 
         <td colspan="2" align="left" style="font-weight:bold; font-size:14px; padding-top:15px; padding-bottom:8px; color:#5b5b5b;"> 尊敬的<span>     ${req.session.user.name} </span>您好： </td> 
        </tr> 
        <tr> 
         <td colspan="2" align="left" style="font-size:12px; color:#5b5b5b; padding-top:5px; padding-bottom:5px; line-height:25px;">您于 ${moment().format('YYYY年MM月DD日HH时mm分SS秒')} 申请验证邮箱，点击以下按钮，即可完成验证：<br></td> 
        </tr> 
        <tr> 
        
         <td align="left" style="background-color:#fefdd1; text-align:center;padding: 30px"><a style="display: inline-block;width: 168px;display: inline-block;height: 48px;line-height: 48px;background: #d9534f;color: #fff;text-decoration: none;" href="${redirect}" target="_blank">立即验证</a></td> 
        </tr> 
        <tr> 
         <td colspan="2" align="left" style="line-height:25px;color:#5b5b5b; font-size:12px; padding-top:15px;"> 为保障您的帐户安全，请在24小时内点击该链接，您也可以将链接复制到浏览器地址栏访问 <a href="${redirect}" target="_blank">${redirect}</a><br> 若您没有申请过验证邮箱 ，请致电：18650320029 </td> 
        </tr> 
       </tbody>
      </table>`
            var mailOptions={
                to: email, // list of receivers
                subject: 'MISI-美思邮箱验证提醒', // Subject line
                text: '', // plaintext body
                html: mail_body // html body
            }
            mailer(mailOptions,function (err,info) {
                if(info){
                    Customer.update({_id:req.session.user._id},{$set:{action:randomString,email:email}},function (err) {
                        res.render('verify',{
                            title:'邮箱验证',
                            email:email,
                            success:"邮件发送成功"
                        })
                    })
                }
                else {
                    res.render('verify',{
                        title:'邮箱验证',
                        email:email,
                        error:"邮件发送失败，请重试"
                    })
                }

            })
        }else {
            res.render('verify',{
                title:'邮箱验证',
                email:email,
                error:'请输入邮箱地址'
            })
        }

    },
    confirmation:function (req,res) {
        if(!req.session.user){
            res.redirect('/login?redirectURL='+escape(req.url))
        }else {
            var action=req.query.action;
            var acton_id=req.query.action_id;
            if(!action||!acton_id||acton_id!==req.session.user._id){
                res.render('confirmation',{
                    title:'邮箱验证',
                    error:true
                })
            }else {
                Customer.findOne({_id:acton_id,action:action},'-password').exec(function (err,customer) {
                    if(err){
                        res.status(500).send('系统出错')
                    }
                    if(customer&&!customer.verify){
                        customer.verify=true;
                        customer.save(function (err) {
                            if(err){
                                res.status(500).send('系统出错')
                            }
                            res.render('confirmation',{
                                title:'邮箱验证',
                                success:true
                            })
                        })

                    }
                    else {
                        res.render('confirmation',{
                            title:'邮箱验证',
                            error:true
                        })
                    }
                })
            }

        }

    },
    validate:function (req,res) {
        var _name=req.body.name;
        var _email=req.body.email;
        if(!_name||!_email){
            res.render('cipher',{
                title:'找回密码',
                customer:req.body,
                err:"请输入完整账户信息"
            })
        }else {
            Customer.findOne({
                name:_name
            },function (err,customer) {
                if(err){

                }
                if(customer){
                    if(!customer.verify||customer.email!==_email){
                        res.render('cipher',{
                            title:'找回密码',
                            customer:req.body,
                            err:"您未绑定邮箱，请与客服联系"
                        })
                    }else {
                        var random=utils.random()
                        var mail_body=`<table width="590" cellpadding="0" cellspacing="0" border="0" style=" font-family:Verdana;margin:0 auto"> 
       <tbody>
        <tr> 
         <td colspan="2" align="left" style="font-weight:bold; font-size:14px; padding-top:15px; padding-bottom:8px; color:#5b5b5b;"> 尊敬的<span>     ${customer.name}您好： </td> 
        </tr> 
        <tr> 
         <td colspan="2" align="left" style="font-size:12px; color:#5b5b5b; padding-top:5px; padding-bottom:5px; line-height:25px;">您正在找回登录密码操作，您的验证码是：<br></td> 
        </tr> 
        <tr> 
        
         <td align="left" style="background-color:#fefdd1; text-align:center;padding: 30px;font-size: 22px">${random}</td> 
        </tr> 
        <tr> 
         <td colspan="2" align="left" style="line-height:25px;color:#5b5b5b; font-size:12px; padding-top:15px;"> 为保障您的帐户安全，请尽快进行验证 <br> 若您有任何问题 ，请致电：18650320029 </td> 
        </tr> 
       </tbody>
      </table>`
                        var mailOptions={
                            to: customer.email, // list of receivers
                            subject: 'MISI-美思找回密码', // Subject line
                            text: '', // plaintext body
                            html: mail_body // html body
                        }
                        mailer(mailOptions,function (err,info) {
                            if(err){
                                res.render('cipher',{
                                    title:'找回密码',
                                    customer:req.body,
                                    err:"验证失败，请与客服联系"
                                })

                            }
                            req.session.validCode={
                                uid:customer._id,
                                code:random
                            };
                            res.redirect('/cipher-step')

                        })
                    }

                }else {
                    res.render('cipher',{
                        title:'找回密码',
                        customer:req.body,
                        err:"验证失败，请与客服联系"
                    })
                }
            })

        }

    },
    resetPassword:function (req,res) {
        var _pwd=req.body;
        var _validate=req.session.validCode;
        if(!_validate)
        {
           return res.render('cipher-step',{
                title:'找回密码',
                err:'验证码已过期'
            })
        }
        if(_pwd.code!==_validate.code){
            return res.render('cipher-step',{
                title:'找回密码',
                err:'验证码错误'
            })
        }
        if(_pwd.new!==_pwd.configure){
            return  res.render('cipher-step',{
                title:'修改密码',
                err:'两次密码不一致'
            })
        }
        Customer.findById(_validate.uid,function (err,customer) {
            if(err){
                return res.render('cipher-step',{
                    title:'修改密码',
                    err:'系统错误'
                })
            }
            customer=_.extend(customer,{password:_pwd.new})
            customer.save(function (err) {
                if(err){
                    return res.render('cipher-step',{
                        title:'修改密码',
                        err:'系统错误'
                    })
                }
                res.render('cipher-success')
            })

        })
    }
}