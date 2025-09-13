let url = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0'; 
let searchInput = document.getElementById('searchInput');
let pokemonsArray = [];
let isPokemonInCloseUp = false;
let pokemonClickedOn = '';
let pokemonRelevantInfo = {};
let pokemonArraySearched = [];
let container = document.getElementById('container');
let pokemonLabels = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];

document.addEventListener('DOMContentLoaded', (event) => {
  const popupContainer = document.getElementById('pokemon-cards-zoomed-in');
  popupContainer.addEventListener('click', (event) => {
      if (event.target === popupContainer) {
          closePokemonCardZoomed();
      }
  });
});

function closePokemonCardZoomed() {
  let pokemonName = pokemonClickedOn;
  let pokemonCloseIn = pokemonName + '_close_In';
  let pokemonCloseInCard = document.getElementById(pokemonCloseIn);
  closePokemonCard(pokemonCloseInCard, pokemonName);
}

function closePokemonCard(pokemonCloseInCard, pokemonName) {
  if (isPokemonInCloseUp === true) {
      let pokemonCardsZoomed = document.getElementById('pokemon-cards-zoomed-in');
      let pokemonID = pokemonName + '_card';
      let pokemon = document.getElementById(pokemonID);
      let arrowLeft = document.getElementById('arrow_left');
      let arrowRight = document.getElementById('arrow_right');
      unsetPokemonCardsZoomedAttributes(pokemonCardsZoomed);
      removeAttributesFunctionInClosePokemon(pokemon, arrowLeft, pokemonCloseInCard, arrowRight);
      setRemainingAttributesInClosePokemon();
  }
}

async function init(){
    let response = await fetch(url);
    responseAsJson = await response.json();
    displayPokemons(responseAsJson);
}

async function displayPokemons(responseAsJson){
    let pokemons = await responseAsJson['results'];
    for(let i = 0; i < pokemons.length; i++){
      let pokemonName = pokemons[i]['name'];
      let pokemonURL = pokemons[i]['url'];
      let pokemon = await fetchPokemonData(pokemonURL);
      pokemonsArray.push(pokemonName);
      loadPokemonInfo(pokemon, pokemonName);
    }
    displayPokemonInfo();
}

async function fetchPokemonData(pokemonURL){
  let pokemonData = await fetch(pokemonURL);
  let pokemonDataAsJson = await pokemonData.json();
  return pokemonDataAsJson;
}

function loadPokemonInfo(pokemon, pokemonName){
  let pokemonID = pokemonName + '_card';
  let pokemonImage = pokemon["sprites"]["other"]["official-artwork"]["front_default"];
  let pokemonTypes = pokemon["types"];
  let pokemonStats = pokemon["stats"];
  let mainInfo = createMainInfo(pokemon);
  let pokemonObject = buildPokemonDetail(pokemonName, pokemonID, pokemonImage, pokemonTypes, pokemonStats, mainInfo);
  pokemonRelevantInfo[pokemonName] = pokemonObject;
}

function buildPokemonDetail(pokemonName, pokemonID, pokemonImage, pokemonTypes, pokemonStats, mainInfo){
  let obj = {
    "pokemonName": pokemonName.toLowerCase(),
    "pokemonID": pokemonID,
    "pokemonImage": pokemonImage,
    "pokemonTypes": pokemonTypes,
    "pokemonStats": pokemonStats,
    "pokemonMainInfo": mainInfo
  }
  return obj;
}

function displayPokemonInfo(){
  container.innerHTML = "";
  for(key in pokemonRelevantInfo){
    let access = pokemonRelevantInfo[key];
    let pokemonType = access["pokemonTypes"][0]["type"]["name"];
    let pokemonTypesId = access["pokemonName"] + '_types';
    container.innerHTML += buildPokemonContainer(access['pokemonID'], access["pokemonName"], access["pokemonImage"], pokemonTypesId);
    let pokemonCard = document.getElementById(access["pokemonID"]);
    pokemonCard.classList.add(pokemonType);
    extractPokemonType(pokemonTypesId, access);
  }
}

