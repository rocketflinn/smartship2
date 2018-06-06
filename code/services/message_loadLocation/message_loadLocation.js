var _resp; //Global Resp Object
var _req; //Global Req Object
var TOPIC = "location";

// temp object to work with code
var bodyCHANGEME = {
  "imei": "353161071697059",
  "product_code": "740111",
  "messages": [
    {
      "message_type": "1G",
      "date_and_time": "180411133620",
      "gps_status": "A",
      "original_latitude": "5440.1737N",
      "original_longitude": "00127.1582W",
      "speed": "0.0",
      "course": "0",
      "hdop": "1.0",
      "status_code": "4000002A",
      "formatted_timestamp": "2018-04-11T13:36:20Z",
      "latitude": 54.66956166666667,
      "longitude": 1.4526333333333334
    },
    {
      "message_type": "2G",
      "date_and_time": "180411133620",
      "number_of_gps_satellites": "11",
      "altitude": "116.6",
      "external_power_input_reading": "00.04",
      "internal_power_input_reading": "03.72",
      "odometer": "002164558.5",
      "formatted_timestamp": "2018-04-11T13:36:20Z"
    }
  ]
};


// this function listens to the incoming arknav message queue and translates it for the portal.  Sends it to the location queue and then updates some metadata to the device table

function LoadArknavDevice(imei) {
    var query = ClearBlade.Query({ collectionName: DEVICES });
    query.setPage(100, 1); //Bad practice
    query.equalTo('imei', imei);
    var rtn;
    query.fetch(function(err, data) {
        if (err) {
            _resp.error("loadData: initialization error " + JSON.stringify(data));
        } else {
            rtn = data.DATA;
            //log(rtn);
        }
    });
    return (rtn);
}

function message_loadLocation(req, resp){

    _resp = resp; //Assign Global Handler
    _req = req;

    ClearBlade.init({ request: req });

    var body = JSON.parse(req.params.body);  // comment out for testing
    var imei = body.imei ;
    
    log ("lat: " + body.messages[0].latitude + " long: " + body.messages[0].longitude );
    
    var lat = convertDMSToDD (body.messages[0].original_latitude);
    var long = convertDMSToDD (body.messages[0].original_longitude);
    log ("orig lat: " + lat + " orig long: " + long );
    
    device = LoadArknavDevice(imei);

    var topic = TOPIC;
    var msg = ClearBlade.Messaging();
    updateDeviceData(imei, {
        lat: body.messages[0].latitude,
        long: body.messages[0].longitude,
        positiontimestamp: body.messages[0].formatted_timestamp
    });
    // now send to final queue
    body.firstname = device.firstname;
    body.lastname = device.lastname;
    body.icon = device.icon;
    body.location = {} ;  // put in location object for portal code
    // using my calc not the adapter for now
    body.location.latitude = lat ; //body.messages[0].latitude ;
    body.location.longitude = long ; //body.messages[0].longitude ;
    
    //log("Publishing topic: " + topic + " with payload " + JSON.stringify(body));
    msg.publish(topic, JSON.stringify(body));

    resp.success(device);
} // end of function


function updateDeviceData(imei, updates) {
    log("imei: " + imei) ;
    log (updates);
    var query = ClearBlade.Query({ collectionName: DEVICES });
    query.equalTo('imei', imei);
    var callback = function (err, data) {
        if (err) {
        	_resp.error("updateDeviceData error : " + JSON.stringify(data));
        } else {
        	//_resp.success(data);
        	// do nothing
        }
    };

    //updates.recorddate = new Date(Date.now()).toISOString();
    query.update(updates, callback);
}


function convertDMSToDD (dms) {
    log ("convertDMSToDD: " + dms );

    var goo = dms.split('.') ;  // ["5432", "0433N"]
    var degrees ;
    var minutes ;
    var seconds ;

    if ( dms.includes('E') || dms.includes('W')) {
        degrees = goo[0].substr(0,3);
        minutes = goo[0].substr(3,2);
        seconds = dms.substr(5,4);
    } else {
        degrees = goo[0].substr(0,2);
        minutes = goo[0].substr(2,2);
        seconds = dms.substr(4,4);
    }
    var direction = goo[1].substr(4,1);
    
   // var dd = parseInt(degrees) + (parseInt(minutes) / 60) + (parseInt(seconds) / 3600);
    var dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);
    /*
     log('degrees: '+degrees)
     log('minutes: '+minutes)
     log('seconds: '+seconds)
     log('direction: '+direction)
     */
     if (direction == 'S' || direction == 'W') {
       dd = dd * -1;
     } // Don't do anything for N or E
     return dd;
}
