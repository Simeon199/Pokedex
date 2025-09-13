function returnIndexTab(pokemonIndexTabId, pokemonStatsId, pokemonMainBoardId){
    return `<div class="index_tab" id="${pokemonIndexTabId}">
        <div class="main" onclick="getPokemonMainBoard('${pokemonStatsId}', '${pokemonMainBoardId}')">Main</div>
        <div class="statistics" onclick="getPokemonStatBoard('${pokemonStatsId}', '${pokemonMainBoardId}')">Statistics</div>
      </div>`
}

function returnPokemonMainBoard(pokemonMainBoardId, mainInfo){
    return `<div class="pokemonMainBoard" id="${pokemonMainBoardId}">
        <p> Height: ${mainInfo[0]}m </p> 
        <p> Weight: ${mainInfo[1]}kg </p>  
        <p> Base Experience: ${mainInfo[2]}</p> 
        <p> Abilities: ${mainInfo[3]}</p>
      </div>`
}

function getPokemonCardsZoomedArrowLeft(htmlelement, previousPokemon, pokemonCloseIn, pokemonName){
    return htmlelement.innerHTML += 
        `<div class="arrow_left" id='arrow_left'>
            <img src="img/arrow-left.png" class="arrow" onclick="showPreviousPokemon('${previousPokemon}', '${pokemonCloseIn}', '${pokemonName}')">
        </div>`;
}
      
function getPokemonCardsZoomedArrowRight(htmlelement, nextPokemon, pokemonCloseIn, pokemonName){
    return htmlelement.innerHTML += 
        `<div class="arrow_right" id='arrow_right'>
            <img src="img/right-arrow.png" class="arrow" onclick="showNextPokemon('${nextPokemon}','${pokemonCloseIn}', '${pokemonName}')">
        </div>`;
}
      
function getPokemonCardsZoomedTitle(pokemonCloseIn, htmlelement, pokemonName){
    return htmlelement.innerHTML += 
        `<div class="pokemonCloseIn" id="${pokemonCloseIn}">
            <h2>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h2>
        </div>`;
}    

function addPokemonsToContainer(htmlelement, pokemonID, pokemonName){
    return htmlelement.innerHTML += `
      <div class="pokemonContainer" id="${pokemonID}" onclick="openPokemonCard('${pokemonID}', '${pokemonName}')">
        <h2>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h2>
      </div>`;
}

function buildPokemonContainer(pokemonID, pokemonName, pokemonImage, pokemonTypesId){
    return `<div class="pokemonContainer" id='${pokemonID}' onclick="openPokemonCard('${pokemonName}')">
                <h2>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h2>
                <div class="types" id="${pokemonTypesId}"></div>
                <img src="${pokemonImage}">
            </div>`;
}