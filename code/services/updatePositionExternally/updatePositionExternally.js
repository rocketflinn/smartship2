function updatePositionExternally(req, resp){
    // req.params.id = "111111119";
    // req.params.lat = 30.266762300000003;
    // req.params.lng =-97.7421237;
    // req.params.accuracy = "20";
    ClearBlade.init({"request":req});
    log(req);
    
    var d = new Date();
    var timestamp = d.toISOString();
        
    var sendMessage = function() {
        // var d = new Date();
        // var timestamp = d.toISOString();
        var payload = {
              "id": req.params.id,
              "imei": "865067026802739",
              "btId": "b091227664c9",
              "nfcId": "6802739",
              "batteryValue": 88,
              "location": {
                "timestamp": timestamp,
                "type": "External",
                "latitude": req.params.lat,
                "longitude": req.params.lng,
                "accuracy": req.params.accuracy
              },
              "state": {
                "current": {
                  "timestamp": timestamp,
                  "state": "SLEEP"
                },
                "pending": null
              },
              "capabilities": {
                "rx": false,
                "sos": false
              },
              "config": {
                "current": {
                  "activeInterval": 300,
                  "sleepInterval": 21600,
                  "mode": "POLLING"
                },
                "pending": null
              },
              "charging": false,
              "chargerConnected": false,
              "lastContact": timestamp,
              "firstname": req.params.firstname,
              "lastname": req.params.lastname,
              "icon": "https://image.flaticon.com/icons/svg/10/10522.svg",
              "phone": ""
            }
        var msg = ClearBlade.Messaging();
        msg.publish("location",JSON.stringify(payload));
        resp.success("Message published");
    }
    
    
    var query = ClearBlade.Query({collectionName: "yepzondevices"});

	// Column Type: String
	query.equalTo("id", req.params.id);
	
	var changes = {
        lat: req.params.lat,
        lng: req.params.lng,
        accuracy: req.params.accuracy,
        recorddate:timestamp,
        positiontimestamp:timestamp
    };
    var callback = function (err, data) {
        if (err) {
        	resp.error("update error : " + JSON.stringify(data));
        } else {
        	sendMessage();
        }
    };
    query.update(changes, callback);
    
}