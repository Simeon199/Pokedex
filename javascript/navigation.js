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