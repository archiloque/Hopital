# Transforme le fichier json avec les données brute en un fichier javascript pour le site
# Prend en entrée le nom d'un fichier json d'entrée et le nom d'un fichier js en sortie

if ARGV.length != 2
  raise 'Deux noms de fichier à spécifier'
end

require 'rubygems'
require 'json'

adresses = JSON.parse IO.read(ARGV[0])

result = [];

TYPE_STRUCTURE = {'Etablissement public' => 'pu', 'Etablissement privé à but non lucratif' => 'pnl', 'Etablissement privé à but lucratif' => 'pl'}

adresses.each_value do |entry|
  if entry.has_key?('geolocalisation') && (entry['geolocalisation']['status'] == 'OK') && entry.has_key?('equipemement')
    result << { 'nom' => entry['raison_sociale'],
                'adresse' => entry['adresse_formattee'],
                'geolocalisation' => entry['geolocalisation']['location'],
                'type_structure' => TYPE_STRUCTURE[entry['type_structure']] }
  end
end

File.open(ARGV[1], 'w') do |f|
  f << "var adresses = \n"
  f.write(JSON.generate(result))
  f << ";"
end