# Récupère les information de géocodage ainsi que l'adresse formattée
# Entrée dans adresses_normalisees.json et sortie dans adresses_geolocalisee.json
# Récupère l'adresse dans la valeur "adresse_normalisee" et n'appelle google que si
# la clé geolocalisation n'est pas présente
# L'adresse formattée est stockée dans "adresse_formattee"
# Les informations de géolocalisation sont stockées dans l'attribut "geolocalisation"

require 'json'
require 'rest-client'

# on lit les données dans adresses_normalisees.json
adresses = JSON.parse IO.read('adresses_normalisees.json')

# Fait un appel à google maps avec l'adresse passée en paramètre et parse le retour sour forme json
def query adresse
  JSON.parse(RestClient.get 'http://maps.googleapis.com/maps/api/geocode/json',
                            {:params =>
                                 {:region => :FR,
                                  :language => :fr,
                                  :sensor => :false,
                                  :address => adresse}})
end

# Itère sur les adresses en gèrant un délai quand on fait trop de requêtes: augmentera de 2 secondes à chaque fois
delay = 0
adresses.each_value do |entry|

  if entry.has_key?('adresse_normalisee') && (!entry.has_key?('geolocalisation'))
    adresse = entry['adresse_normalisee']

    result = query(adresse)
    # dépassement du quota: on attend jusqu'à ce que ça passe
    while result['status'] == 'OVER_QUERY_LIMIT'
      delay += 2
      sleep delay
      result = query(adresse)
    end

    status = result['status']

    entry['geolocalisation'] = geolocalisation = {'status' => status}
    if status == 'OK'
      geolocalisation['partial_match'] = result['results'][0]['partial_match']
      geolocalisation['location'] = result['results'][0]['geometry']['location']
      geolocalisation['location_type'] = result['results'][0]['geometry']['location_type']
      entry['adresse_formattee'] = result['results'][0]['formatted_address']
    end
    sleep delay
  end
end

# on stocke le résultat dans adresses_geolocalisee.json
File.open('adresses_geolocalisee.json', 'w') { |f| f.write(JSON.pretty_generate(adresses)) }
