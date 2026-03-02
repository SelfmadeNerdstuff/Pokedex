let currentOverlayId = null;

async function openOverlay(id) {
    currentOverlayId = id;
    
    let data = await getPokemon(id);
    fillOverlayHeader(data);
    fillOverlayAbout(data);
    closeTab();

    document.getElementById('pokemon-overlay').classList.remove('d-none');
    document.body.style.overflow = 'hidden';
    
    updateNavArrows();
}

function closeOverlay() {
    document.getElementById('pokemon-overlay').classList.add('d-none');
    document.body.style.overflow = '';
}

async function navigatePokemon(direction, event) {
    event.stopPropagation();
    let cards = Array.from(document.querySelectorAll('.pokemon-card:not(.d-none)'));
    let index = cards.findIndex(c => c.id === `card-${currentOverlayId}`);
    let newIndex = index + direction;
    
    let searchInput = document.getElementById('search-input');
    let isNormalView = (typeof activeFilters !== 'undefined' && activeFilters.length === 0) && (searchInput && searchInput.value.trim() === '');
    
    if (newIndex >= cards.length && isNormalView) {
        if (typeof currentOffset !== 'undefined' && currentOffset < 151) {
            await loadPokemon();
            cards = Array.from(document.querySelectorAll('.pokemon-card:not(.d-none)'));
        }
    }
    
    if (newIndex >= 0 && newIndex < cards.length) {
        let newId = parseInt(cards[newIndex].id.replace('card-', ''));
        await openOverlay(newId);
    }
}

function updateNavArrows() {
    let cards = Array.from(document.querySelectorAll('.pokemon-card:not(.d-none)'));
    let index = cards.findIndex(c => c.id === `card-${currentOverlayId}`);
    let leftArrow = document.getElementById('nav-left');
    let rightArrow = document.getElementById('nav-right');
    
    if (!leftArrow || !rightArrow) return;
    
    leftArrow.classList.toggle('d-none', index <= 0);
    
    let searchInput = document.getElementById('search-input');
    let isNormalView = (typeof activeFilters !== 'undefined' && activeFilters.length === 0) && (searchInput && searchInput.value.trim() === '');
    let canLoadMore = isNormalView && (typeof currentOffset !== 'undefined' && currentOffset < 151);
    
    rightArrow.classList.toggle('d-none', index >= cards.length - 1 && !canLoadMore);
}

function fillOverlayHeader(data) {
    let mainType = data.types[0].type.name;
    let card = document.getElementById('overlay-card');
    card.className = `overlay-content type-${mainType}`; 
    
    document.getElementById('overlay-name').innerText = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    document.getElementById('overlay-id').innerText = '#' + data.id.toString().padStart(3, '0');
    document.getElementById('overlay-image').src = data.sprites.front_default;
    
    let types = data.types.map(t => t.type.name);
    document.getElementById('overlay-types').innerHTML = generateTypeBadgesHTML(types);
}

function fillOverlayAbout(data) {
    document.getElementById('overlay-about').innerHTML = `
        <div><span>Height</span>${data.height / 10} m</div>
        <div><span>Weight</span>${data.weight / 10} kg</div>
        <div><span>Base Exp</span>${data.base_experience}</div>
    `;
}

function openTab(tabName) {
    document.getElementById('overlay-grid').classList.add('d-none');
    document.getElementById('overlay-details').classList.remove('d-none');
    let title = document.getElementById('details-title');
    let content = document.getElementById('details-content');
    updateTabContent(tabName, title, content);
}

function closeTab() {
    document.getElementById('overlay-grid').classList.remove('d-none');
    document.getElementById('overlay-details').classList.add('d-none');
}

function updateTabContent(tabName, title, content) {
    if (tabName === 'stats') { title.innerText = 'Base Stats'; renderStats(content); }
    if (tabName === 'moves') { title.innerText = 'Strongest Moves'; renderMoves(content); }
    if (tabName === 'abilities') { title.innerText = 'Abilities'; renderAbilities(content); }
    if (tabName === 'shiny') { title.innerText = 'Shiny Form'; renderShiny(content); }
}

function renderStats(container) {
    let html = '';
    globalCache[currentOverlayId].stats.forEach(s => {
        let pct = Math.min((s.base_stat / 150) * 100, 100); 
        let colorClass = pct > 50 ? 'bg-stat-high' : 'bg-stat-low'; 
        let name = s.stat.name.replace('special-attack', 'sp.atk').replace('special-defense', 'sp.def');
        html += getStatHTML(name, s.base_stat, pct, colorClass);
    });
    container.innerHTML = html;
}

function renderMoves(container) {
    let moves = globalCache[currentOverlayId].moves;
    let lvlMoves = moves.filter(m => m.version_group_details[0].move_learn_method.name === 'level-up');
    lvlMoves.sort((a, b) => b.version_group_details[0].level_learned_at - a.version_group_details[0].level_learned_at);
    
    let html = '';
    lvlMoves.slice(0, 5).forEach(m => {
        let name = m.move.name.replace('-', ' ');
        let lvl = m.version_group_details[0].level_learned_at;
        html += getMoveHTML(name, lvl);
    });
    container.innerHTML = html || '<p class="empty-msg">No moves found.</p>';
}

async function renderAbilities(container) {
    let abilities = globalCache[currentOverlayId].abilities;
    let needsLoading = abilities.some(a => !globalCache[a.ability.url]);
    
    if (needsLoading) {
        container.innerHTML = '<p class="loading-text">Loading...</p>';
    }
    
    let html = '';
    for (let i = 0; i < abilities.length; i++) {
        let desc = await fetchAbilityDesc(abilities[i].ability.url);
        let name = abilities[i].ability.name.replace('-', ' ');
        html += getAbilityHTML(name, abilities[i].is_hidden, desc);
    }
    container.innerHTML = html;
}

async function fetchAbilityDesc(url) {
    let data = await fetchData(url);
    let effect = data.effect_entries.find(e => e.language.name === 'en');
    return effect ? effect.short_effect : 'No description available.';
}

function renderShiny(container) {
    let img = globalCache[currentOverlayId].sprites.front_shiny;
    container.innerHTML = img ? `<div class="shiny-container"><img src="${img}" alt="Shiny Form"></div>` : '<p class="empty-msg">No image.</p>';
}