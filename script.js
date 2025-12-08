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

/**
 * Initializes the application by fetching and displaying the initial set of Pokemons.
 * Shows the loading spinner, fetches data from the API, displays Pokemons, and hides the spinner.
 */
async function init() {
  handleSpinnerAndSetOverflow('show', 'hidden');
  let response = await fetch(url);
  let responseAsJson = await response.json();
  await displayPokemons(responseAsJson);
  handleSpinnerAndSetOverflow('hide', 'visible');
}

// Data fetching and processing
/**
 * Fetches and displays a list of Pokemons from the API response.
 * @param {Object} responseAsJson - The JSON response from the Pokemon API.
 */
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

/**
 * Loads and stores detailed information for a single Pokemon.
 * @param {Object} pokemon - The Pokemon data object from the API.
 * @param {string} pokemonName - The name of the Pokemon.
 */
function loadPokemonInfo(pokemon, pokemonName) {
  let pokemonID = pokemonName + '_card';
  let pokemonImage = pokemon["sprites"]["other"]["official-artwork"]["front_default"];
  let pokemonTypes = pokemon["types"];
  let pokemonStats = pokemon["stats"];
  let mainInfo = createMainInfo(pokemon);
  let pokemonObject = buildPokemonDetail(pokemonName, pokemonID, pokemonImage, pokemonTypes, pokemonStats, mainInfo);
  pokemonRelevantInfo[pokemonName] = pokemonObject;
}

/**
 * Creates main information array for a Pokemon including height, weight, base experience, and abilities.
 * @param {Object} pokemonDataAsJson - The Pokemon data object.
 * @returns {Array} An array containing height, weight, base experience, and abilities.
 */
function createMainInfo(pokemonDataAsJson) {
  let height = pokemonDataAsJson["height"];
  let weight = pokemonDataAsJson["weight"];
  let baseExperience = pokemonDataAsJson["base_experience"];
  let abilities = pokemonDataAsJson["abilities"];
  let allAbilities = extractAbilities(abilities);
  return [height, weight, baseExperience, allAbilities];
}

/**
 * Extracts and formats abilities from the Pokemon data.
 * @param {Array} abilities - Array of ability objects.
 * @returns {Array} Array of formatted ability names.
 */
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

/**
 * Capitalizes the first letter of a string.
 * @param {string} ability - The ability name.
 * @returns {string} The ability name with the first letter capitalized.
 */
function capitalizeFirstLetter(ability) {
  return ability[0].toUpperCase() + ability.slice(1);
}

/**
 * Handles hyphens in ability names by capitalizing the letter after each hyphen and removing hyphens.
 * @param {string} ability - The ability name with possible hyphens.
 * @returns {string} The formatted ability name.
 */
function handleHyphensInAbility(ability) {
  let chars = ability.split('');
  for (let j = 0; j < chars.length; j++) {
    if (chars[j] === '-' && j + 1 < chars.length) {
      chars[j + 1] = chars[j + 1].toUpperCase();
    }
  }
  return chars.join('').replace(/-/g, '');
}

/**
 * Builds a detailed object for a Pokemon with all relevant information.
 * @param {string} pokemonName - The name of the Pokemon.
 * @param {string} pokemonID - The ID for the Pokemon card.
 * @param {string} pokemonImage - The URL of the Pokemon image.
 * @param {Array} pokemonTypes - Array of Pokemon types.
 * @param {Array} pokemonStats - Array of Pokemon stats.
 * @param {Array} mainInfo - Main information array.
 * @returns {Object} An object containing all Pokemon details.
 */
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
/**
 * Displays all Pokemon information in the container by rendering each Pokemon card.
 */
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

/**
 * Builds the HTML string for a Pokemon container.
 * @param {string} pokemonID - The ID for the Pokemon card.
 * @param {string} pokemonName - The name of the Pokemon.
 * @param {string} pokemonImage - The URL of the Pokemon image.
 * @param {string} pokemonTypesId - The ID for the types container.
 * @returns {string} The HTML string for the Pokemon card.
 */
function buildPokemonContainer(pokemonID, pokemonName, pokemonImage, pokemonTypesId) {
  // Assuming buildPokemonContainer is defined elsewhere or needs to be added
  return `<div id="${pokemonID}" class="pokemon-card">
            <img src="${pokemonImage}" alt="${pokemonName}">
            <div id="${pokemonTypesId}"></div>
          </div>`;
}

