let activeFilters = [];
let tempFilters = []; 

document.querySelectorAll('.filter-icon').forEach(icon => {
    icon.addEventListener('click', handleFilterClick);
});

function isMobileView() {
    return window.innerWidth <= 768;
}

function handleFilterClick(e) {
    let type = e.currentTarget.getAttribute('data-type');
    let current = isMobileView() ? tempFilters : activeFilters;
    
    if (current.includes(type)) current.splice(current.indexOf(type), 1);
    else current.push(type);
    
    updateFilterUI();
    if (!isMobileView()) applyFilters();
}

function updateFilterUI() {
    let current = isMobileView() ? tempFilters : activeFilters;
    document.querySelectorAll('.filter-icon').forEach(icon => {
        let type = icon.getAttribute('data-type');
        let isActive = current.length === 0 || current.includes(type);
        icon.classList.toggle('inactive-filter', !isActive);
    });
}

async function applyFilters() {
    removeNoResultsMsg();
    if (activeFilters.length === 0) return restoreNormalView();

    document.getElementById('load-more-btn').style.display = 'none';
    let urls = await getFilteredUrls();
    let visibleIds = urls.map(url => parseInt(url.split('/').slice(-2, -1)[0])).filter(id => id <= 151);
    
    if (visibleIds.length === 0) showNoResultsMsg();
    else await updateGridView(visibleIds);
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
        if (!urls.includes(url)) urls.push(url);
    }
}

function restoreNormalView() {
    let btn = document.getElementById('load-more-btn');
    btn.style.display = (currentOffset >= 151) ? 'none' : 'inline-block';
    let visibleIds = [];
    for (let i = 1; i <= currentOffset; i++) visibleIds.push(i);
    updateGridView(visibleIds);
}

function openFilterOverlay() {
    tempFilters = [...activeFilters]; 
    document.getElementById('filter-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    updateFilterUI();
}

document.getElementById('filter-apply-btn').onclick = function() {
    activeFilters = [...tempFilters];
    document.getElementById('filter-overlay').classList.remove('active');
    document.body.style.overflow = '';
    applyFilters();
};