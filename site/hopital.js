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

function clickEquipementIndifferent() {
    if ($('#e_:checked').length == 1) {
        $('.e_s').attr('checked', false);
    } else {
        $('.e_s').attr('checked', true);
    }
}

function clickEquipementSpecifique() {
    $('#e_').attr('checked', $('.e_s:checked').length == 0);
}

function updateDisplay() {
    var pu = $('#ch_pu:checked').length == 1;
    var prn = $('#ch_prn:checked').length == 1;
    var prl = $('#ch_prl:checked').length == 1;

    var e_ = $('#e_:checked').length == 1;

    var es = $('#e_s:checked').length == 1;
    var ei = $('#e_i:checked').length == 1;
    var ex = $('#e_x:checked').length == 1;
    var et = $('#e_t:checked').length == 1;
    var eh = $('#e_h:checked').length == 1;
    var ec = $('#e_c:checked').length == 1;

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

        if(!e_) {
            var equipement = adresse.equipement;
            if(es) {
                displayed = displayed && equipement.scanner;
            }
            if(ei) {
                displayed = displayed && equipement.IRM;
            }
            if(ex) {
                displayed = displayed && equipement.scintillation;
            }
            if(et) {
                displayed = displayed && equipement.TEP;
            }
            if(eh) {
                displayed = displayed && equipement.hemodynamique;
            }
            if(ec) {
                displayed = displayed && equipement.coronarographie;
            }
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