function extractPokemonType(pokemonTypesId, access){
  let array = access["pokemonTypes"];
  let types = document.getElementById(pokemonTypesId);
  for(i = 0; i < array.length; i++){
    types.innerHTML += `<div class="type"><p>${array[i]["type"]["name"]}</p></div>`;
  }
}

function openPokemonCard(pokemonName){
  let access = pokemonRelevantInfo[pokemonName];
  if(isPokemonInCloseUp === false){
    let pokemon = document.getElementById(access["pokemonID"]);
    pokemon.classList.add('d-none');
    pokemonClickedOn = access["pokemonName"];
    getPokemonCardInClose(access);
    pokemonClickedOn = pokemonName;
  }
}

function buildPokemonCardInCloseObject(access, resultArray){
  let obj = {
    'pokemonCardsZoomed': document.getElementById("pokemon-cards-zoomed-in"),
    'pokemonCloseIn': access["pokemonName"] + '_close_In',
    'previousPokemon': resultArray[0],
    'nextPokemon': resultArray[1], 
    'pokemonStatsDataset': createPokemonStatsDataset(access["pokemonStats"]),
    'pokemonStatsId': access["pokemonName"] + 'StatsChart',
    'pokemonMainBoardId': access["pokemonName"] + 'MainBoard',
    'pokemonIndexTabId': access["pokemonName"] + '_index_tab'
  }
  return obj;
}

function getPokemonCardInClose(access){
  let resultArray = returnNeighbouringPokemons(access["pokemonName"]);
  let obj = buildPokemonCardInCloseObject(access, resultArray);
  setLeftArrowAndTitle(obj, access);
  let pokemonCloseInCard = document.getElementById(obj["pokemonCloseIn"]);
  setRightArrowAndRemainingAttributes(obj, access, pokemonCloseInCard);
}

function setLeftArrowAndTitle(obj, access){
  setPokemonCardsZoomedAttributes(obj["pokemonCardsZoomed"]);
  getPokemonCardsZoomedArrowLeft(obj["pokemonCardsZoomed"], obj["previousPokemon"], obj["pokemonCloseIn"], access["pokemonName"]);
  getPokemonCardsZoomedTitle(obj["pokemonCloseIn"], obj["pokemonCardsZoomed"], access["pokemonName"]);
}

function setRightArrowAndRemainingAttributes(obj, access, pokemonCloseInCard){
  getPokemonCardsZoomedTypes(pokemonCloseInCard, access["pokemonTypes"]);
  setPokemonCardsZoomedImageAndBackground(pokemonCloseInCard, access["pokemonImage"], access["pokemonTypes"][0]["type"]["name"]);
  getPokemonCardsZoomedArrowRight(obj["pokemonCardsZoomed"], obj["nextPokemon"], obj["pokemonCloseIn"], access["pokemonName"]);
  createPokemonCharts(obj, access);
  setRemainingAttributesInOpenPokemon();
}

function createPokemonCharts(obj, access){
  let pokemonCloseInCard = document.getElementById(obj["pokemonCloseIn"]);
  // console.log(pokemonCloseInCard.parentNode);
  pokemonCloseInCard.innerHTML += `<div class="pokemonCloseInLowerPart"></div>`;
  let pokemonCloseInLowerPart = pokemonCloseInCard.querySelector('.pokemonCloseInLowerPart');
  pokemonCloseInLowerPart.innerHTML += returnIndexTab(obj["pokemonIndexTabId"], obj["pokemonStatsId"], obj["pokemonMainBoardId"]);
  pokemonCloseInLowerPart.innerHTML += returnPokemonMainBoard(obj["pokemonMainBoardId"], access["pokemonMainInfo"]);
  let canvasElement = document.createElement('canvas');
  setCanvasElementAttributes(canvasElement, obj["pokemonStatsId"]);
  pokemonCloseInLowerPart.appendChild(canvasElement);
  let pokemonStatsCard = document.getElementById(obj["pokemonStatsId"]);
  displayPokemonChart(pokemonStatsCard, access["pokemonName"], obj["pokemonStatsDataset"]);
}

