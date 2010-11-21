# Récupère des informations à partir du site
# http://platines.sante.gouv.fr
# à partir des codes finess
# Prend en entrée le nom d'un fichier json d'entrée et le nom d'un fichier json en sortie
# Les informations stockées
# - les caractéristiques dans l'attribut caracteristiques
# - le type de structure dans type_structure
if ARGV.length != 2
  raise 'Deux noms de fichier à spécifier'
end

require 'rubygems'
require 'json'
require 'nokogiri'
require 'open-uri'

adresses = JSON.parse IO.read(ARGV[0])

ID_AIDE_EQUIPEMENT = {'scanner' => 30,
                      'IRM' => 31,
                      'scintillation' => 32,
                      'TEP' => 33,
                      'hemodynamique' => 34,
                      'coronarographie' => 35}

INDEX_LITS = {'medecine' => 4, 'chirurgie' => 5, 'obstetrique' => 6, 'psychiatrie' => 8}

adresses.each_pair do |finess, entry|
  unless entry.has_key? 'caracteristiques'
    p finess
    doc = Nokogiri::HTML(open("http://platines.sante.gouv.fr/fiche.php?fiche=etbts&fi=#{finess}"))
    entry['type_structure'] = doc.css("#b_menus > table > tbody > tr[2] > td").text
    caracteristiques = entry['caracteristiques'] = {}
    ID_AIDE_EQUIPEMENT.each_pair do |nom, id|
      # pour l'équipement on cherche le lien vers l'aide qui est de la forme href='aide.php?nu=XXX'
      # avec XXX qui est dans la liste ID_AIDE_EQUIPEMENT
      caracteristiques[nom] = (doc.search("//a[@href='aide.php?nu=#{id}']")[0].parent.parent.children[2].children[0].text == 'oui')
    end

    INDEX_LITS.each_pair do |nom, id|
      # pour les lits on localise simplement la bonne case
      caracteristiques[nom] = (doc.search("//div[@id='block_1']//tr[#{id}]//td[2]").text == '0')
    end

  end
end

File.open(ARGV[1], 'w') { |f| f.write(JSON.pretty_generate(adresses)) }
