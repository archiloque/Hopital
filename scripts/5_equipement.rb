# Récupère des informations à partir du site
# http://platines.sante.gouv.fr
# à partir des codes finess
# Prend en entrée le nom d'un fichier json d'entrée et le nom d'un fichier json en sortie
# Les informations stockées
# - l'équipement dans l'attribut equipement
# - le type de structure dans type_structure
if ARGV.length != 2
  raise 'Deux noms de fichier à spécifier'
end

require 'rubygems'
require 'json'
require 'nokogiri'
require 'open-uri'

adresses = JSON.parse IO.read(ARGV[0])

adresses.each_pair do |finess, entry|
  unless entry.has_key? 'equipement'
    p finess
    doc = Nokogiri::HTML(open("http://platines.sante.gouv.fr/fiche.php?fiche=etbts&fi=#{finess}"))
    entry['type_structure'] = doc.css("#b_menus > table > tbody > tr[2] > td").text
    equipement = entry['equipemement'] = {}
  end
end

File.open(ARGV[1], 'w') { |f| f.write(JSON.pretty_generate(adresses)) }
