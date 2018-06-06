//Note: globals contains default settings
function data_loadDeviceData(req, resp){
    ClearBlade.init({request:req});
    var query = ClearBlade.Query({ collectionName: DEVICES });
	query.ascending("lastname");
	
    query.fetch(function(err, data) {
        if(err)
            resp.error(data);
        else
            resp.success(data);
    });
}