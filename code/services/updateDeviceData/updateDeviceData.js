var _resp; //Global Resp Object
var _req; //Global Req Object
var DEVICES = "yepzondevices";

function updateDeviceData(req, resp){
    ClearBlade.init({request:req});
    _resp=resp;
    log(req.body);

}

function updateDeviceTable(id, updates) {
    var query = ClearBlade.Query({ collectionName: DEVICES });
    query.equalTo('id', id);
    var callback = function(err, data) {
        if(err)
            _resp.error(data);
        else
            _resp.success(data);
    };

    updates.recorddate = new Date(Date.now()).toISOString();
    query.update(updates, callback);
}