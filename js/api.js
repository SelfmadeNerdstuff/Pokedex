const MAX_POKEMON = 151;
let currentOffset = 0;
let globalCache = {};

async function loadPokemon() {
    let limit = (currentOffset + 20 > MAX_POKEMON) ? MAX_POKEMON - currentOffset : 20;
    currentOffset += limit;
    
    let visibleIds = [];
    for (let i = 1; i <= currentOffset; i++) visibleIds.push(i);
    
    await updateGridView(visibleIds);
    
    let btn = document.getElementById('load-more-btn');
    btn.style.display = (currentOffset >= MAX_POKEMON) ? 'none' : 'inline-block';
}

async function updateGridView(visibleIds) {
    let missingIds = visibleIds.filter(id => !document.getElementById(`card-${id}`));
    await fetchAndAppendMissing(missingIds);
    toggleCardVisibility(visibleIds);
}

async function fetchAndAppendMissing(missingIds) {
    if (missingIds.length === 0) return;
    toggleLoading(true);
    let grid = document.getElementById('pokemon-grid');
    for (let i = 0; i < missingIds.length; i++) {
        let html = await createCardHTML(missingIds[i]);
        grid.insertAdjacentHTML('beforeend', html);
    }
    toggleLoading(false);
}

async function createCardHTML(id) {
    let p = await getPokemon(id);
    let name = p.name.charAt(0).toUpperCase() + p.name.slice(1);
    let types = p.types.map(t => t.type.name);
    return generatePokemonCardHTML(p.id, name, p.sprites.front_default, types);
}

function toggleCardVisibility(visibleIds) {
    let cards = document.querySelectorAll('.pokemon-card');
    for (let i = 0; i < cards.length; i++) {
        let cardId = parseInt(cards[i].id.replace('card-', ''));
        cards[i].classList.toggle('d-none', !visibleIds.includes(cardId));
    }
}

async function fetchData(url) {
    if (globalCache[url]) return globalCache[url];
    let res = await fetch(url);
    let data = await res.json();
    globalCache[url] = data;
    return data;
}

async function getPokemon(idOrUrl) {
    if (globalCache[idOrUrl]) return globalCache[idOrUrl];
    let url = idOrUrl.toString().startsWith('http') ? idOrUrl : `https://pokeapi.co/api/v2/pokemon/${idOrUrl}`;
    let data = await fetchData(url);
    globalCache[data.id] = data;
    globalCache[url] = data;
    return data;
}

document.getElementById('load-more-btn').addEventListener('click', loadPokemon);
loadPokemon();