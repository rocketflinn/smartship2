function data_loadPolygons(req, resp){
    ClearBlade.init(req);
    var callback = function (err, data) {
        if (err) {
        	resp.error("fetch error : " + JSON.stringify(data));
        } else {
        	resp.success(data);
        }
    };

   	var col = ClearBlade.Collection({collectionName:GEOFENCETABLE});
    col.fetch(callback);
}