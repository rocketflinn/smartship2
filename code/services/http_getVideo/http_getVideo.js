var url = "http://en.nicetourisme.com/webcam-the-airport" ;
// trying to parse from this page to get
// http://films.viewsurf.com/nice02/10/23/media_1523535787.mp4
function getDailyMotionId(url) {
    var m = url.match(/^.+dailymotion.com\/((video|hub)\/([^_]+))?[^#]*(#video=([^_&]+))?/);
//    var m = url.match(/^.+dailymotion.com\/webcam-the-airport((mp4)\/([^_]+))?[^#]*(#video=([^_&]+))?/);
    return m ? m[5] || m[3] : null;
}

function http_getVideo(req, resp){
    
 resp.success(getDailyMotionId("http://www.dailymotion.com/video/x44lvd_rates-of-exchange-like-a-renegade_music"));   
}