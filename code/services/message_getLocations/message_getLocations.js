function message_getLocations(req, resp){

    var clearblade = ClearBlade.init({request:req});
    var timeInMs = Date.now();
    // req.params.imei ="353161071697059";
    // req.params.number = 20 ; // history
    
    //var imei = "353161071697059" ;
    var imei = req.params.imei ;
    
    log ("imei is: "+req.params.imei);

    var msg = ClearBlade.Messaging();
	msg.getMessageHistory("at5000adapter/in/"+imei, timeInMs, 25, function(err, body) {
		if(err) {
			resp.error("message history error : " + JSON.stringify(data));
		} else {
 			//resp.success(body);
			var points=[];
			var moveover = .04 ;   // this is a hack for now to simulate the device moving
			for (var i = 0; i<body.length; i++){
			    var message = body[i];
			    message = JSON.parse(message.message);
			    //resp.success(message);
			    var point = { 
			        "imei": message.imei,
			        "lat": message.messages[0].latitude, // + ( moveover*i ), 
			        "long": message.messages[0].longitude //+ ( moveover*i)
			    } ;
			    points.push(point);
			}
			
			resp.success(points);
		}
	});
}