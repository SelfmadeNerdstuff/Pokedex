const MAX_POKEMON = 151;
let currentOffset = 0;
let globalCache = {};

async function loadPokemon() {
    toggleLoading(true);
    let limit = (currentOffset + 20 > MAX_POKEMON) ? MAX_POKEMON - currentOffset : 20;
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${currentOffset}`;
    await fetchAndRenderList(url);
    currentOffset += limit;
    toggleLoading(false);
}

async function fetchAndRenderList(url) {
    let data = await fetchData(url);
    for (let i = 0; i < data.results.length; i++) {
        await loadAndRenderSinglePokemon(data.results[i].url);
    }
}

async function loadAndRenderSinglePokemon(url) {
    let p = await getPokemon(url);
    let name = p.name.charAt(0).toUpperCase() + p.name.slice(1);
    let types = p.types.map(t => t.type.name);
    let html = generatePokemonCardHTML(p.id, name, p.sprites.front_default, types);
    document.getElementById('pokemon-grid').innerHTML += html;
}

async function fetchData(url) {
    if (globalCache[url]) return globalCache[url];
    let res = await fetch(url);
    let data = await res.json();
    globalCache[url] = data;
    return data;
}

async function getPokemon(idOrUrl) {
    let url = idOrUrl.toString().startsWith('http') ? idOrUrl : `https://pokeapi.co/api/v2/pokemon/${idOrUrl}`;
    let data = await fetchData(url);
    globalCache[data.id] = data;
    return data;
}

document.getElementById('load-more-btn').addEventListener('click', loadPokemon);
loadPokemon();