/**
 * Extracts and displays Pokemon types in the specified container.
 * @param {string} pokemonTypesId - The ID of the types container.
 * @param {Object} access - The Pokemon access object.
 */
function extractPokemonType(pokemonTypesId, access) {
  let typesContainer = document.getElementById(pokemonTypesId);
  for (let type of access["pokemonTypes"]) {
    typesContainer.innerHTML += `<span class="type">${type["type"]["name"]}</span>`;
  }
}

// Pokemon card zoom/close logic
/**
 * Closes the zoomed-in Pokemon card view.
 */
function closePokemonCardZoomed() {
  let pokemonName = pokemonClickedOn;
  let pokemonCloseIn = pokemonName + '_close_In';
  let pokemonCloseInCard = document.getElementById(pokemonCloseIn);
  closePokemonCard(pokemonCloseInCard, pokemonName);
}

/**
 * Closes the detailed Pokemon card and resets attributes.
 * @param {HTMLElement} pokemonCloseInCard - The zoomed-in card element.
 * @param {string} pokemonName - The name of the Pokemon.
 */
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

/**
 * Opens the detailed view for a Pokemon card.
 * @param {string} pokemonName - The name of the Pokemon to open.
 */
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

/**
 * Builds an object with elements and data for the zoomed-in Pokemon card.
 * @param {Object} access - The Pokemon access object.
 * @param {Array} resultArray - Array containing previous and next Pokemon names.
 * @returns {Object} An object with zoomed-in card properties.
 */
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

/**
 * Sets up the zoomed-in view for a Pokemon card.
 * @param {Object} access - The Pokemon access object.
 */
function getPokemonCardInClose(access) {
  let resultArray = returnNeighbouringPokemons(access["pokemonName"]);
  let obj = buildPokemonCardInCloseObject(access, resultArray);
  setLeftArrowAndTitle(obj, access);
  let pokemonCloseInCard = document.getElementById(obj["pokemonCloseIn"]);
  setRightArrowAndRemainingAttributes(obj, access, pokemonCloseInCard);
}

/**
 * Sets the left arrow and title for the zoomed-in card.
 * @param {Object} obj - The zoomed-in card object.
 * @param {Object} access - The Pokemon access object.
 */
function setLeftArrowAndTitle(obj, access) {
  setPokemonCardsZoomedAttributes(obj["pokemonCardsZoomed"]);
  getPokemonCardsZoomedArrowLeft(obj["pokemonCardsZoomed"], obj["previousPokemon"], obj["pokemonCloseIn"], access["pokemonName"]);
  getPokemonCardsZoomedTitle(obj["pokemonCloseIn"], obj["pokemonCardsZoomed"], access["pokemonName"]);
}

/**
 * Sets the right arrow and remaining attributes for the zoomed-in card.
 * @param {Object} obj - The zoomed-in card object.
 * @param {Object} access - The Pokemon access object.
 * @param {HTMLElement} pokemonCloseInCard - The zoomed-in card element.
 */
function setRightArrowAndRemainingAttributes(obj, access, pokemonCloseInCard) {
  getPokemonCardsZoomedTypes(pokemonCloseInCard, access["pokemonTypes"]);
  setPokemonCardsZoomedImageAndBackground(pokemonCloseInCard, access["pokemonImage"], access["pokemonTypes"][0]["type"]["name"]);
  getPokemonCardsZoomedArrowRight(obj["pokemonCardsZoomed"], obj["nextPokemon"], obj["pokemonCloseIn"], access["pokemonName"]);
  createPokemonCharts(obj, access);
  setRemainingAttributesInOpenPokemon();
}

/**
 * Creates and appends charts for the Pokemon stats and main board.
 * @param {Object} obj - The zoomed-in card object.
 * @param {Object} access - The Pokemon access object.
 */
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

/**
 * Sets the image and background color for the zoomed-in Pokemon card.
 * @param {HTMLElement} pokemonCloseInCard - The zoomed-in card element.
 * @param {string} pokemonImage - The URL of the Pokemon image.
 * @param {string} backgroundColor - The background color class.
 */
