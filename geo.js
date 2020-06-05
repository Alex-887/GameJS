
function Geo(position){


    //latitude and longitude of the user
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;



    google.maps.event.addDomListener('window', 'load', loadMap(lat, lng));



    //if()
    //   alert("At least you are not mexican");

}

function loadMap(lat,lng){


    let options = {

        zoom : 8,
        //on what the world will be centered :
        center : new google.maps.LatLng(lat, lng),
        mapTypeId : google.maps.MapTypeId.ROADMAP


    };

    map = new google.maps.Map(document.getElementById('map'), options);

    let marker = new google.maps.Marker({
        map : map,
        title : 'President' ,
        position :  new google.maps.LatLng(lat, lng),

    });


}


function ErrorGeo(error){

    let msg;

    switch(error.code){
        case error.TIMEOUT:
       break;
    msg = 'Request time out';
        case error.UNKNOWN_ERROR :
            break;
    msg = 'An unknown error has occured';
            break;
        case error.POSITION_UNAVAILABLE:
    msg = 'A technical error has occured';
            break;
        case error.PERMISSION_DENIED:
    msg = 'You denied geolocalisation';
            break;

    }

    alert(msg);



}


if(navigator.geolocation){ //if the geolocation is supported by the navigator

    //get the latititude and longitude, error message, maximumAge => directly ask the navigator cache 120000 = 2 minutes

    navigator.geolocation.getCurrentPosition(Geo, ErrorGeo, { maximumAge : 120000} );

}

else{

}
