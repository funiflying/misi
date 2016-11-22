
var Customer=require('../models/customer')
module.exports=function (io,app) {
    var clients = {};
    var customers=[];

    io.sockets.on('connection', function (socket) {
        socket.on('online', function (data) {
            var from=data.from;
            Customer.find({_id:{$ne:from}},'name _id avatar').exec(function (err, users) {
                if (err) {
                    console.log(err)
                }
                customers=users;
                clients[from]=socket;
                socket.emit('online',customers)
            });
        });

        socket.on('chat', function (data) {
            data = JSON.parse(data);
            if(clients[data.to]){
                clients[data.to].emit('chat',data)
            }
        });
    });
}