function setPokemonCardsZoomedImageAndBackground(pokemonCloseInCard, pokemonImage, pokemonBackgroundColor){
  pokemonCloseInCard.innerHTML += `<img src='${pokemonImage}'>`; 
  pokemonCloseInCard.classList.add(pokemonBackgroundColor); 
}

function createMainInfo(pokemonDataAsJson){
  let height = pokemonDataAsJson["height"];
  let weight = pokemonDataAsJson["weight"];
  let base_experience = pokemonDataAsJson["base_experience"] ;
  let abilities = pokemonDataAsJson["abilities"];
  let allAbilities = extractAbilities(abilities);
  return [height, weight, base_experience, allAbilities];
}

function extractAbilities(abilities){
  let allAbilities = [];
  for(let i = 0; i < abilities.length; i++){
    let ability = abilities[i]["ability"]["name"];
    let abilityModified = ability[0].toUpperCase() + ability.slice(1);
    for(let j = 0; j < abilityModified.length; j++){
      if(abilityModified.charAt(j) === '-'){
        let chars = abilityModified.split('');
        if(j+1 < chars.length){
          chars[j+1] = chars[j+1].toUpperCase();
        }
        abilityModified = chars.join('');
      }
    }
    allAbilities.push(abilityModified);
  }
  return allAbilities;
}

function createPokemonStatsDataset(pokemonStats){
  pokemonStatsDataset = [];
  for(i=0; i < pokemonStats.length; i++){
    let pokemonStat = pokemonStats[i]["base_stat"];
    pokemonStatsDataset.push(pokemonStat);
  }
  return pokemonStatsDataset;
}

function getPokemonMainBoard(pokemonStatsId, pokemonMainBoardId){
  let pokemonStatsCard = document.getElementById(pokemonStatsId);
  let pokemonMainBoardCard = document.getElementById(pokemonMainBoardId);
  if(pokemonStatsCard.style.display != 'none'){
    pokemonStatsCard.style.display = 'none';
    pokemonMainBoardCard.style.display = 'flex';
  }
}

function getPokemonStatBoard(pokemonStatsId, pokemonMainBoardId){
  let pokemonStatsCard = document.getElementById(pokemonStatsId);
  let pokemonMainBoardCard = document.getElementById(pokemonMainBoardId);
  if(pokemonMainBoardCard.style.display != 'none'){
    pokemonMainBoardCard.style.display = 'none';
    pokemonStatsCard.style.display = 'block';
  }
}

function setCanvasElementAttributes(canvasElement, pokemonStatsId){
  canvasElement.id = pokemonStatsId;
  canvasElement.className = 'canvasElement';
  canvasElement.style.display = "none";
}

function setRemainingAttributesInOpenPokemon(){
  document.body.style.overflow = 'hidden';
  container.classList.add('no-click');
  isPokemonInCloseUp = true;
}

function getPokemonCardsZoomedTypes(pokemonCloseInCard, pokemonTypes){
  for(let j=0; j < pokemonTypes.length; j++){
    pokemonCloseInCard.innerHTML += `<div class="types">${pokemonTypes[j]["type"]["name"]}</div>`; 
  }
}

function setPokemonCardsZoomedAttributes(pokemonCardsZoomed){
  pokemonCardsZoomed.classList.remove('d-none');
  pokemonCardsZoomed.style.height = '100%';
  pokemonCardsZoomed.style.width = '100%';
  pokemonCardsZoomed.style.backgroundColor = 'rgba(0,0,0,0.4)';
}

function unsetPokemonCardsZoomedAttributes(pokemonCardsZoomed){
  pokemonCardsZoomed.style.height = '0';
  pokemonCardsZoomed.style.width = '0';
  pokemonCardsZoomed.style.backgroundColor = '';
  pokemonCardsZoomed.classList.add('d-none');
  container.classList.remove('no-click');
}

function returnNeighbouringPokemons(pokemonName){
  let indexPokemonName = pokemonsArray.indexOf(pokemonName);
  let resultArray = returnRightPokemonIndices(indexPokemonName);
  let previousPokemonIndex = resultArray[0];
  let nextPokemonIndex = resultArray[1];
  let nextPokemon = pokemonsArray[nextPokemonIndex];
  let previousPokemon = pokemonsArray[previousPokemonIndex];
  let resultPokemonArray = [previousPokemon, nextPokemon];
  return resultPokemonArray; 
}

