function message_polygonsProcessor(req, resp){
    ClearBlade.init(req);
    _resp=resp;
    log(JSON.stringify(req));
        var msg = JSON.parse(req.params.body);
        log(req.params.body);
        log(msg.action);
        if (msg.action.toLowerCase()==="create") {
            coordinates=JSON.stringify(msg.coordinates);
            log(coordinates);
            createRecord(msg.name, coordinates);
        }
        else if(msg.action.toLowerCase()==="delete") {
            deleteRecord(msg.item_id);
        }
        else if(msg.action.toLowerCase()==="update") {
            updateRecord(name, msg.coordinates);
        }
    publishPolygons();
}

function createRecord(name, coordinates) {
    if (coordinates) {
        var record = {
            name: name,
            polygon: coordinates,
            color: "#7698D3",
            opacity: "50",
            recorddate: new Date(Date.now()).toISOString()
        };
        var callback = function (err, data) {
            if (err) {
                log("error: " + JSON.stringify(data));
            	_resp.error(data);
            } else {
                log(data);
                publishPolygons();
            	_resp.success(data);
            }
        };
        var col = ClearBlade.Collection( {collectionName: GEOFENCETABLE } );
        col.create(record, callback);
        }
    resp.error("Empty Coordinates");
}

function deleteRecord(item_id) {
    var query = ClearBlade.Query({collectionName: GEOFENCETABLE});
    query.equalTo('item_id', item_id);
    var callback = function (err, data) {
        if (err) {
            log("update error : " + JSON.stringify(data));
        	_resp.error("update error : " + JSON.stringify(data));
        } else {
            log(JSON.stringify(data));
            publishPolygons();
        	_resp.success(data);
        }
    };
   	query.remove(callback);
}

function updateRecord(name, coordinates) {
    var query = new ClearBlade.Query();
    query.equalTo('name', name);
    var changes = {
        polygon: coordinates,
        recorddate: new Date(Date.now()).toISOString()
    };
    var callback = function (err, data) {
        if (err) {
            _resp.error("update error : " + JSON.stringify(data));
        } else {
            publishPolygons();
        	_resp.success(data);
        }
    };
   	var col = ClearBlade.Collection({collectionName:GEOFENCETABLE});
    col.update(query, changes, callback);
}


function publishPolygons() {
    var msg = ClearBlade.Messaging();
    var callback = function (err, data) {
        if (err) {
        	_resp.error("fetch error : " + JSON.stringify(data));
        } else {
            msg.publish(GEOFENCETOPIC, JSON.stringify(data.DATA));
        }
    };

   	var query = ClearBlade.Query({collectionName: GEOFENCETABLE});
	query.ascending("name");
    query.fetch(callback);
}