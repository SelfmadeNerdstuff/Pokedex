const typeTranslations = {
    "normal": "normal", "fire": "feuer", "water": "wasser", "grass": "pflanze",
    "electric": "blitz", "ice": "eis", "fighting": "kampf", "poison": "gift",
    "ground": "boden", "flying": "flug", "psychic": "psy", "bug": "insekt",
    "rock": "gestein", "ghost": "geist", "dragon": "drache", "steel": "stahl",
    "fairy": "fee"
};

function generateTypeBadgesHTML(typesArray) {
    let html = '';
    for (let i = 0; i < typesArray.length; i++) {
        let type = typesArray[i];
        let file = typeTranslations[type];
        html += `<span class="type-badge" style="background-color: var(--bg-${type});">
            <img src="./img/${file}.png" alt="${type}" class="card-type-icon">${type}
        </span>`;
    }
    return html;
}

function generatePokemonCardHTML(id, name, image, typesArray) {
    let main = typesArray[0]; 
    return `<div class="pokemon-card" id="card-${id}" data-type="${main}" 
            onclick="openOverlay(${id})" 
            style="border-color: var(--bg-${main}); --hover-fill-color: var(--bg-${main});">
        <div class="card-header"><h3 class="card-title">${name}</h3>
        <span class="card-id">#${id}</span></div>
        <img src="${image}" alt="${name}" class="card-image">
        <div class="card-types-container">${generateTypeBadgesHTML(typesArray)}</div>
    </div>`;
}

function toggleLoading(isLoading) {
    let btn = document.getElementById('load-more-btn');
    let spinner = document.getElementById('loading-spinner');
    btn.disabled = isLoading;
    if (isLoading) spinner.classList.remove('d-none');
    else spinner.classList.add('d-none');
    if (!isLoading && typeof currentOffset !== 'undefined' && currentOffset >= 151) {
        btn.style.display = 'none';
    }
}