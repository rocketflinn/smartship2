var _resp; //Global Resp Object
var _req; //Global Req Object
var TOPIC = "location";
var DEVICES = "yepzondevices";

function LoadYepzonDevices() {
    var query = ClearBlade.Query({ collectionName: DEVICES });
    query.equalTo("poll", "true");
    query.setPage(100, 1); //Bad practice
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

function http_readYepzon(req, resp) {
    _resp = resp; //Assign Global Handler
    _req = req;

    ClearBlade.init({ request: req });

    devices = LoadYepzonDevices();
    //log(devices.length) ;
    //log(devices[0].id + "=" + devices[0].sharetoken) ;

    var apiURL = "https://platform.yepzon.com/tags";
    var apikey = "Mk6583eJPk5hnh0cDAjYMa0JHLo0w3Or1AtMjAdM"; // dflinn@clearblade.com login
    var requestObject = Requests();

    for (var i = 0; i < devices.length; i++) {

        var httpParameters = {
            "uri": apiURL,
            "full": true,
            "headers": {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
                "postman-token": "7e11d8a6-712a-1f42-9eaa-78f8fc28fc59", // just a random token for some reason
                "x-api-key": apikey
            },
            "body": {
                "id": devices[i].sharetoken,
                "idType": 'SHARE_TOKEN'
            }
        };

        requestObject.post(httpParameters, function(err, result) {
            if (err) {
                log("HTTP post on device [" + devices[i].id + "] error: " + err);
                //_resp.error(err);
            } else {
                //log(result);
                var content = JSON.parse(result);
                var body = JSON.parse(content.Body);
                //log(body) ;
                //var topic =  "yepzon/" + body.id;
                var topic = TOPIC;
                var msg = ClearBlade.Messaging();
                updateDeviceData(devices[i].id, {
                    lat: body.location.latitude,
                    lng: body.location.longitude,
                    accuracy: body.location.accuracy,
                    type: body.location.type,
                    devicestate:  body.state.current.state,
                    battery: body.batteryValue,
                    positiontimestamp: body.location.timestamp
                });
                body.firstname = devices[i].firstname;
                body.lastname = devices[i].lastname;
                body.icon = devices[i].icon;
                body.phone = devices[i].phone;
                log("Publishing topic: " + topic + " with payload " + JSON.stringify(body));
                msg.publish(topic, JSON.stringify(body));
            }
        });
    } // end of for loop
    resp.success("Sent device data to message queues");
} // end of function


function updateDeviceData(id, updates) {
    var query = ClearBlade.Query({ collectionName: DEVICES });
    query.equalTo('id', id);
    var callback = function(err, data) {};

    updates.recorddate = new Date(Date.now()).toISOString();
    query.update(updates, callback);
}