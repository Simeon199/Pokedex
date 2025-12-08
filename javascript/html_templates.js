/**
 * Returns the HTML template for the index tab with Main and Statistics buttons.
 * @param {string} pokemonIndexTabId - The ID for the index tab element.
 * @param {string} pokemonStatsId - The ID for the statistics board.
 * @param {string} pokemonMainBoardId - The ID for the main board.
 * @returns {string} The HTML string for the index tab.
 */
function returnIndexTab(pokemonIndexTabId, pokemonStatsId, pokemonMainBoardId){
    return `<div class="index_tab" id="${pokemonIndexTabId}">
        <div class="main" onclick="getPokemonMainBoard('${pokemonStatsId}', '${pokemonMainBoardId}')">Main</div>
        <div class="statistics" onclick="getPokemonStatBoard('${pokemonStatsId}', '${pokemonMainBoardId}')">Statistics</div>
      </div>`
}

/**
 * Returns the HTML template for the Pokemon main board displaying basic info.
 * @param {string} pokemonMainBoardId - The ID for the main board element.
 * @param {Array} mainInfo - Array containing [height, weight, baseExperience, abilities].
 * @returns {string} The HTML string for the main board.
 */
function returnPokemonMainBoard(pokemonMainBoardId, mainInfo){
    return `<div class="pokemonMainBoard" id="${pokemonMainBoardId}">
        <p> Height: ${mainInfo[0]}m </p>
        <p> Weight: ${mainInfo[1]}kg </p>
        <p> Base Experience: ${mainInfo[2]}</p>
        <p> Abilities: ${mainInfo[3]}</p>
      </div>`
}

/**
 * Adds the left arrow HTML to the zoomed Pokemon card for navigation.
 * @param {HTMLElement} htmlelement - The HTML element to append to.
 * @param {string} previousPokemon - The name of the previous Pokemon.
 * @param {string} pokemonCloseIn - The ID of the zoomed card.
 * @param {string} pokemonName - The current Pokemon name.
 */
function getPokemonCardsZoomedArrowLeft(htmlelement, previousPokemon, pokemonCloseIn, pokemonName){
    return htmlelement.innerHTML +=
        `<div class="arrow_left" id='arrow_left'>
            <img src="img/arrow-left.png" class="arrow" onclick="showPreviousPokemon('${previousPokemon}', '${pokemonCloseIn}', '${pokemonName}')">
        </div>`;
}

/**
 * Adds the right arrow HTML to the zoomed Pokemon card for navigation.
 * @param {HTMLElement} htmlelement - The HTML element to append to.
 * @param {string} nextPokemon - The name of the next Pokemon.
 * @param {string} pokemonCloseIn - The ID of the zoomed card.
 * @param {string} pokemonName - The current Pokemon name.
 */
function getPokemonCardsZoomedArrowRight(htmlelement, nextPokemon, pokemonCloseIn, pokemonName){
    return htmlelement.innerHTML +=
        `<div class="arrow_right" id='arrow_right'>
            <img src="img/right-arrow.png" class="arrow" onclick="showNextPokemon('${nextPokemon}','${pokemonCloseIn}', '${pokemonName}')">
        </div>`;
}

/**
 * Adds the title HTML to the zoomed Pokemon card.
 * @param {string} pokemonCloseIn - The ID for the zoomed card container.
 * @param {HTMLElement} htmlelement - The HTML element to append to.
 * @param {string} pokemonName - The name of the Pokemon to display as title.
 */
function getPokemonCardsZoomedTitle(pokemonCloseIn, htmlelement, pokemonName){
    return htmlelement.innerHTML +=
        `<div class="pokemonCloseIn" id="${pokemonCloseIn}">
            <h2>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h2>
        </div>`;
}

/**
 * Adds a Pokemon container HTML to the specified element.
 * @param {HTMLElement} htmlelement - The HTML element to append to.
 * @param {string} pokemonID - The ID for the Pokemon container.
 * @param {string} pokemonName - The name of the Pokemon.
 */
function addPokemonsToContainer(htmlelement, pokemonID, pokemonName){
    return htmlelement.innerHTML += `
      <div class="pokemonContainer" id="${pokemonID}" onclick="openPokemonCard('${pokemonID}', '${pokemonName}')">
        <h2>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h2>
      </div>`;
}

/**
 * Builds the HTML template for a Pokemon container with image and types.
 * @param {string} pokemonID - The ID for the Pokemon container.
 * @param {string} pokemonName - The name of the Pokemon.
 * @param {string} pokemonImage - The URL of the Pokemon image.
 * @param {string} pokemonTypesId - The ID for the types container.
 * @returns {string} The HTML string for the Pokemon container.
 */
function buildPokemonContainer(pokemonID, pokemonName, pokemonImage, pokemonTypesId){
    return `<div class="pokemonContainer" id='${pokemonID}' onclick="openPokemonCard('${pokemonName}')">
                <h2>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h2>
                <div class="types" id="${pokemonTypesId}"></div>
                <img src="${pokemonImage}">
            </div>`;
}

/**
 * Extracts and displays Pokemon types in the specified container.
 * @param {string} pokemonTypesId - The ID of the types container element.
 * @param {Object} access - The object containing Pokemon types data.
 */

function extractPokemonType(pokemonTypesId, access){
  let array = access["pokemonTypes"];
  let types = document.getElementById(pokemonTypesId);
  for(i = 0; i < array.length; i++){
    types.innerHTML += `<div class="type"><p>${array[i]["type"]["name"]}</p></div>`;
  }
}