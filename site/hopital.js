var map;
$(function () {
    var paris = new google.maps.LatLng(48.8579, 2.3518);

    var myOptions = {
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

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
        "prn": new google.maps.MarkerImage('2.png',
                new google.maps.Size(20, 34),
                new google.maps.Point(0, 0),
                new google.maps.Point(10, 34)),
        "prl": new google.maps.MarkerImage('3.png',
                new google.maps.Size(20, 34),
                new google.maps.Point(0, 0),
                new google.maps.Point(10, 34))};

    map.setCenter(paris);

    for (var i = 0; i < adresses.length; i++) {
        var adresse = adresses[i];
        adresse.displayed = false;
        adresse.marker = new google.maps.Marker({
            position: new google.maps.LatLng(adresse.geolocalisation.lat, adresse.geolocalisation.lng),
            map: null,
            title: adresse.nom,
            icon: images[adresse.type_structure]
        });
    }

});

function updateDisplay() {
    var pu = $('#ch_pu:checked').length == 1;
    var prn = $('#ch_prn:checked').length == 1;
    var prl = $('#ch_prl:checked').length == 1;

    for (var i = 0; i < adresses.length; i++) {
        var adresse = adresses[i];
        var displayed = false;
        switch (adresse.type_structure) {
            case "pu":
                displayed = pu;
                break;
            case "prn":
                displayed = prn;
                break;
            case "prl":
                displayed = prl;
                break;
            default:
        }
        if (displayed && (!adresse.displayed)) {
            adresse.marker.setMap(map);
            adresse.displayed = true;
        } else if ((!displayed) && adresse.displayed) {
            adresse.marker.setMap(null);
            adresse.displayed = false;
        }
    }
}