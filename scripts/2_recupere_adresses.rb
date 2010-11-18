# Lit un fichier contenu une liste de codes finess
# et pour chacun d'eux récupère son nom et son adresse
# sur le site http://finess.sante.gouv.fr/
# le résultat est sous forme json affiché dans la console
# les éléments non trouvés ont un contenu vide

# Note: les données de http://finess.sante.gouv.fr sont soumis à une license d'utilisation

require 'rubygems'
require 'cgi'
require 'safariwatir'
require 'json'

if ARGV.length != 1
  raise "Nom du fichier manquant"
end

browser = Watir::Safari.new
browser.goto "http://finess.sante.gouv.fr"

# on va jusqu'à la page
browser.link(:text, 'Recherche Simple').click
begin
  browser.button(:name, 'validConditions').click
rescue Watir::Exception::UnknownObjectException
end

# on itère sur les codes
result = {}
File.open(ARGV[0]).each { |line|
  line.strip!
  STDERR << "#{line}\n"
  browser.text_field(:name, 'nofiness').set(line)
  begin
    browser.button(:name, 'chercher').click
    table_result = browser.table(:id, 'enTeteRecherche')
    raison_sociale = table_result[1][2].text
    adresse = table_result[2][2].text
    result[line] = {:raison_sociale => raison_sociale, :adresse => adresse}
    browser.goto 'http://finess.sante.gouv.fr/finess/actionRechercheSimple.do?order=reset'
  rescue RuntimeError => e
    # quand le code est manquant le site affiche une fenêtre d'alerte dans la nouvelle page
    # qui se transforme en un timeout
    unless e.message == "Unable to load page within 10 seconds"
      raise e
    end
    result[line] = {}
    browser.alert().click()
  end
}
STDOUT << JSON.pretty_generate(result)
