/**
 * Loads more Pokemon data when the "Load More" button is clicked.
 */
function loadMorePokemon() {
  if (currentPokemonIndex < 151) {
    let start = currentPokemonIndex;
    let end = Math.min(currentPokemonIndex + 20, 151);
    fetchPokemonData(start, end);
    currentPokemonIndex = end;
  } else {
    let furtherPokemons = document.getElementById('furtherPokemons');
    furtherPokemons.classList.add('d-none');
  }
}

/**
 * Updates the current Pokemon index after loading more.
 * @param {number} newIndex - The new current index.
 */
function updateCurrentPokemonIndex(newIndex) {
  currentPokemonIndex = newIndex;
}

/**
 * Checks if more Pokemon can be loaded.
 * @returns {boolean} True if more Pokemon can be loaded, false otherwise.
 */
function canLoadMorePokemon() {
  return currentPokemonIndex < 151;
}