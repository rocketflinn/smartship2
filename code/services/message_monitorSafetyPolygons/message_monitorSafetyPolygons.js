var _assetData, _assetPoint;
function message_monitorSafetyPolygons(req, resp){
    //Environment Setup
    ClearBlade.init(req);
    _resp=resp;
    log(JSON.stringify(req));
    var geoObj = new geo('polar');
    //_assetData=JSON.parse(testPayload);
    _assetData=JSON.parse(req.params.body);
    //log(_assetData);

    //Asset Point
    _assetPoint=geoObj.Point(_assetData.location.latitude, _assetData.location.longitude);
    //Build Polygons
    var query = ClearBlade.Query({collectionName:GEOFENCETABLE});
    query.fetch(function(err, data){
        if(err) {
            log("Error: " + data);
            _resp.error(data);
        }
        else {
            //log(data);
            polygons={};
            for (var i=0;i<data.DATA.length;i++) {
                var p=JSON.parse(data.DATA[i].polygon);
                var points=[];
                for (var j=0;j<p.length;j++){
                    points.push(geoObj.Point(p[j][1], p[j][0]));
                }
                if (geoObj.Within(geoObj.Polygon(points),_assetPoint)) {
                    var msg = ClearBlade.Messaging();
                    _assetData.areaname=data.DATA[i].name;
                    _assetData.color=data.DATA[i].color;
                    msg.publish("alert/"+data.DATA[i].name, JSON.stringify(_assetData));
                    smsMsg="Area Encroachment: " + _assetData.areaname + "\r"
                        + _assetData.lastname + ", " + _assetData.firstname + "\r";
                    log(_assetData);
                    if (_assetData.phone.length>0) //Only transmit if a phone number is defined
                        sendSMS(smsMsg, _assetData.phone);
                }
            }
            //_resp.success(polygons);
        }
    });
}

function sendSMS(msg, phone){
    var options = {
    "auth":{
        user: TWILLIOSID,
        pass : TWILLIOAUTH
    },
    uri : "https://api.twilio.com/2010-04-01/Accounts/" + TWILLIOSID + "/SMS/Messages.json",
    "body":{
        "Body" : encodeURI(msg),
        "To" : phone.replace("+", "%2B"),
        "From": TWILLIOPHONE
    },
    "form":true
};

    var requestObject = ClearBlade.http().Request();
    requestObject.post(options,function(err,result){
        if(err){
            log("sendSMS Failed");
            _resp.error("sendSMS Failed");
        }else{
            log(result);
            _resp.success(result);
        }
    });   
}


