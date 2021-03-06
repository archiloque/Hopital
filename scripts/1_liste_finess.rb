# Récupère la liste des codes finess contenu du site http://platines.sante.gouv.fr
# Et les sort dans le fichier finess.txt
# on utilise watir car il faut cliquer sur des pop-up pour accèder aux résultats

require 'cgi'
require 'uri'
require 'safariwatir'

# On ouvre Watir sur la page de sommaire
browser = Watir::Safari.new
browser.goto "http://platines.sante.gouv.fr"
browser.button(:name, 'bchercher').click
browser.set_fast_speed

# suivant les cookies il faut activer l'affichage des résutats
# puis on récupère le nombre d'entrées et on en déduit le nombre de pages
possible_link = browser.links.find { |link| link.title.index('Afficher les') }
if possible_link
  entries_number = possible_link.text[12, possible_link.text.index(' ', 13) - 13].to_i
else
  possible_link = browser.links.find { |link| link.title.index('Masquer les') }
  entries_number = possible_link.text[12, possible_link.text.index(' ', 12) - 12].to_i
end

pages_number = (entries_number.to_f / 15).ceil

# le fichier de sortie
File.open('finess.txt', 'w') do |out|
# pour chaque page on récupére les code finess dans les urls
  0.upto(pages_number - 1) do |i|
    browser.goto("http://platines.sante.gouv.fr/index.php?fiche=&fi=&afficher=o&etablissement=&ville=&statut=&depa=&regi=&scanner=&irm=&cam_scint=&tep=&salle_hemo=&salle_coro=&maternite=&maternite1=&maternite2=&maternite3=&struct_urgence=&reanimation=&brule=&chir_cardiaque=&neuro=&radio=&chimio=&dialyse=&readaptation=&typo=&r_p=1&p=" + i.to_s)
    browser.divs.each do |div|
      if div.id == 'result'
        div.links.each do |link|
          out << "#{CGI::parse(URI.parse(link.url.strip).query)['fi'][0]}\n"
        end
      end
    end
  end
end