String.prototype.replaceAll = function( token, newToken, ignoreCase ) {
    var _token;
    var str = this + "";
    var i = -1;
    if ( typeof token === "string" ) {
        if ( ignoreCase ) {
            _token = token.toLowerCase();
            while( (
                i = str.toLowerCase().indexOf(
                    token, i >= 0 ? i + newToken.length : 0
                ) ) !== -1
            ) {
                str = str.substring( 0, i ) +
                    newToken +
                    str.substring( i + token.length );
            }
        } else {
            return this.split( token ).join( newToken );
        }
    }
return str;
};

window.onload = function() {
    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0];
        var textType = /text.*/;

        if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
                fileDisplayArea.innerText = reader.result;
            }

            reader.readAsText(file);    
        } else {
            fileDisplayArea.innerText = "File not supported!"
        }
    });
}

function uppercase() {
    if (document.getElementById("fileDisplayArea").innerHTML=="") {
        empty(); // Si la partie "fileDisplayArea" ne contient rien (aucun fichier selectionné), alors on exécute la fonction "empty" //
    }
    else {
        var text = document.getElementById("fileDisplayArea").innerText; // récupération du texte //
        var lowercase = text.toUpperCase(); // transforme le texte en minuscules //
        document.getElementById("page-analysis").innerText = lowercase; // affiche le résultat dans l'élément "page-analysis" //
    }
}

function empty() {
    alert("Merci de sélectionner un fichier pour commencer !"); 
}

function splittext() {
    if (document.getElementById("fileDisplayArea").innerHTML=="") {
        empty(); // Si la partie "fileDisplayArea" ne contient rien (aucun fichier sélectionné), alors on exécute la fonction "empty" //
    }
    else {
        queryDelim = document.getElementById("delimID").value;
        if (queryDelim=="") {
            alert("Merci de saisir au moins un délimiteur !") // Alerte si l'input est vide //
        }

        /* on prepare la regexp finale pour segmenter le texte en "mots" */
        queryDelim += "\n\s\t\""; 
        queryDelim2 = queryDelim.replace(/(.)/gi, "\\$1");
        DictionnaireSource = new Object();
        NBMOTTOTALSource = 0;	
        NBMOTSource = 0;
        var text = document.getElementById("fileDisplayArea"); // récupération du texte //
        var lines = text.innerText.split("\n"); // segmentation du texte en lignes //

        for (var nblines = 0 ; nblines < lines.length ; nblines++) {
            var contentxt = lines[nblines];
            contentxt = contentxt.replace(/<\/?[^>]+>/gi, ""); // suppression des balises résiduelles //
            contentxt = contentxt.replaceAll("<"," ");
            contentxt = contentxt.replaceAll(">"," ");
            var reg0=new RegExp("^["+queryDelim2+"]", "g");
            contentxt.replace(reg0,""); // suppression des délimiteurs en début de chaîne //
            var reg1=new RegExp("["+queryDelim2+"]$", "g");
            contentxt.replace(reg1,""); // suppression des délimiteurs en fin de chaîne //
            var reg = new RegExp("["+queryDelim2+"]", "g");
            var LISTEDEMOTS=contentxt.split(reg); // segmentation en mots //

            for (var nbmot = 0 ; nbmot < LISTEDEMOTS.length ; nbmot++) {
                if ((LISTEDEMOTS[nbmot] != " ") && (LISTEDEMOTS[nbmot] != "")) {
                    NBMOTTOTALSource = NBMOTTOTALSource+1;
                    if (DictionnaireSource[LISTEDEMOTS[nbmot]] === undefined) {
                        DictionnaireSource[LISTEDEMOTS[nbmot]] = 1;
                        NBMOTSource+=1;
                    }
                    else {
                        DictionnaireSource[LISTEDEMOTS[nbmot]] = DictionnaireSource[LISTEDEMOTS[nbmot]] + 1;
                    }
                }
            }
        }

        document.getElementById('page-analysis').innerHTML = '<small><span style="text-align: center; padding: 1pt; background:#FDBBD2">Nombre d\'occurrences de mots : '+NBMOTTOTALSource+' <br/> Nombre de mots différents : '+NBMOTSource +'</span></small>';
    }  
}

