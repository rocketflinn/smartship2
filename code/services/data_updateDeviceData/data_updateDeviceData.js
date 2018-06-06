//Note: globals contains default settings
function data_updateDeviceData(req, resp){
    ClearBlade.init({request:req});
    _resp=resp;
    updateDeviceTable(req.params.id, req.params);
}

function updateDeviceTable(id, updates) {
    delete updates.id;
    var query = ClearBlade.Query({ collectionName: DEVICES });
    query.equalTo('id', id);
    var callback = function(err, data) {
        if(err)
            _resp.error(data);
        else
            _resp.success(data);
    };
    query.update(updates, callback);
}