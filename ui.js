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