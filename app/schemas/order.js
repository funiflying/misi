var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;
var moment=require("moment")
var OrderSchema=new Schema({
    code:{
        type:String,
        unique:true
    },
    name:String,
    customer:{
        type:ObjectId,
        ref:'Customer'
    },
    total:Number,
    goods:[{
        type:ObjectId,
        ref:'Goods'
    }],
    distribution:{
        type:Number,
        default:1
    },//配送方式：1-送货上门，2-买家自提
    status:{
        type:Number,
        default:0
    },//订单状态：//0-3-待配送、4-待自提、5-配送中、7-已完成、21-已取消、22-已退货
    pay:{
        type:Number,
        default:0
    },//支付方式 0-货到付款
    address:{
        type:ObjectId,
        ref:'Address'
    },
    note:String,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
})
OrderSchema.pre('save',function (next) {
    if(this.isNew){
        this.meta.createAt=this.meta.createAt=Date.now()
    }else {
        this.meta.updateAt=Date.now();
    }
    next();
});
OrderSchema.statics={
    fetch:function (cb) {
        return this.find({}).sort('meta.createAt').exec(cb)
    },
    findById:function (id,cb) {
        return this.findOne({_id:id}).exec(cb)
    }
}
module.exports=OrderSchema;