function setPokemonCardsZoomedImageAndBackground(pokemonCloseInCard, pokemonImage, backgroundColor) {
  pokemonCloseInCard.innerHTML += `<img src='${pokemonImage}'>`;
  pokemonCloseInCard.classList.add(backgroundColor);
}

/**
 * Creates a dataset array from Pokemon stats.
 * @param {Array} pokemonStats - Array of Pokemon stat objects.
 * @returns {Array} Array of base stat values.
 */
function createPokemonStatsDataset(pokemonStats) {
  let dataset = [];
  for (let i = 0; i < pokemonStats.length; i++) {
    dataset.push(pokemonStats[i]["base_stat"]);
  }
  return dataset;
}

/**
 * Switches to the main board view and hides the stats chart.
 * @param {string} pokemonStatsId - The ID of the stats chart element.
 * @param {string} pokemonMainBoardId - The ID of the main board element.
 */
function getPokemonMainBoard(pokemonStatsId, pokemonMainBoardId) {
  let statsCard = document.getElementById(pokemonStatsId);
  let mainBoardCard = document.getElementById(pokemonMainBoardId);
  if (statsCard.style.display !== 'none') {
    statsCard.style.display = 'none';
    mainBoardCard.style.display = 'flex';
  }
}

/**
 * Switches to the stats chart view and hides the main board.
 * @param {string} pokemonStatsId - The ID of the stats chart element.
 * @param {string} pokemonMainBoardId - The ID of the main board element.
 */
function getPokemonStatBoard(pokemonStatsId, pokemonMainBoardId) {
  let statsCard = document.getElementById(pokemonStatsId);
  let mainBoardCard = document.getElementById(pokemonMainBoardId);
  if (mainBoardCard.style.display !== 'none') {
    mainBoardCard.style.display = 'none';
    statsCard.style.display = 'block';
  }
}

/**
 * Sets attributes for the canvas element used for charts.
 * @param {HTMLElement} canvasElement - The canvas element.
 * @param {string} pokemonStatsId - The ID for the canvas.
 */
function setCanvasElementAttributes(canvasElement, pokemonStatsId) {
  canvasElement.id = pokemonStatsId;
  canvasElement.className = 'canvasElement';
  canvasElement.style.display = "none";
}

/**
 * Sets remaining attributes when opening the zoomed-in Pokemon view.
 */
function setRemainingAttributesInOpenPokemon() {
  document.body.style.overflow = 'hidden';
  container.classList.add('no-click');
  isPokemonInCloseUp = true;
}

/**
 * Adds type elements to the zoomed-in Pokemon card.
 * @param {HTMLElement} pokemonCloseInCard - The zoomed-in card element.
 * @param {Array} pokemonTypes - Array of Pokemon type objects.
 */
function getPokemonCardsZoomedTypes(pokemonCloseInCard, pokemonTypes) {
  for (let j = 0; j < pokemonTypes.length; j++) {
    pokemonCloseInCard.innerHTML += `<div class="types">${pokemonTypes[j]["type"]["name"]}</div>`;
  }
}

/**
 * Sets attributes for the zoomed-in cards container.
 * @param {HTMLElement} pokemonCardsZoomed - The zoomed-in container element.
 */
function setPokemonCardsZoomedAttributes(pokemonCardsZoomed) {
  pokemonCardsZoomed.classList.remove('d-none');
  pokemonCardsZoomed.style.height = '100%';
  pokemonCardsZoomed.style.width = '100%';
  pokemonCardsZoomed.style.backgroundColor = 'rgba(0,0,0,0.8)';
}

/**
 * Unsets attributes for the zoomed-in cards container.
 * @param {HTMLElement} pokemonCardsZoomed - The zoomed-in container element.
 */
function unsetPokemonCardsZoomedAttributes(pokemonCardsZoomed) {
  pokemonCardsZoomed.style.height = '0';
  pokemonCardsZoomed.style.width = '0';
  pokemonCardsZoomed.style.backgroundColor = '';
  pokemonCardsZoomed.classList.add('d-none');
  container.classList.remove('no-click');
}

/**
 * Returns the neighbouring Pokemon names for navigation.
 * @param {string} pokemonName - The current Pokemon name.
 * @returns {Array} Array containing previous and next Pokemon names.
 */
