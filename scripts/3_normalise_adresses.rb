# Normalise des adresse d'une manière qui soit compatible avec l'API Google Maps
# Prend en entrée le nom d'un fichier json d'entrée et le nom d'un fichier json en sortie
# Normalise chaque item contenant la propriete adresse et la stocke sous adresse_normalisee

if ARGV.length != 2
  raise 'Deux noms de fichier à spécifier'
end

require 'rubygems'
require 'json'

REGEXP_ONLY_NUMERICS = Regexp.new('\d+')

adresses = JSON.parse IO.read(ARGV[0])
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

File.open(ARGV[1], 'w') {|f| f.write(JSON.pretty_generate(adresses)) }
