# Transforme le fichier json avec les données brute en un fichier javascript pour le site
# Prend en entrée le nom d'un fichier json d'entrée et le nom d'un fichier js en sortie

if ARGV.length != 2
  raise 'Deux noms de fichier à spécifier'
end

require 'rubygems'
require 'json'

adresses = JSON.parse IO.read(ARGV[0])

result = [];

adresses.each_value do |entry|
  if entry.has_key?('geolocalisation') && (entry['geolocalisation']['status'] == 'OK')
    result << { 'nom' => entry['raison_sociale'],
                'adresse' => entry['adresse_formattee'],
                'geolocalisation' => entry['geolocalisation']['location'] }
  end
end

File.open(ARGV[1], 'w') do |f|
  f << "var adresses = \n"
  f.write(JSON.pretty_generate(result))
  f << ";"
end