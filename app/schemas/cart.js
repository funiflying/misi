var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;
var CartSchema=new Schema({
    product:{
        type:ObjectId,
        ref:'Product'
    },
    sid:String,
    customer:{
        type:ObjectId,
        ref:'Customer'
    },
    specify:String,
    count:Number,
    price:Number,
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
CartSchema.pre('save',function (next) {
    if(this.isNew){
        this.meta.createAt=this.meta.createAt=Date.now()
    }else {
        this.meta.updateAt=Date.now();
    }
    next();
})
CartSchema.statics={
    fetch:function (cb) {
        return this.find({}).sort('meta.createAt').exec(cb)
    },
    findById:function (id,cb) {
        return this.findOne({_id:id}).exec(cb)
    }
}
module.exports=CartSchema;


