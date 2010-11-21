var EQUIPEMENT_LIST = {
    "scanner" : "Scanner",
    "IRM" : "IRM",
    "scintillation" : "Caméra à scintillation",
    "TEP" : "TEP",
    "hemodynamique": "Salles d'hémodynamique",
    "coronarographie": "Salles de coronarographie"
};

var ACTIVITE_LIST = {
    "medecine": "Médecine",
    "chirurgie": "Chirurgie",
    "obstetrique": "Obstétrique",
    "psychiatrie": 'Psychiatrie'
};

var map;
var geocoder;
var directionsService;
var directionsDisplay;
var possible_images;

$(function () {
    var paris = new google.maps.LatLng(48.8579, 2.3518);

    map = new google.maps.Map(document.getElementById("map_canvas"), {
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        region: "FR",
        language: "fr"
    });

    possible_images = {"pu": new google.maps.MarkerImage('1.png',
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
        createMarker(adresses[i]);
    }

    geocoder = new google.maps.Geocoder();
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
});

function createMarker(adresse) {
    adresse.displayed = false;
    adresse.marker = new google.maps.Marker({
        position: new google.maps.LatLng(adresse.geolocalisation.lat, adresse.geolocalisation.lng),
        map: null,
        title: adresse.nom,
        icon: possible_images[adresse.type_structure]
    });
    google.maps.event.addListener(adresse.marker, 'click', function() {
        showAdresse(adresse);
    });
}

var userPositionMarker = null;

function updateAddress() {
    var textValue = $("#adresse").val();
    geocoder.geocode({ address: textValue, region: "FR",
        language: "fr"}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            if (userPositionMarker) {
                userPositionMarker.setMap(null);
            }
            userPositionMarker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                icon: new google.maps.MarkerImage('4.png',
                        new google.maps.Size(20, 34),
                        new google.maps.Point(0, 0),
                        new google.maps.Point(10, 34))
            });
        } else {
            alert("Impossible de trouver l'adresse");
        }
    });
}

function rad(x) {
    return x * Math.PI / 180;
}

var highlited = null;

function findNearest() {
    if (!userPositionMarker) {
        alert("Vous devez d'abord saisir votre adresse")
    } else {
        var R = 6371;
        var nearest = null;
        var minDistance = -1;
        var lat = userPositionMarker.position.lat();
        var lng = userPositionMarker.position.lng();
        for (var i = 0; i < adresses.length; i++) {
            var adresse = adresses[i];
            if (adresse.displayed) {
                var mlat = adresse.marker.position.lat();
                var mlng = adresse.marker.position.lng();
                var dLat = rad(mlat - lat);
                var dLong = rad(mlng - lng);
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;
                if ((minDistance == -1) || (d < minDistance)) {
                    minDistance = d;
                    nearest = adresse;
                }
            }
        }
        if (nearest == null) {
            alert("Aucun hopital n'est affiché")
        } else {
            if (highlited != null) {
                highlited.marker.setIcon(possible_images[adresse.type_structure]);
            }
            highlited = nearest;
            highlited.marker.setIcon(new google.maps.MarkerImage('5.png',
                    new google.maps.Size(20, 34),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(10, 34)));
            showAdresse(nearest);
            var request = {
                origin: userPositionMarker.position,
                destination: nearest.marker.position,
                travelMode: google.maps.DirectionsTravelMode.DRIVING,
                unitSystem: google.maps.DirectionsUnitSystem.METRIC,
                region: "FR"
            };
            directionsService.route(request, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(result);
                    var leg = result.routes[0].legs[0];
                    alert(leg.distance.text + ", " + leg.duration.text);
                } else {
                    alert("Route non trouvée")
                }
            });
        }
    }
}
var caracteristiqueShown = false;

function showAdresse(info) {
    var content = "<ul><li>" + info.nom + "</li><li>" + info.adresse + "</li>";

    for (var i in ACTIVITE_LIST) {
        content += "<li>" + ACTIVITE_LIST[i] + " : " + (info.caracteristiques[i] ? 'oui' : 'non') + "</li>";
    }

    var equipement = [];
    for (i in EQUIPEMENT_LIST) {
        if (info.caracteristiques[i]) {
            equipement.push(EQUIPEMENT_LIST[i]);
        }
    }
    content += "<li>" + equipement.join(", ") + "</li>";

    content += "</ul>";
    $("#caracteristiques").html(content);
    if (!caracteristiqueShown) {
        $("#caracteristiques").slideDown();
        caracteristiqueShown = true;
    }
}


function clickIndifferent() {
    if ($('#e_:checked').length == 1) {
        $('.e_s').attr('checked', false);
    } else {
        $('.e_s').attr('checked', true);
    }
}

function clickSpecifique() {
    $('#e_').attr('checked', $('.e_s:checked').length == 0);
}

function updateDisplay() {
    if (caracteristiqueShown) {
        $("#caracteristiques").slideUp();
        caracteristiqueShown = false;
    }

    var pu = $('#ch_pu:checked').length == 1;
    var prn = $('#ch_prn:checked').length == 1;
    var prl = $('#ch_prl:checked').length == 1;

    var e_ = $('#e_:checked').length == 1;

    var em = $('#e_m:checked').length == 1;
    var ech = $('#e_ch:checked').length == 1;
    var eo = $('#e_o:checked').length == 1;
    var ep = $('#e_p:checked').length == 1;

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

        if (!e_) {
            var caracteristiques = adresse.caracteristiques;
            if (es) {
                displayed = displayed && caracteristiques.scanner;
            }
            if (ei) {
                displayed = displayed && caracteristiques.IRM;
            }
            if (ex) {
                displayed = displayed && caracteristiques.scintillation;
            }
            if (et) {
                displayed = displayed && caracteristiques.TEP;
            }
            if (eh) {
                displayed = displayed && caracteristiques.hemodynamique;
            }
            if (ec) {
                displayed = displayed && caracteristiques.coronarographie;
            }

            if (em) {
                displayed = displayed && caracteristiques.medecine;
            }
            if (ech) {
                displayed = displayed && caracteristiques.chirurgie;
            }
            if (eo) {
                displayed = displayed && caracteristiques.obstetrique;
            }
            if (ep) {
                displayed = displayed && caracteristiques.psychiatrie;
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