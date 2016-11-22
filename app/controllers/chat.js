var Chat=require('../models/chat');
module.exports={
    save:function (entity,cb) {
        Chat.findOne({from:entity.from,to:entity.to},function (err,chat) {
            if(chat){
                chat.content=entity.content
                chat.save(cb)
            }else {
                new Chat({
                    from:entity.from,
                    to:entity.to,
                    content:entity.content
                }).save(cb)
            }
        })
    },
    read:function (params,cb) {
        Chat.findOne(params).exec(cb)
    }




}