function concordance() {
    if (document.getElementById("fileDisplayArea").innerHTML=="") {
        empty(); // Alerte si aucun fichier n'a été sélectionné //
    } else {
        if ((document.getElementById('poleID').value=="Entrez le pôle de la concordance") || (document.getElementById('poleID').value=="")) {
            alert("Merci de saisir un pôle !"); // Alerte si aucun pôle n'a été saisi //
        } else {
            document.getElementById('page-analysis').innerHTML =""; // nettoyage de la zone de résultats //
            
            // récupération des deux paramètres du calcul //
            var pole = document.getElementById('poleID').value;
            var longueur = document.getElementById('lgID').value;
            
            var allLines = document.getElementById('fileDisplayArea').innerText; // récupération du texte //
            
            // on va construire l'expression régulière pour segmenter en mots
            var queryDelim = document.getElementById('delimID').value;
            queryDelim += "\n\s\t";
            var queryDelim2 = queryDelim.replace(/(.)/gi, "\\$1");
            var reg = new RegExp("["+queryDelim2+"]+", "g");
            var LISTEDEMOTS=allLines.split(reg); // segmentation du texte en mots d'après les délimiteurs définis par l'expression régulière //
            
            var table1=''; // création du tableau //
            table1 += '<table align="center" class="myTable">';
            table1 += '<tr><th colspan="3"><b>Concordance exacte</b></th></tr><tr>';
            table1 +='    <th width="40%">contexte gauche</th>';
            table1 +='    <th width="20%">pôle</th>';
            table1 +='    <th width="40%">contexte droit</th>';
            table1 += '</tr>';
            
            var table2=''; // création du tableau //
            table2 += '<table align="center" class="myTable">';
            table2 += '<tr><th colspan="3"><b>Concordance partielle</b></th></tr><tr>';
            table2 +='    <th width="40%">contexte gauche</th>';
            table2 +='    <th width="20%">pôle</th>';
            table2 +='    <th width="40%">contexte droit</th>';
            table2 += '</tr>';

            // on parcourt la liste des mots à la recherche du pôle //
            for (var nbmot = 0 ; nbmot < LISTEDEMOTS.length ; nbmot++) {    
                var unmot = LISTEDEMOTS[nbmot];
                // est-ce que le mot en cours est le pôle ?
                var reg = new RegExp("\\b"+pole+"\\b");
                var reg2 = new RegExp("\\w+"+pole+"\\b");
                var reg3 = new RegExp("\\w+"+pole+"\\w+");
                var reg4 = new RegExp("\\b"+pole+"\\w+");
                
                if (unmot.search(reg) > -1) {
                    // si c'est le pôle on reconstruit ses contextes gauche et droit
                    var contextedroit = "";
                    var contextegauche = "";
                    
                    for (var i = 1 ; i <= longueur ; i++) {
                        if (nbmot+i <= LISTEDEMOTS.length) { // il ne faut pas déborder à droite de la liste
                            contextedroit=contextedroit+LISTEDEMOTS[nbmot+i]+ " ";
                        }
                        if (nbmot-i >= 0) { // il ne faut pas aller en deça de l'indice 0 dans la liste
                            contextegauche =  " "+LISTEDEMOTS[nbmot-i]+contextegauche;
                        }
                    }
                    
                    var resutmp = unmot.replace(pole, "<font color='red'>"+pole+"</font>");
                    // on ajoute la ligne de contexte dans le tableau html en construction
                    table1 += "<tr><td>"+contextegauche+"</td><td>"+resutmp+"</td><td>"+contextedroit+"</td></tr>";
                }

                if (unmot.search(reg2) > -1) {
                    // si c'est le pôle on reconstruit ses contextes gauche et droit
                    var contextedroit = "";
                    var contextegauche = "";
                    
                    for (var i = 1 ; i <= longueur ; i++) {
                        if (nbmot+i <= LISTEDEMOTS.length) { // il ne faut pas déborder à droite de la liste
                            contextedroit=contextedroit+LISTEDEMOTS[nbmot+i]+ " ";
                        }
                        if (nbmot-i >= 0) { // il ne faut pas aller en deça de l'indice 0 dans la liste
                            contextegauche =  " "+LISTEDEMOTS[nbmot-i]+contextegauche;
                        }
                    }
                    
                    var resutmp = unmot.replace(pole, "<font color='red'>"+pole+"</font>");
                    // on ajoute la ligne de contexte dans le tableau html en construction
                    table2 += "<tr><td>"+contextegauche+"</td><td>"+resutmp+"</td><td>"+contextedroit+"</td></tr>";
                }

                if (unmot.search(reg3) > -1) {
                    // si c'est le pôle on reconstruit ses contextes gauche et droit
                    var contextedroit = "";
                    var contextegauche = "";
                    
                    for (var i = 1 ; i <= longueur ; i++) {
                        if (nbmot+i <= LISTEDEMOTS.length) { // il ne faut pas déborder à droite de la liste
                            contextedroit=contextedroit+LISTEDEMOTS[nbmot+i]+ " ";
                        }
                        if (nbmot-i >= 0) { // il ne faut pas aller en deça de l'indice 0 dans la liste
                            contextegauche =  " "+LISTEDEMOTS[nbmot-i]+contextegauche;
                        }
                    }
                    
                    var resutmp = unmot.replace(pole, "<font color='red'>"+pole+"</font>");
                    // on ajoute la ligne de contexte dans le tableau html en construction
                    table2 += "<tr><td>"+contextegauche+"</td><td>"+resutmp+"</td><td>"+contextedroit+"</td></tr>";
                }

                if (unmot.search(reg4) > -1) {
                    // si c'est le pôle on reconstruit ses contextes gauche et droit
                    var contextedroit = "";
                    var contextegauche = "";
                    
                    for (var i = 1 ; i <= longueur ; i++) {
                        if (nbmot+i <= LISTEDEMOTS.length) { // il ne faut pas déborder à droite de la liste
                            contextedroit=contextedroit+LISTEDEMOTS[nbmot+i]+ " ";
                        }
                        if (nbmot-i >= 0) { // il ne faut pas aller en deça de l'indice 0 dans la liste
                            contextegauche =  " "+LISTEDEMOTS[nbmot-i]+contextegauche;
                        }
                    }
                    
                    var resutmp = unmot.replace(pole, "<font color='red'>"+pole+"</font>");
                    // on ajoute la ligne de contexte dans le tableau html en construction
                    table2 += "<tr><td>"+contextegauche+"</td><td>"+resutmp+"</td><td>"+contextedroit+"</td></tr>";
                }
            }
            
            table1 += '</table>';
            table2 += '</table>';

            document.getElementById('page-analysis').innerHTML+=table1;
            document.getElementById('page-analysis').innerHTML+=table2;
        }
    }
}

