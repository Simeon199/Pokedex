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