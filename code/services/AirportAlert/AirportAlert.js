function AirportAlert(req, resp){
    
    var alert = {
        "firstname": "Airbus",
        "lastname": "A3200",
        "areaname": "Airport",
        "color": "#7698D3"
    }

    ClearBlade.init(req);
                    
    var msg = ClearBlade.Messaging();
    msg.publish("alert/Airport", JSON.stringify(alert));

    resp.success (alert) ;
}