let currentOverlayId = null;

async function openOverlay(id) {
    currentOverlayId = id;
    document.getElementById('pokemon-overlay').classList.remove('d-none');
    document.body.style.overflow = 'hidden';
    closeTab();

    let data = await getPokemon(id);
    fillOverlayHeader(data);
    fillOverlayAbout(data);
}

function closeOverlay() {
    document.getElementById('pokemon-overlay').classList.add('d-none');
    document.body.style.overflow = '';
}

async function navigatePokemon(direction, event) {
    event.stopPropagation();
    let newId = currentOverlayId + direction;
    if (newId < 1 || newId > 151) return;
    await openOverlay(newId);
}

function fillOverlayHeader(data) {
    let mainType = data.types[0].type.name;
    let card = document.getElementById('overlay-card');
    card.style.borderColor = `var(--bg-${mainType})`;
    
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
        let color = pct > 50 ? '#78C850' : '#F08030'; 
        let name = s.stat.name.replace('special-attack', 'sp.atk').replace('special-defense', 'sp.def');
        html += getStatHTML(name, s.base_stat, pct, color);
    });
    container.innerHTML = html;
}

function getStatHTML(name, val, pct, color) {
    return `<div class="stat-row">
        <div class="stat-name">${name}</div><div class="stat-value">${val}</div>
        <div class="stat-bar-bg"><div class="stat-bar-fill" style="width:${pct}%;background:${color};"></div></div>
    </div>`;
}

function renderMoves(container) {
    let moves = globalCache[currentOverlayId].moves;
    let lvlMoves = moves.filter(m => m.version_group_details[0].move_learn_method.name === 'level-up');
    lvlMoves.sort((a, b) => b.version_group_details[0].level_learned_at - a.version_group_details[0].level_learned_at);
    
    let html = '';
    lvlMoves.slice(0, 5).forEach(m => {
        html += `<div class="move-item"><span>${m.move.name.replace('-', ' ')}</span><span class="move-level">Lv. ${m.version_group_details[0].level_learned_at}</span></div>`;
    });
    container.innerHTML = html || '<p>No moves found.</p>';
}

async function renderAbilities(container) {
    container.innerHTML = '<p style="text-align:center;color:#aaa;">Loading...</p>';
    let abilities = globalCache[currentOverlayId].abilities;
    let html = '';
    for (let i = 0; i < abilities.length; i++) {
        let desc = await fetchAbilityDesc(abilities[i].ability.url);
        let hidden = abilities[i].is_hidden ? '<span style="font-size:12px;color:#aaa;">(Hidden)</span>' : '';
        let name = abilities[i].ability.name.replace('-', ' ');
        html += `<div class="ability-item"><span>${name} ${hidden}</span><span class="ability-desc">${desc}</span></div>`;
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
    container.innerHTML = img ? `<div class="shiny-container"><img src="${img}" alt="Shiny Form"></div>` : '<p>No image.</p>';
}