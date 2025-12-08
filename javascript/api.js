/**
 * Fetches Pokemon data from the given URL.
 * @param {string} pokemonURL - The URL to fetch Pokemon data from.
 * @returns {Promise<Object>} The JSON response from the API.
 */

async function fetchPokemonData(pokemonURL) {
  let response = await fetch(pokemonURL);
  return await response.json();
}

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