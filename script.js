// Global variables
let url = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0';
let searchInput = document.getElementById('searchInput');
let pokemonsArray = [];
let isPokemonInCloseUp = false;
let pokemonClickedOn = '';
let pokemonRelevantInfo = {};
let pokemonArraySearched = [];
let container = document.getElementById('container');
let pokemonLabels = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  let popupContainer = document.getElementById('pokemon-cards-zoomed-in');
  popupContainer.addEventListener('click', (event) => {
    if (event.target === popupContainer) {
      closePokemonCardZoomed();
    }
  });
});

async function init() {
  handleSpinnerAndSetOverflow('show', 'hidden');
  let response = await fetch(url);
  let responseAsJson = await response.json();
  await displayPokemons(responseAsJson);
  handleSpinnerAndSetOverflow('hide', 'visible');
}

// Data fetching and processing
async function displayPokemons(responseAsJson) {
  let pokemons = responseAsJson['results'];
  for (let i = 0; i < pokemons.length; i++) {
    let pokemonName = pokemons[i]['name'];
    let pokemonURL = pokemons[i]['url'];
    let pokemon = await fetchPokemonData(pokemonURL);
    pokemonsArray.push(pokemonName);
    loadPokemonInfo(pokemon, pokemonName);
  }
  displayPokemonInfo();
}

function loadPokemonInfo(pokemon, pokemonName) {
  let pokemonID = pokemonName + '_card';
  let pokemonImage = pokemon["sprites"]["other"]["official-artwork"]["front_default"];
  let pokemonTypes = pokemon["types"];
  let pokemonStats = pokemon["stats"];
  let mainInfo = createMainInfo(pokemon);
  let pokemonObject = buildPokemonDetail(pokemonName, pokemonID, pokemonImage, pokemonTypes, pokemonStats, mainInfo);
  pokemonRelevantInfo[pokemonName] = pokemonObject;
}

function createMainInfo(pokemonDataAsJson) {
  let height = pokemonDataAsJson["height"];
  let weight = pokemonDataAsJson["weight"];
  let baseExperience = pokemonDataAsJson["base_experience"];
  let abilities = pokemonDataAsJson["abilities"];
  let allAbilities = extractAbilities(abilities);
  return [height, weight, baseExperience, allAbilities];
}

function extractAbilities(abilities) {
  let allAbilities = [];
  for (let i = 0; i < abilities.length; i++) {
    let ability = abilities[i]["ability"]["name"];
    let capitalized = capitalizeFirstLetter(ability);
    let formatted = handleHyphensInAbility(capitalized);
    allAbilities.push(formatted);
  }
  return allAbilities;
}

function capitalizeFirstLetter(ability) {
  return ability[0].toUpperCase() + ability.slice(1);
}

function handleHyphensInAbility(ability) {
  let chars = ability.split('');
  for (let j = 0; j < chars.length; j++) {
    if (chars[j] === '-' && j + 1 < chars.length) {
      chars[j + 1] = chars[j + 1].toUpperCase();
    }
  }
  return chars.join('').replace(/-/g, '');
}

function buildPokemonDetail(pokemonName, pokemonID, pokemonImage, pokemonTypes, pokemonStats, mainInfo) {
  return {
    "pokemonName": pokemonName.toLowerCase(),
    "pokemonID": pokemonID,
    "pokemonImage": pokemonImage,
    "pokemonTypes": pokemonTypes,
    "pokemonStats": pokemonStats,
    "pokemonMainInfo": mainInfo
  };
}

// UI rendering
function displayPokemonInfo() {
  container.innerHTML = "";
  for (let key in pokemonRelevantInfo) {
    let access = pokemonRelevantInfo[key];
    let pokemonType = access["pokemonTypes"][0]["type"]["name"];
    let pokemonTypesId = access["pokemonName"] + '_types';
    container.innerHTML += buildPokemonContainer(access['pokemonID'], access["pokemonName"], access["pokemonImage"], pokemonTypesId);
    let pokemonCard = document.getElementById(access["pokemonID"]);
    pokemonCard.classList.add(pokemonType);
    extractPokemonType(pokemonTypesId, access);
  }
}

function buildPokemonContainer(pokemonID, pokemonName, pokemonImage, pokemonTypesId) {
  // Assuming buildPokemonContainer is defined elsewhere or needs to be added
  return `<div id="${pokemonID}" class="pokemon-card">
            <img src="${pokemonImage}" alt="${pokemonName}">
            <div id="${pokemonTypesId}"></div>
          </div>`;
}

