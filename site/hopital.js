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
$(function () {
    var paris = new google.maps.LatLng(48.8579, 2.3518);

    map = new google.maps.Map(document.getElementById("map_canvas"), {
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

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
        createMarker(adresses[i], images);
    }
});

function createMarker(adresse, images) {
    adresse.displayed = false;
    adresse.marker = new google.maps.Marker({
        position: new google.maps.LatLng(adresse.geolocalisation.lat, adresse.geolocalisation.lng),
        map: null,
        title: adresse.nom,
        icon: images[adresse.type_structure]
    });
    google.maps.event.addListener(adresse.marker, 'click', function() {
        showAdresse(adresse);
    });
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