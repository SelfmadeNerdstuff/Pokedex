let activeFilters = [];

document.querySelectorAll('.filter-icon').forEach(icon => {
    icon.addEventListener('click', handleFilterClick);
});

function handleFilterClick(e) {
    let type = e.currentTarget.getAttribute('data-type');
    if (activeFilters.includes(type)) activeFilters = activeFilters.filter(t => t !== type);
    else activeFilters.push(type);
    updateFilterUI();
    applyFilters();
}

function updateFilterUI() {
    document.querySelectorAll('.filter-icon').forEach(icon => {
        let type = icon.getAttribute('data-type');
        let isActive = activeFilters.length === 0 || activeFilters.includes(type);
        icon.classList.toggle('inactive-filter', !isActive);
    });
}

async function applyFilters() {
    let grid = document.getElementById('pokemon-grid');
    grid.innerHTML = '';
    if (activeFilters.length === 0) return resetApp();

    toggleLoading(true);
    let urls = await getFilteredUrls();
    for (let i = 0; i < urls.length; i++) await loadAndRenderSinglePokemon(urls[i]);
    toggleLoading(false);
}

async function getFilteredUrls() {
    let urls = [];
    for (let i = 0; i < activeFilters.length; i++) {
        let data = await fetchData(`https://pokeapi.co/api/v2/type/${activeFilters[i]}`);
        extractValidUrls(data.pokemon, urls);
    }
    return urls;
}

function extractValidUrls(pokemonList, urls) {
    for (let j = 0; j < pokemonList.length; j++) {
        let url = pokemonList[j].pokemon.url;
        let id = parseInt(url.split('/').slice(-2, -1)[0]);
        if (id <= 151 && !urls.includes(url)) urls.push(url);
    }
}

function resetApp() {
    currentOffset = 0;
    document.getElementById('load-more-btn').style.display = 'inline-block';
    loadPokemon();
}