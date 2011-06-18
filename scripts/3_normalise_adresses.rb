# Normalise des adresse d'une manière qui soit compatible avec l'API Google Maps
# Entrée dans adresses.json sortie dans adresses_normalisees.json
# Normalise chaque item contenant la propriete adresse et la stocke sous adresse_normalisee

require 'json'

REGEXP_ONLY_NUMERICS = Regexp.new('\d+')

# on lit les données dans adresses.json
adresses = JSON.parse IO.read('adresses.json')
adresses.each_value do |entry|
  if entry.has_key?('adresse') && (!entry.has_key?('adresse_normalisee'))
    adresse = entry['adresse'].dup

    # sauts de ligne
    adresse.gsub!("\n", ' ').gsub!('  ', ' ')

    # cedex
    if i = adresse.index(' CEDEX ')
      # CEDEX puis un espace et des chiffres
      if REGEXP_ONLY_NUMERICS.match(adresse[i + 7, (adresse.length - (i + 7))])
        adresse = adresse[0, i]
      end
    elsif adresse.index(' CEDEX') == (adresse.length - 6)
      # se termine par CEDEX
      adresse = adresse[0, (adresse.length - 6)]
    end

    # BP
    if adresse.gsub!(' BP.', ' BP ') || adresse.gsub!(' B.P.', ' BP ') || adresse.gsub!(' B. P.', ' BP ') || adresse.gsub!(' BP', ' BP ')
      adresse.gsub!('  ', ' ')
      start_bp = adresse.index(' BP ')
      end_bp = start_bp + 4
      while REGEXP_ONLY_NUMERICS.match(adresse[end_bp, 1])
        end_bp += 1
      end
      adresse = adresse[0, start_bp] + adresse[end_bp, adresse.length - end_bp]
      adresse.gsub!('  ', ' ')
    end

    # on ajoute france à la fin de l'adresse
    adresse += ', FRANCE'

    entry['adresse_normalisee'] = adresse
  end
end

# on stocke le résultat dans adresses_normalisees.json
File.open('adresses_normalisees.json', 'w') { |f| f.write(JSON.pretty_generate(adresses)) }
