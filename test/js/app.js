"use strict";

(function() {
    function triage(dataAtrier) {
        // triage par ordre alphabetique de nos données suivant la libellée du bloc
        dataAtrier.sort(function(a, b) {
            if(a["libelle"] < b["libelle"]) { return -1; }
            else if(a["libelle"] > b["libelle"]) { return 1; }
            else { return 0; }
        });
        return dataAtrier;
    }

    function apiToDOM(dataToDOM) {
        // Ajout au DOM de nos données
        $(".div-content").html("");
        for(let index of dataToDOM) {
            const infoContent = $("<div></div>").addClass("info-content")
                                                 .html("<p><span title='famille du bloc'>" + index["familleBloc"].substring(6) + "</span></br>"+
                                                 "<span title='nom du bloc'>" + index["nom_du_bloc"] + "</span></br>"+
                                                 "<span title='themes'>" + index["themes"] + "</span>"+ "</p>"),
            libelleContent = $("<h3></h3>").text(index["libelle"])
                                            .attr("title", "Libellée"),
            divInfoContent = $("<div></div>").addClass("div-info-content")
                                            .append(libelleContent, infoContent),
            image = $("<img>").addClass("img")
                                .attr("src", index["photo"])
                                .attr("title", index["photo"])
                                .attr("alt", index["photo"].substring(0, 20) + "..."),
            divAPIContent = $("<div></div>").addClass("api-content")
                                            .append(image, divInfoContent);
    
            $(".div-content").append(divAPIContent);
        }
        console.log("Ajout des contenus au DOM");
    }

    function initDOM(file="flux.json") {
        // Initialisation de l'affichage du DOM
        $(".center p").hide();
        $("#text").val("");
        $.getJSON(file,(data) => {
            data = triage(data);
            apiToDOM(data);
            console.log("Réinitialisation du DOM terminé");
        });
    }

    function back() {
        // Fonction qui s'active lorsqu'on press le bouton "back"
        console.log("Bouton retour pressé");
        initDOM();
    }

    function searchProcess(motCle, file="flux.json") {
        // Fonction qui s'active lorsqu'on press le bouton "search"
        if(motCle) {
            console.log("debut de la recherche");
            $.getJSON(file,(data) => {
                const mot = new RegExp(motCle, "gi");
                let correspondance = [];
                
                for (const index of data) {
                    // On cherche les correspondances de la clé avec nos données grâce à cette boucle
                    if(mot.test(index["libelle"]) || mot.test(index["nom_du_bloc"])) { correspondance.push(index); }
                }
                /*
                * Au cas où on aurait au moins un correspondance
                * On retourne le résultat de la recherche 
                * Sinon, on affiche un message
                */
                if(correspondance.length > 0) {
                    $(".center p").show().text("Résultats de la recherche : " + correspondance.length + " correspondances");
                    correspondance = triage(correspondance);
                    apiToDOM(correspondance);
                }
                else { 
                    $(".center p").show().text("Résultats de la recherche : Aucune correspondance");
                    $(".div-content").html("");
                }
            });
            console.log("fin de la recherche");
        }
        else {
            console.error("champ de recherche vide");
            alert("Votre champ de recherche est vide \n Veuillez le remplir s'il vous plaît");
        }
    }

    function initializing() {
        /* 
         * Initialisation du DOM
         * Ajout des événements
        */
        initDOM();
        $("#btnBack").click((e) => { e.preventDefault(); back() });
        $("#btnSearch").click((e) => { e.preventDefault(); searchProcess($("#text").val()); });
    }
    
    initializing();
  
})();