function returnNeighbouringPokemons(pokemonName) {
  let index = pokemonsArray.indexOf(pokemonName);
  let resultArray = returnRightPokemonIndices(index);
  let previous = pokemonsArray[resultArray[0]];
  let next = pokemonsArray[resultArray[1]];
  return [previous, next];
}

/**
 * Calculates the indices for previous and next Pokemon based on current index.
 * @param {number} index - The current index in the Pokemon array.
 * @returns {Array} Array containing previous and next indices.
 */
function returnRightPokemonIndices(index) {
  if (index === 0) {
    return [pokemonsArray.length - 1, 1];
  } else if (index === pokemonsArray.length - 1) {
    return [index - 1, 0];
  } else {
    return [index - 1, index + 1];
  }
}

/**
 * Shows the next Pokemon in the zoomed-in view.
 * @param {string} nextPokemon - The name of the next Pokemon.
 * @param {string} pokemonCloseIn - The ID of the zoomed-in card.
 * @param {string} pokemonName - The current Pokemon name.
 */
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

/**
 * Gets the next Pokemon in the search results array.
 * @param {number} index - The current index in the search array.
 * @returns {string} The name of the next Pokemon.
 */
function getNextPokemonInSearch(index) {
  if (pokemonArraySearched.length === 1) return pokemonArraySearched[0];
  if (index === pokemonArraySearched.length - 1) return pokemonArraySearched[0];
  return pokemonArraySearched[index + 1];
}

/**
 * Shows the previous Pokemon in the zoomed-in view.
 * @param {string} previousPokemon - The name of the previous Pokemon.
 * @param {string} pokemonCloseIn - The ID of the zoomed-in card.
 * @param {string} pokemonName - The current Pokemon name.
 */
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

/**
 * Gets the previous Pokemon in the search results array.
 * @param {number} index - The current index in the search array.
 * @returns {string} The name of the previous Pokemon.
 */
function getPreviousPokemonInSearch(index) {
  if (pokemonArraySearched.length === 1) return pokemonArraySearched[0];
  if (index === 0) return pokemonArraySearched[pokemonArraySearched.length - 1];
  return pokemonArraySearched[index - 1];
}

/**
 * Sets remaining attributes when closing the zoomed-in Pokemon view.
 */
function setRemainingAttributesInClosePokemon() {
  pokemonClickedOn = '';
  isPokemonInCloseUp = false;
  document.body.style.overflow = 'auto';
}

/**
 * Removes attributes and elements when closing the zoomed-in card.
 * @param {HTMLElement} pokemon - The original Pokemon card element.
 * @param {HTMLElement} arrowLeft - The left arrow element.
 * @param {HTMLElement} pokemonCloseInCard - The zoomed-in card element.
 * @param {HTMLElement} arrowRight - The right arrow element.
 */
function removeAttributesFunctionInClosePokemon(pokemon, arrowLeft, pokemonCloseInCard, arrowRight) {
  pokemon.classList.remove('d-none');
  arrowLeft.remove();
  pokemonCloseInCard.remove();
  arrowRight.remove();
}

// Loading more Pokemons
/**
 * Prepares the URL for loading more Pokemons by updating the offset.
 */
async function prepareURL() {
  let resultArray = iterateString(url);
  let lastCharacter = resultArray[0];
  let placeholders = resultArray[1];
  let updateCharacter = (Number(lastCharacter) + 20).toString();
  url = url.slice(0, -placeholders) + updateCharacter;
  await loadFurtherPokemons();
}

/**
 * Loads and displays further Pokemons from the updated URL.
 */
async function loadFurtherPokemons() {
  handleSpinnerAndSetOverflow('show', 'hidden');
  let response = await fetch(url);
  let responseAsJson = await response.json();
  await displayPokemons(responseAsJson);
  handleSpinnerAndSetOverflow('hide', 'visible');
}

/**
 * Iterates through the URL string to find the offset value.
 * @param {string} string - The URL string.
 * @returns {Array} Array containing the offset value and its length.
 */
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

/**
 * Disables the further Pokemon loading button based on search input.
 */
function disableFurtherPokemon() {
  let furtherPokemons = document.getElementById('furtherPokemons');
  if (searchInput.value.length > 2) {
    furtherPokemons.classList.add('d-none');
  } else {
    furtherPokemons.classList.remove('d-none');
  }
}

