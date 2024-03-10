// Fonction pour analyser le poème
function analyserPoeme() {
    var poeme = document.getElementById('poeme').value;
    var mots = poeme.match(/\b\w+\b/g); // Séparer les mots
    var phrases = poeme.match(/[^.!?]+[.!?]+/g); // Séparer les phrases

    // Analyse des mots les plus fréquents
    var motsFrequents = compterMotsFrequents(mots);

    // Calcul de la richesse lexicale
    var richesseLexicale = (new Set(mots)).size / mots.length * 100;

    // Nombre de phrases
    var nombrePhrases = phrases.length;

    // Longueur moyenne des mots par phrase
    var longueurMoyenneMots = mots.length / nombrePhrases;

    // Typologie des strophes
    var strophes = compterStrophes(poeme);

    // Typologie des vers
    var vers = compterVers(poeme);

    // Afficher les résultats
    document.getElementById('resultats').innerHTML = "Les dix mots les plus fréquents : " + motsFrequents.join(", ") + "<br>" +
        "Richesse lexicale : " + richesseLexicale.toFixed(2) + "%<br>" +
        "Nombre de phrases : " + nombrePhrases + "<br>" +
        "Longueur moyenne des mots par phrase : " + longueurMoyenneMots.toFixed(2) + "<br>" +
        "Typologie des strophes : " + strophes + "<br>" +
        "Typologie des vers : " + vers;
}

// Fonction pour compter les mots les plus fréquents
function compterMotsFrequents(mots) {
    var compteur = {};
    mots.forEach(function(mot) {
        mot = mot.toLowerCase();
        if (compteur[mot]) {
            compteur[mot]++;
        } else {
            compteur[mot] = 1;
        }
    });
    var tries = Object.keys(compteur).sort(function(a, b) {
        return compteur[b] - compteur[a];
    });
    return tries.slice(0, 10);
}

// Fonction pour compter les strophes
function compterStrophes(poeme) {
    // Implémentez votre logique ici pour compter les strophes
}

// Fonction pour compter les vers
function compterVers(poeme) {
    // Implémentez votre logique ici pour compter les vers
}

// Attacher la fonction analyserPoeme à l'événement de clic sur le bouton
document.getElementById('boutonAnalyser').addEventListener('click', analyserPoeme);