var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;
var ChatSchema=new Schema({
    from:{
        type:ObjectId,
        ref:'Customer'
    },
    to:{
        type:ObjectId,
        ref:'Customer'
    },
    content:String,
    read:{
        type:Boolean,
        default:false
    },
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
ChatSchema.pre('save',function (next) {
    if(this.isNew){
        this.meta.createAt=this.meta.createAt=Date.now()
    }else {
        this.meta.updateAt=Date.now();
    }
    next();
})
ChatSchema.statics={
    fetch:function (cb) {
        return this.find({}).sort('meta.createAt').exec(cb)
    },
    findById:function (id,cb) {
        return this.findOne({_id:id}).exec(cb)
    }
}
module.exports=ChatSchema;