/**
 * Prepares and displays search results based on the search term.
 * @param {string} searchTerm - The search term entered by the user.
 */
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

/**
 * Displays the search results by setting display properties.
 * @param {Array} toShow - Array of Pokemon names to show.
 * @param {Array} notToShow - Array of Pokemon names to hide.
 */
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

/**
 * Sets the display style for an array of Pokemon cards.
 * @param {Array} array - Array of Pokemon names.
 * @param {string} displayValue - The CSS display value ('block' or 'none').
 */
function setDisplayForArray(array, displayValue) {
  for (let pokemonName of array) {
    let pokemonID = pokemonName + '_card';
    let pokemon = document.getElementById(pokemonID);
    pokemon.style.display = displayValue;
  }
}

/**
 * Removes the 'none' display style from all Pokemon cards.
 */
function removeDisplayNone() {
  for (let pokemonName of pokemonsArray) {
    let pokemonID = pokemonName + '_card';
    let pokemon = document.getElementById(pokemonID);
    pokemon.style.display = 'block';
  }
}

// Utility functions
/**
 * Handles the visibility of the loading spinner overlay.
 * @param {string} action - 'show' to display the overlay, 'hide' to hide it.
 */
function handleLoadingSpinnerVisibility(action) {
  let overlay = document.getElementById('loading-overlay');
  if (action === 'show') {
    overlay.classList.remove('d-none');
  } else if (action === 'hide') {
    overlay.classList.add('d-none');
  }
}

/**
 * Handles the loading spinner and body overflow.
 * @param {string} action - 'show' or 'hide' for the spinner.
 * @param {string} overflow - The overflow value for the body.
 */
function handleSpinnerAndSetOverflow(action, overflow) {
  handleLoadingSpinnerVisibility(action);
  document.body.style.overflow = overflow;
}

/**
 * Fetches Pokemon data from the given URL.
 * @param {string} pokemonURL - The URL to fetch Pokemon data from.
 * @returns {Promise<Object>} The JSON response from the API.
 */
async function fetchPokemonData(pokemonURL) {
  let response = await fetch(pokemonURL);
  return await response.json();
}

// Placeholder functions (assuming they exist in html_templates.js or elsewhere)
/**
 * Returns the HTML for the index tab.
 * @param {string} tabId - The ID for the tab.
 * @param {string} statsId - The ID for the stats.
 * @param {string} mainBoardId - The ID for the main board.
 * @returns {string} The HTML string.
 */
function returnIndexTab(tabId, statsId, mainBoardId) { /* Implementation */ }

/**
 * Returns the HTML for the Pokemon main board.
 * @param {string} boardId - The ID for the board.
 * @param {Array} mainInfo - The main information array.
 * @returns {string} The HTML string.
 */
function returnPokemonMainBoard(boardId, mainInfo) { /* Implementation */ }

/**
 * Sets the left arrow for the zoomed-in card.
 * @param {HTMLElement} container - The container element.
 * @param {string} prev - The previous Pokemon name.
 * @param {string} closeIn - The close-in ID.
 * @param {string} name - The Pokemon name.
 */
function getPokemonCardsZoomedArrowLeft(container, prev, closeIn, name) { /* Implementation */ }

/**
 * Sets the title for the zoomed-in card.
 * @param {string} closeIn - The close-in ID.
 * @param {HTMLElement} container - The container element.
 * @param {string} name - The Pokemon name.
 */
function getPokemonCardsZoomedTitle(closeIn, container, name) { /* Implementation */ }

/**
 * Sets the right arrow for the zoomed-in card.
 * @param {HTMLElement} container - The container element.
 * @param {string} next - The next Pokemon name.
 * @param {string} closeIn - The close-in ID.
 * @param {string} name - The Pokemon name.
 */
function getPokemonCardsZoomedArrowRight(container, next, closeIn, name) { /* Implementation */ }

/**
 * Displays the Pokemon chart.
 * @param {HTMLElement} card - The chart card element.
 * @param {string} name - The Pokemon name.
 * @param {Array} dataset - The stats dataset.
 */
function displayPokemonChart(card, name, dataset) { /* Implementation */ }