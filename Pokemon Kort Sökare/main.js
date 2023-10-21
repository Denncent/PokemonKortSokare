//Kan inte använda odeklarerade variabler
'use strict'
//Lägger en lyssnare på när sidan laddas och kallar init funktionen
window.addEventListener('load', init);

//hämtar olika id:n och tilldelar funktions värden till dem
var sokKnapp = document.getElementById("sok-knapp");
var sokNamn = document.getElementById("search");

//initierar webbsidan, gömmmer preloadern och lägger till en event listener som lyssnar efter klick och passerar funktionen hanterarSearchAdmit
function init() {
  document.querySelector('#preloader').classList.add('d-none');
  document.querySelector('#soker-form').addEventListener('submit', hanterarSearchSubmit);
}

//Stoppar standard händelsen för submit när användaren klickar på sök knappen, gömmer preloadern och nollställer allt som finns inuti content.
function hanterarSearchSubmit(e) {
  e.preventDefault();
  document.querySelector('#preloader').classList.remove('d-none');
  document.querySelector('#content').innerHTML = null;
}

// Tog hur jag skulle hämta ett fetch anrop från denna sida: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#sending_a_request_with_credentials_included (27-04-2022) då detta behövde deklareras på ett sätt så att all text den hämtar är läst med en JSON sträng, och mitt API-KEY som jag har hämtat från API:et som behövs för att få åtkomst till datan.

//fångar error meddelande, loggar det i konsolen och visar error meddelande och tar bort laddaren.

//skapar även en tom array som tilldelas till pokemonNameArray och lägger till värdet i data > name och passerar objekt referensen pokemonNameArray till funktionen sokerPokemonData och kallar det.
function sokerPokeData(namn) {
    var pokeLank = "https://pokeapi.co/api/v2/pokemon/" + namn;

    console.log(pokeLank);

    fetch(pokeLank, {
      method: "GET",
      withCredentials: true,
      headers: {
        "X-API-KEY": "f67d2ff5-723b-4794-bbfb-6b0a4e846179",
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .catch(function (error) {
        console.log(error.message);
        alert("Konstigt! Jag känner inte igen kortet :(");
        document.querySelector('#preloader').classList.add('d-none');
        document.querySelector('#footern').classList.remove('d-none');
      })
      .then(function (data) {
        var pokemonNameArray = [];
        pokemonNameArray.push(data.name);
        sokerPokemonData(pokemonNameArray);
      });
    }

// Deklarerar variablen i, och sätter en for loop där den letar efter all pokemonData och returnerar datan och sedan skriver den ut all (data).
function sokerPokemonData(pokemonData) {
  var i;
  for (i = 0; i < pokemonData.length; i++) {
    window.fetch('https://api.pokemontcg.io/v2/cards?q=name:' + encodeURIComponent(pokemonData[i]))
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
          //passerar objekt referensen data.data till funktionen postarPokemonKortInfo och kallar det.
        postarPokemonKortInfo(data.data);
      });
  }
}

//Funktion postarPokemonKortInfo som tar med data.data från föregående funktion och passerar dataTCG i den nu och deklarerar i, sedan göms preloadern, visar content och tar bort stylingen på footern. sedan sätts en for loop som letar efter all dataTCG från API:et. Sedan skriver den ut all dataTCG[i], skapar en img element till bildkort, lägger bildkort som underelement till content, tilldelar bildkort.id till dataTCG[i].id, sätter bildklassens attributt till class med namnet "pkmn-kort", sist tar den källan från bilderna från dataTCG[i].images.small. 
// Har tagit emot sokerPokemonData funktion som hade skickat med parametrarna data.data
function postarPokemonKortInfo(dataTCG) {
  var i;
  for (i = 0; i < dataTCG.length; i++) {
    console.log(dataTCG[i]);
    var bildKort = document.createElement("img");
    content.appendChild(bildKort);
    bildKort.id = dataTCG[i].id;
    bildKort.setAttribute("class", "pkmn-kort");
    bildKort.src = dataTCG[i].images.small;

    taBortSaker(dataTCG);
  }
}
// Tar bort preloadern, sätter på content och tar bort
  function taBortSaker(){
    document.querySelector('#preloader').classList.add('d-none');
    document.querySelector('#content').classList.remove('d-none');
    document.querySelector('#footern').classList.add('d-none');
  }

// Knapp tryck som passerar all inmatanande info, deklarerar variablerna parameterTyp, parameterGeneration, soktNamn och gör om alla karaktärer till små.
  sokKnapp.addEventListener("click", function () {
  var soktNamn = sokNamn.value;
  var soktNamn = soktNamn.toLowerCase();
  
// Om den inmatade strängen är tom kallas funktionen sokerPokeData som har en catch funktion som anropas för att fånga upp detta. Sedan returneras det false för att inte exekverera dem sista kodraderna.
  if (soktNamn == "") {
    sokerPokeData();
    return false;
  }

// Skriver ut Namn med det respektive inmatade värdet

  console.log(
    "Namn: " + soktNamn
  );

  //passerar objekt referensen soktNamn till funktionen sokerPokeData och kallar det.
  sokerPokeData(soktNamn);
});