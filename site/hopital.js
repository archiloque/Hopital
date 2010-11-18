$(function () {
    var paris = new google.maps.LatLng(48.8579, 2.3518);

    var myOptions = {
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    //    if (navigator.geolocation) {
    //        navigator.geolocation.getCurrentPosition(function(position) {
    //            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    //            map.setCenter(initialLocation);
    //        }, function() {
    //            map.setCenter(paris);
    //        });
    //    } else {
    //        map.setCenter(paris);
    //    }

    var images = {"pu": new google.maps.MarkerImage('1.png',
            new google.maps.Size(20, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34)),
        "pnl": new google.maps.MarkerImage('2.png',
                new google.maps.Size(20, 34),
                new google.maps.Point(0, 0),
                new google.maps.Point(10, 34)),
        "pl": new google.maps.MarkerImage('3.png',
                new google.maps.Size(20, 34),
                new google.maps.Point(0, 0),
                new google.maps.Point(10, 34))};

    map.setCenter(paris);

    for (var i = 0; i < adresses.length; i++) {
        var adresse = adresses[i];
        new google.maps.Marker({
            position: new google.maps.LatLng(adresse.geolocalisation.lat, adresse.geolocalisation.lng),
            map: map,
            title: adresse.nom,
            icon: images[adresse.type_structure]
        });
    }

});