function nbphrases() {
    if (document.getElementById("fileDisplayArea").innerHTML=="") {
        empty(); // Si la partie "fileDisplayArea" ne contient rien (c'est-à-dire qu'aucun fichier n'a été sélectionné), alors on exécute la fonction "empty" //
    }
    else {
        var text = document.getElementById("fileDisplayArea").innerText; // récupération du texte //
        var table = ""; // création du tableau qui contiendra les phrases // 
        table += '<table align="center" class="myTable">';
        var points = /[.?!]/; // choix des délimiteurs //
        var phrases = text.split(points); // segmentation du texte d'après les délimiteurs ci-dessus //
        var resultat = phrases.length-1; // le résultat est la "longueur" de la valeur de la variable "phrases"
        
        for (var i = 0 ; i < resultat ; i++) { // Pour chaque phrase, on l'ajoute dans une ligne de tableau //
            table +='<tr><td>'+phrases[i]+'</td></tr>';      
        }
        
        table+= "</table>"; // fermeture du tableau //
        document.getElementById("page-analysis").innerHTML= "Il y a "+resultat+" phrases dans le texte"; // affichage du nombre de phrases //
        document.getElementById("page-analysis").innerHTML+= table; // affichage du tableau contenant les phrases //
    }
}

function afficherCooccurrents() {
    const pole = document.getElementById('poleID').value.trim();
    const longueur = parseInt(document.getElementById('lgID').value.trim());
    const text = document.getElementById('fileDisplayArea').innerText;
    
    if (pole === "") {
        alert("Merci de saisir un terme dans le champ 'Pôle'.");
        return;
    }
    
    if (longueur <= 0 || isNaN(longueur)) {
        alert("Merci d'indiquer une longueur valide dans le champ 'Longueur'.");
        return;
    }

    const words = text.split(/\b/);
    const cooccurrents = {};

    words.forEach((word, index) => {
        if (word.trim() === pole) {
            for (let i = Math.max(0, index - longueur); i < Math.min(words.length, index + longueur); i++) {
                if (words[i].trim() !== pole) {
                    if (!cooccurrents[words[i]]) {
                        cooccurrents[words[i]] = { leftFrequency: 0, rightFrequency: 0 };
                    }
                    if (i < index) {
                        cooccurrents[words[i]].leftFrequency++;
                    } else {
                        cooccurrents[words[i]].rightFrequency++;
                    }
                }
            }
        }
    });

    const table = document.createElement('table');
    table.classList.add('myTable');
    table.innerHTML = `
        <tr>
            <th>Co-occurrence</th>
            <th>Fréquence gauche</th>
            <th>% Fréquence gauche</th>
            <th>Fréquence droite</th>
            <th>% Fréquence droite</th>
        </tr>
    `;

    Object.keys(cooccurrents).forEach(cooccurrent => {
        const { leftFrequency, rightFrequency } = cooccurrents[cooccurrent];
        const totalFrequency = leftFrequency + rightFrequency;
        const leftPercentage = ((leftFrequency / totalFrequency) * 100).toFixed(2);
        const rightPercentage = ((rightFrequency / totalFrequency) * 100).toFixed(2);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cooccurrent}</td>
            <td>${leftFrequency}</td>
            <td>${leftPercentage}%</td>
            <td>${rightFrequency}</td>
            <td>${rightPercentage}%</td>
        `;
        table.appendChild(row);
    });

    const pageAnalysis = document.getElementById('page-analysis');
    pageAnalysis.innerHTML = '';
    pageAnalysis.appendChild(table);
}

function afficherAide() {
    const aideTexte = document.getElementById('aideTexte');
    aideTexte.innerHTML = `
        <p>Bienvenue sur notre site ! Voici quelques informations pour vous aider à utiliser nos fonctionnalités :</p>
        <ul>
            <li><strong>Segmentation mots :</strong> Cette fonction découpe le texte en mots individuels, en ignorant la ponctuation.</li>
            <li><strong>Segmentation phrases :</strong> Divise le texte en phrases, basées sur les marqueurs de ponctuation.</li>
            <li><strong>Concordance :</strong> Recherche les occurrences d'un mot spécifique (pôle) dans le texte et affiche le contexte autour de ce mot.</li>
            <li><strong>Visualisation Cooccurrents :</strong> Affiche les mots qui co-occurrent avec un mot spécifié dans un intervalle donné.</li>
            <li><strong>Afficher Aide :</strong> Affiche ce texte d'aide pour vous guider dans l'utilisation du site.</li>
        </ul>
        <p>Nous espérons que vous trouverez ces fonctionnalités utiles ! </p>
    `;
    aideTexte.style.display = 'block'; // Pour afficher le texte d'aide
}
// Ajout du gestionnaire d'événements pour le bouton "Cooccurrents/fréquence"
document.getElementById('action1').innerText = 'Cooccurrents/fréquence';
document.getElementById('action1').addEventListener('click', afficherCooccurrents);


function amants() {
    var text = "Demain, dès l'aube<br/>Demain, dès l'aube, à l'heure où blanchit la campagne,<br/>Je partirai. Vois-tu, je sais que tu m'attends.<br/>J'irai par la forêt, j'irai par la montagne.<br/>Je ne puis demeurer loin de toi plus longtemps.<br/><br/>Je marcherai les yeux fixés sur mes pensées,<br/>Sans rien voir au dehors, sans entendre aucun bruit,<br/>Seul, inconnu, le dos courbé, les mains croisées,<br/>Triste, et le jour pour moi sera comme la nuit.<br/><br/>Je ne regarderai ni l'or du soir qui tombe,<br/>Ni les voiles au loin descendant vers Harfleur,<br/>Et quand j'arriverai, je mettrai sur ta tombe<br/>Un bouquet de houx vert et de bruyère en fleur.";
    document.getElementById("fileDisplayArea").innerHTML = text;
}