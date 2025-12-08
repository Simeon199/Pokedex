/**
 * Loads more Pokemon data when the "Load More" button is clicked.
 */
function loadFurtherPokemons() {
  if (currentPokemonIndex < 151) {
    handleSpinnerAndSetOverflow('show', 'hidden');
    let start = currentPokemonIndex;
    let end = Math.min(currentPokemonIndex + 20, 151);
    let apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=${end - start}&offset=${start}`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => displayPokemons(data).then(() => {
        currentPokemonIndex = end;
        handleSpinnerAndSetOverflow('hide', 'visible');
      }))
      .catch(error => {
        console.error('Error loading more Pokemon:', error);
        handleSpinnerAndSetOverflow('hide', 'visible');
      });
  } else {
    let furtherPokemons = document.getElementById('furtherPokemons');
    furtherPokemons.classList.add('d-none');
  }
}

/**
 * Prepares the URL for loading more Pokemon by incrementing the offset.
 */
async function prepareURL() {
  let resultArray = iterateString(url);
  let lastCharacter = resultArray[0];
  let placeholders = resultArray[1];
  let updateCharacter = Number(lastCharacter) + 20;
  updateCharacter = updateCharacter.toString();
  url = url.slice(0, -placeholders) + updateCharacter;
  await loadFurtherPokemons();
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