function message_ClearHistory(req, resp){
    //This erases the messages from the messagequeue to prevent overrunning storage on the micro instance.
    //Executed via a timer every 24 hours.
    ClearBlade.init({request: req});
    var msg = ClearBlade.Messaging();

    var callback = function (err, data) {
        if (err) {
            log("Error clearMessages: " + JSON.stringify(data));
            resp.error("Error clearMessages: " + JSON.stringify(data));
        } else {
            
            var i = 0;
            var total = data.length;

            var delCallback = function (deleteErr, deletedData) {
                if (err) {
                    log("deleteTopic: " + JSON.stringify(deletedData));
                    resp.error("unable to delete; " + JSON.stringify(deletedData));
                } else {
                    log("deleteTopic: " + JSON.stringify(deletedData));
                    i++;
                    
                    if (i != total) {
                        msg.getAndDeleteMessageHistory(data[i], 6000, new Date().getTime() / 1000, null, null, delCallback);
                    } else {
                        resp.success('done');
                    }
                }
            };

            if(data && data[i]) {
                msg.getAndDeleteMessageHistory(data[i], 6000, new Date().getTime() / 1000, null, null, delCallback);    
            } else {
                resp.success('nothing to delete');
            }
            
        }
    };
    msg.getCurrentTopics(callback);
}
