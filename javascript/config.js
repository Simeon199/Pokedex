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
let currentPokemonIndex = 0;

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
  try {
    handleSpinnerAndSetOverflow('show', 'hidden');
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let responseAsJson = await response.json();
    await displayPokemons(responseAsJson);
    currentPokemonIndex = 20;
    handleSpinnerAndSetOverflow('hide', 'visible');
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    alert('Failed to load Pokemon data. Please check your internet connection and try again.');
  }
}


function handleSpinnerAndSetOverflow(stringOne, stringTwo){
  handleLoadingSpinnerVisibility(stringOne);
  document.body.style.overflow = stringTwo;
}

function handleLoadingSpinnerVisibility(string){
  if(string === 'show'){
    document.getElementById('loading-overlay').classList.remove('d-none');
  } else if(string === 'hide'){
    document.getElementById('loading-overlay').classList.add('d-none');
  }
}

// Initialize the app when the page loads
window.addEventListener('load', init);