function returnRightPokemonIndices(indexPokemonName){
  if(indexPokemonName == 0){
    let previousPokemonIndex = pokemonsArray.length - 1;
    let nextPokemonIndex = 1;
    resultArray = [previousPokemonIndex, nextPokemonIndex];
  } else if(indexPokemonName == pokemonsArray.length-1){
    let nextPokemonIndex = 0;
    let previousPokemonIndex = indexPokemonName - 1;
    resultArray = [previousPokemonIndex, nextPokemonIndex];
  } else {
    let nextPokemonIndex = indexPokemonName + 1;
    let previousPokemonIndex = indexPokemonName - 1;
    resultArray = [previousPokemonIndex, nextPokemonIndex];
  }
  return resultArray;
}

function showNextPokemon(nextPokemon, pokemonCloseIn, pokemonName){
  let pokemonCloseInCard = document.getElementById(pokemonCloseIn);
  if(pokemonArraySearched.length == 0){
    closePokemonCard(pokemonCloseInCard, pokemonName);
    openPokemonCard(nextPokemon);
  } else {
    let pokemonIndex = pokemonArraySearched.indexOf(pokemonName);
    let resultArray = navigateThroughSearchedArray(pokemonIndex, increase=true);
    let newNextPokemon = resultArray[1];
    closePokemonCard(pokemonCloseInCard, pokemonName);
    openPokemonCard(newNextPokemon);
  }
}

function navigateThroughSearchedArray(pokemonIndex, increase){
  let nextPokemon = '';
  let previousPokemon = '';
  if(pokemonArraySearched.length == 1){
    nextPokemon = previousPokemon = pokemonArraySearched[0]; 
  } else if (pokemonArraySearched.length == 2 && pokemonIndex == 0){
    nextPokemon = previousPokemon = pokemonArraySearched[1];
  } else if (pokemonArraySearched.length == 2 && pokemonIndex == 1){
    nextPokemon = previousPokemon = pokemonArraySearched[0];
  } else {
    previousPokemon = checkCasesForNeighbouringPokemons(nextPokemon, previousPokemon, pokemonIndex, increase)[0];
    nextPokemon = checkCasesForNeighbouringPokemons(nextPokemon, previousPokemon, pokemonIndex, increase)[1];
  }
  resultArray = [previousPokemon, nextPokemon];
  return resultArray;
}

function checkCasesForNeighbouringPokemons(nextPokemon, previousPokemon, pokemonIndex, increase){
  if(pokemonIndex == pokemonArraySearched.length - 1 && increase == true){
    nextPokemon = pokemonArraySearched[0];
    previousPokemon = pokemonArraySearched[pokemonArraySearched.length - 2];
  } else if(pokemonIndex == 0 && increase == false){
    nextPokemon = pokemonArraySearched[1];
    previousPokemon = pokemonArraySearched[pokemonArraySearched.length - 1];
  } else if(pokemonIndex == 0 && increase == true){
    nextPokemon = pokemonArraySearched[1];
    previousPokemon = pokemonArraySearched[pokemonArraySearched.length - 1];
  } else {
    nextPokemon = pokemonArraySearched[pokemonIndex + 1];
    previousPokemon = pokemonArraySearched[pokemonIndex - 1];
  }
  resultArray = [previousPokemon, nextPokemon]
  return resultArray;
}

function showPreviousPokemon(previousPokemon, pokemonCloseIn, pokemonName){
  let pokemonCloseInCard = document.getElementById(pokemonCloseIn);
  if(pokemonArraySearched.length == 0){
    closePokemonCard(pokemonCloseInCard, pokemonName);
    openPokemonCard(previousPokemon);
  } else {
    let pokemonIndex = pokemonArraySearched.indexOf(pokemonName);
    let resultArray = navigateThroughSearchedArray(pokemonIndex, increase=false);
    let newPreviousPokemon = resultArray[0];
    closePokemonCard(pokemonCloseInCard, pokemonName);
    openPokemonCard(newPreviousPokemon);
  }
}