function extractPokemonType(pokemonTypesId, access) {
  let typesContainer = document.getElementById(pokemonTypesId);
  for (let type of access["pokemonTypes"]) {
    typesContainer.innerHTML += `<span class="type">${type["type"]["name"]}</span>`;
  }
}

// Pokemon card zoom/close logic
function closePokemonCardZoomed() {
  let pokemonName = pokemonClickedOn;
  let pokemonCloseIn = pokemonName + '_close_In';
  let pokemonCloseInCard = document.getElementById(pokemonCloseIn);
  closePokemonCard(pokemonCloseInCard, pokemonName);
}

function closePokemonCard(pokemonCloseInCard, pokemonName) {
  if (isPokemonInCloseUp) {
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

function openPokemonCard(pokemonName) {
  let access = pokemonRelevantInfo[pokemonName];
  if (!isPokemonInCloseUp) {
    let pokemon = document.getElementById(access["pokemonID"]);
    pokemon.classList.add('d-none');
    pokemonClickedOn = access["pokemonName"];
    getPokemonCardInClose(access);
    pokemonClickedOn = pokemonName;
  }
}

function buildPokemonCardInCloseObject(access, resultArray) {
  return {
    'pokemonCardsZoomed': document.getElementById("pokemon-cards-zoomed-in"),
    'pokemonCloseIn': access["pokemonName"] + '_close_In',
    'previousPokemon': resultArray[0],
    'nextPokemon': resultArray[1],
    'pokemonStatsDataset': createPokemonStatsDataset(access["pokemonStats"]),
    'pokemonStatsId': access["pokemonName"] + 'StatsChart',
    'pokemonMainBoardId': access["pokemonName"] + 'MainBoard',
    'pokemonIndexTabId': access["pokemonName"] + '_index_tab'
  };
}

function getPokemonCardInClose(access) {
  let resultArray = returnNeighbouringPokemons(access["pokemonName"]);
  let obj = buildPokemonCardInCloseObject(access, resultArray);
  setLeftArrowAndTitle(obj, access);
  let pokemonCloseInCard = document.getElementById(obj["pokemonCloseIn"]);
  setRightArrowAndRemainingAttributes(obj, access, pokemonCloseInCard);
}

function setLeftArrowAndTitle(obj, access) {
  setPokemonCardsZoomedAttributes(obj["pokemonCardsZoomed"]);
  getPokemonCardsZoomedArrowLeft(obj["pokemonCardsZoomed"], obj["previousPokemon"], obj["pokemonCloseIn"], access["pokemonName"]);
  getPokemonCardsZoomedTitle(obj["pokemonCloseIn"], obj["pokemonCardsZoomed"], access["pokemonName"]);
}

function setRightArrowAndRemainingAttributes(obj, access, pokemonCloseInCard) {
  getPokemonCardsZoomedTypes(pokemonCloseInCard, access["pokemonTypes"]);
  setPokemonCardsZoomedImageAndBackground(pokemonCloseInCard, access["pokemonImage"], access["pokemonTypes"][0]["type"]["name"]);
  getPokemonCardsZoomedArrowRight(obj["pokemonCardsZoomed"], obj["nextPokemon"], obj["pokemonCloseIn"], access["pokemonName"]);
  createPokemonCharts(obj, access);
  setRemainingAttributesInOpenPokemon();
}

function createPokemonCharts(obj, access) {
  let pokemonCloseInCard = document.getElementById(obj["pokemonCloseIn"]);
  pokemonCloseInCard.innerHTML += `<div class="pokemonCloseInLowerPart"></div>`;
  let lowerPart = pokemonCloseInCard.querySelector('.pokemonCloseInLowerPart');
  lowerPart.innerHTML += returnIndexTab(obj["pokemonIndexTabId"], obj["pokemonStatsId"], obj["pokemonMainBoardId"]);
  lowerPart.innerHTML += returnPokemonMainBoard(obj["pokemonMainBoardId"], access["pokemonMainInfo"]);
  let canvas = document.createElement('canvas');
  setCanvasElementAttributes(canvas, obj["pokemonStatsId"]);
  lowerPart.appendChild(canvas);
  let statsCard = document.getElementById(obj["pokemonStatsId"]);
  displayPokemonChart(statsCard, access["pokemonName"], obj["pokemonStatsDataset"]);
}

function setPokemonCardsZoomedImageAndBackground(pokemonCloseInCard, pokemonImage, backgroundColor) {
  pokemonCloseInCard.innerHTML += `<img src='${pokemonImage}'>`;
  pokemonCloseInCard.classList.add(backgroundColor);
}

function createPokemonStatsDataset(pokemonStats) {
  let dataset = [];
  for (let i = 0; i < pokemonStats.length; i++) {
    dataset.push(pokemonStats[i]["base_stat"]);
  }
  return dataset;
}

function getPokemonMainBoard(pokemonStatsId, pokemonMainBoardId) {
  let statsCard = document.getElementById(pokemonStatsId);
  let mainBoardCard = document.getElementById(pokemonMainBoardId);
  if (statsCard.style.display !== 'none') {
    statsCard.style.display = 'none';
    mainBoardCard.style.display = 'flex';
  }
}

function getPokemonStatBoard(pokemonStatsId, pokemonMainBoardId) {
  let statsCard = document.getElementById(pokemonStatsId);
  let mainBoardCard = document.getElementById(pokemonMainBoardId);
  if (mainBoardCard.style.display !== 'none') {
    mainBoardCard.style.display = 'none';
    statsCard.style.display = 'block';
  }
}

function setCanvasElementAttributes(canvasElement, pokemonStatsId) {
  canvasElement.id = pokemonStatsId;
  canvasElement.className = 'canvasElement';
  canvasElement.style.display = "none";
}

function setRemainingAttributesInOpenPokemon() {
  document.body.style.overflow = 'hidden';
  container.classList.add('no-click');
  isPokemonInCloseUp = true;
}

function getPokemonCardsZoomedTypes(pokemonCloseInCard, pokemonTypes) {
  for (let j = 0; j < pokemonTypes.length; j++) {
    pokemonCloseInCard.innerHTML += `<div class="types">${pokemonTypes[j]["type"]["name"]}</div>`;
  }
}

function setPokemonCardsZoomedAttributes(pokemonCardsZoomed) {
  pokemonCardsZoomed.classList.remove('d-none');
  pokemonCardsZoomed.style.height = '100%';
  pokemonCardsZoomed.style.width = '100%';
  pokemonCardsZoomed.style.backgroundColor = 'rgba(0,0,0,0.8)';
}

function unsetPokemonCardsZoomedAttributes(pokemonCardsZoomed) {
  pokemonCardsZoomed.style.height = '0';
  pokemonCardsZoomed.style.width = '0';
  pokemonCardsZoomed.style.backgroundColor = '';
  pokemonCardsZoomed.classList.add('d-none');
  container.classList.remove('no-click');
}

function returnNeighbouringPokemons(pokemonName) {
  let index = pokemonsArray.indexOf(pokemonName);
  let resultArray = returnRightPokemonIndices(index);
  let previous = pokemonsArray[resultArray[0]];
  let next = pokemonsArray[resultArray[1]];
  return [previous, next];
}

function returnRightPokemonIndices(index) {
  if (index === 0) {
    return [pokemonsArray.length - 1, 1];
  } else if (index === pokemonsArray.length - 1) {
    return [index - 1, 0];
  } else {
    return [index - 1, index + 1];
  }
}

function showNextPokemon(nextPokemon, pokemonCloseIn, pokemonName) {
  let pokemonCloseInCard = document.getElementById(pokemonCloseIn);
  if (pokemonArraySearched.length === 0) {
    closePokemonCard(pokemonCloseInCard, pokemonName);
    openPokemonCard(nextPokemon);
  } else {
    let index = pokemonArraySearched.indexOf(pokemonName);
    let newNext = getNextPokemonInSearch(index);
    closePokemonCard(pokemonCloseInCard, pokemonName);
    openPokemonCard(newNext);
  }
}

function getNextPokemonInSearch(index) {
  if (pokemonArraySearched.length === 1) return pokemonArraySearched[0];
  if (index === pokemonArraySearched.length - 1) return pokemonArraySearched[0];
  return pokemonArraySearched[index + 1];
}

function showPreviousPokemon(previousPokemon, pokemonCloseIn, pokemonName) {
  let pokemonCloseInCard = document.getElementById(pokemonCloseIn);
  if (pokemonArraySearched.length === 0) {
    closePokemonCard(pokemonCloseInCard, pokemonName);
    openPokemonCard(previousPokemon);
  } else {
    let index = pokemonArraySearched.indexOf(pokemonName);
    let newPrevious = getPreviousPokemonInSearch(index);
    closePokemonCard(pokemonCloseInCard, pokemonName);
    openPokemonCard(newPrevious);
  }
}

function getPreviousPokemonInSearch(index) {
  if (pokemonArraySearched.length === 1) return pokemonArraySearched[0];
  if (index === 0) return pokemonArraySearched[pokemonArraySearched.length - 1];
  return pokemonArraySearched[index - 1];
}

function setRemainingAttributesInClosePokemon() {
  pokemonClickedOn = '';
  isPokemonInCloseUp = false;
  document.body.style.overflow = 'auto';
}

function removeAttributesFunctionInClosePokemon(pokemon, arrowLeft, pokemonCloseInCard, arrowRight) {
  pokemon.classList.remove('d-none');
  arrowLeft.remove();
  pokemonCloseInCard.remove();
  arrowRight.remove();
}

// Loading more Pokemons
async function prepareURL() {
  let resultArray = iterateString(url);
  let lastCharacter = resultArray[0];
  let placeholders = resultArray[1];
  let updateCharacter = (Number(lastCharacter) + 20).toString();
  url = url.slice(0, -placeholders) + updateCharacter;
  await loadFurtherPokemons();
}

async function loadFurtherPokemons() {
  handleSpinnerAndSetOverflow('show', 'hidden');
  let response = await fetch(url);
  let responseAsJson = await response.json();
  await displayPokemons(responseAsJson);
  handleSpinnerAndSetOverflow('hide', 'visible');
}

function iterateString(string) {
  for (let i = string.length - 1; i > 0; i--) {
    if (string[i] === "=") {
      let character = string.slice(i + 1);
      let placeholders = character.length;
      return [character, placeholders];
    }
  }
}

// Search functionality
searchInput.addEventListener('input', function() {
  let searchTerm = this.value.trim().toLowerCase();
  pokemonArraySearched = [];
  if (searchTerm.length > 2) {
    prepareToDisplaySearchResults(searchTerm);
  } else {
    removeDisplayNone();
  }
  disableFurtherPokemon();
});

function disableFurtherPokemon() {
  let furtherPokemons = document.getElementById('furtherPokemons');
  if (searchInput.value.length > 2) {
    furtherPokemons.classList.add('d-none');
  } else {
    furtherPokemons.classList.remove('d-none');
  }
}

function prepareToDisplaySearchResults(searchTerm) {
  let toShow = [];
  let notToShow = [];
  for (let pokemonName of pokemonsArray) {
    if (pokemonName.toLowerCase().includes(searchTerm)) {
      toShow.push(pokemonName);
    } else {
      notToShow.push(pokemonName);
    }
  }
  displaySearchResults(toShow, notToShow);
  pokemonArraySearched = toShow;
}

function displaySearchResults(toShow, notToShow) {
  if (toShow.length < 11) {
    setDisplayForArray(toShow, 'block');
    setDisplayForArray(notToShow, 'none');
  } else {
    setDisplayForArray(toShow.slice(0, 10), 'block');
    setDisplayForArray(toShow.slice(10), 'none');
    setDisplayForArray(notToShow, 'none');
  }
}

function setDisplayForArray(array, displayValue) {
  for (let pokemonName of array) {
    let pokemonID = pokemonName + '_card';
    let pokemon = document.getElementById(pokemonID);
    pokemon.style.display = displayValue;
  }
}

function removeDisplayNone() {
  for (let pokemonName of pokemonsArray) {
    let pokemonID = pokemonName + '_card';
    let pokemon = document.getElementById(pokemonID);
    pokemon.style.display = 'block';
  }
}

// Utility functions
function handleLoadingSpinnerVisibility(action) {
  let overlay = document.getElementById('loading-overlay');
  if (action === 'show') {
    overlay.classList.remove('d-none');
  } else if (action === 'hide') {
    overlay.classList.add('d-none');
  }
}

function handleSpinnerAndSetOverflow(action, overflow) {
  handleLoadingSpinnerVisibility(action);
  document.body.style.overflow = overflow;
}

async function fetchPokemonData(pokemonURL) {
  let response = await fetch(pokemonURL);
  return await response.json();
}

// Placeholder functions (assuming they exist in html_templates.js or elsewhere)
function returnIndexTab(tabId, statsId, mainBoardId) { /* Implementation */ }
function returnPokemonMainBoard(boardId, mainInfo) { /* Implementation */ }
function getPokemonCardsZoomedArrowLeft(container, prev, closeIn, name) { /* Implementation */ }
function getPokemonCardsZoomedTitle(closeIn, container, name) { /* Implementation */ }
function getPokemonCardsZoomedArrowRight(container, next, closeIn, name) { /* Implementation */ }
function displayPokemonChart(card, name, dataset) { /* Implementation */ }