# Lit la liste de codes finess et pour chacun d'eux récupère son nom et son adresse
# sur le site http://finess.sante.gouv.fr/
# le résultat est stocké en json dans le fichier adresses.json
# les éléments non trouvés ont un contenu vide

# Note: les données de http://finess.sante.gouv.fr sont soumis à une license d'utilisation

require 'cgi'
require 'uri'
require 'json'
require 'safariwatir'

browser = Watir::Safari.new

# va contenir le résultat
result = {}

# on itère sur les codes
File.open('finess.txt').each { |line|
  # on supprime d'éventuels espaces'
  line.strip!
  # on va à la page principale
  browser.goto 'http://finess.sante.gouv.fr/finess/actionRechercheSimple.do?order=reset'
  until browser.text_field(:id, 'nofiness').exists?
    sleep 1
  end
  browser.text_field(:id, 'nofiness').set(line)
  # on clique sur le bouton
  browser.button(:id, 'chercher').click
  i = 0
  until (i == 10) || browser.image(:title, 'Imprimer').exists?
    sleep 1
    i += 1
  end
  # s'il y a un bouton imprimer c'est q'uon a un résultat'
  if browser.image(:title, 'Imprimer').exists?
    # on cherche les infos dans la page
    table_result = browser.table(:id, 'enTeteRecherche')
    raison_sociale = table_result[1][2].text
    adresse = table_result[2][2].text
    result[line] = {:raison_sociale => raison_sociale, :adresse => adresse}
  else
    # sinon c'est qu'on a eu une popup d'alterte
    browser.alert.click
    result[line] = {}
    browser.alert().click()
  end
}

# on stocke le résultat dans adresses.json
File.open('adresses.json', 'w') { |f| f.write(JSON.pretty_generate(result)) }