function setRemainingAttributesInClosePokemon(){
  pokemonClickedOn = '';
  isPokemonInCloseUp = false;
  document.body.style.overflow = 'auto';
}

function removeAttributesFunctionInClosePokemon(pokemon, arrowLeft, pokemonCloseInCard, arrowRight){
  pokemon.classList.remove('d-none');
  arrowLeft.remove();
  pokemonCloseInCard.remove();
  arrowRight.remove();
}

function prepareURL(){
    let resultArray = iterateString(url); 
    let lastCharacter = resultArray[0];
    let placeholders = resultArray[1];
    updateCharacter = Number(lastCharacter) + 20;
    updateCharacter.toString();
    url = url.slice(0, -placeholders) + updateCharacter; 
    loadFurtherPokemons();
}

async function loadFurtherPokemons(){
    let response = await fetch(url);
    responseAsJson = await response.json();
    displayPokemons(responseAsJson);
}

function iterateString(string){
    let array = [];
    for(let i = string.length-1; i > 0; i--){
        if(string[i] == "="){
            j = i + 1;
            character = string.slice(j, string.legnth);
            placeholders = character.length;
            array.push([character, placeholders]);
        }
    }
    return array[0];
}

searchInput.addEventListener('input', function() {
    let searchTerm = this.value.trim().toLowerCase();
    pokemonArraySearched = [];
    if(searchTerm.length > 2){
        PrepareToDisplaySearchResults(searchTerm);
    } else {
        removeDisplayNone();
    }
    disableFurtherPokemon();
});

function disableFurtherPokemon(){
  let furtherPokemons = document.getElementById('furtherPokemons');
  if(searchInput.value.length > 2){
    furtherPokemons.classList.add('d-none');
  } else {
    furtherPokemons.classList.remove('d-none');
  }
}

function PrepareToDisplaySearchResults(searchTerm){
    let pokemonArrayToShow = [];
    let pokemonArrayNotToShow = [];
    for(let index = 0; index < pokemonsArray.length; index++){
        let pokemonName = pokemonsArray[index];
        if(pokemonName.toLowerCase().includes(searchTerm)){
            pokemonArrayToShow.push(pokemonName);
        } else {
            pokemonArrayNotToShow.push(pokemonName);
        }
    }
    displaySearchResults(pokemonArrayToShow, pokemonArrayNotToShow);
    return pokemonArraySearched = pokemonArrayToShow;
}

function displaySearchResults(pokemonArrayToShow, pokemonArrayNotToShow){
  if(pokemonArrayToShow.length < 11){
    iterateArray(pokemonArrayToShow, increase=true, partial=false, string='block');
    iterateArray(pokemonArrayNotToShow, increase=true, partial=false, string='none');
  } else {
    iterateArray(pokemonArrayToShow, increase=true, partial=true, string='block');
    iterateArray(pokemonArrayToShow, increase=false, partial=true, string='none');
    iterateArray(pokemonArrayNotToShow, increase=true, partial=false, string='none');
  }
}

function iterateArray(array, increase, partial, string){
  if(increase == true && partial == false){
    for(i = 0; i < array.length; i++){
      setVariables(array, i, string);
    }
  } else if(increase == true && partial == true){
    for(i = 0; i < 10; i++){
      setVariables(array, i, string);
    }
  } else if(increase == false && partial == true){
    for(i = array.length; i > 9; i--){
      setVariables(array, i, string);
    }
  }
}

function setVariables(array, i, string){
  let pokemonName = array[i];
  let pokemonID = pokemonName + '_card';
  let pokemon = document.getElementById(pokemonID);
  pokemon.style.display = string; 
}

function removeDisplayNone(){
    for(let i = 0; i < pokemonsArray.length; i++){
        let pokemonName = pokemonsArray[i];
        let pokemonID = pokemonName + '_card';
        let pokemon = document.getElementById(pokemonID);
        pokemon.style.display = 'block';
    }
}