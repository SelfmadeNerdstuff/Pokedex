function generateTypeBadgesHTML(typesArray) {
    let html = '';
    for (let i = 0; i < typesArray.length; i++) {
        let type = typesArray[i];
        let file = typeTranslations[type];
        html += `<span class="type-badge type-${type}">
            <img src="./img/${file}.png" alt="${type}" class="card-type-icon">${type}
        </span>`;
    }
    return html;
}

function generatePokemonCardHTML(id, name, image, typesArray) {
    let main = typesArray[0]; 
    return `<div class="pokemon-card type-${main}" id="card-${id}" onclick="openOverlay(${id})" style="order: ${id};">
        <div class="card-header">
            <h3 class="card-title">${name}</h3>
            <span class="card-id">#${id}</span>
        </div>
        <img src="${image}" alt="${name}" class="card-image">
        <div class="card-types-container">${generateTypeBadgesHTML(typesArray)}</div>
    </div>`;
}

function getStatHTML(name, val, pct, colorClass) {
    return `<div class="stat-row">
        <div class="stat-name">${name}</div><div class="stat-value">${val}</div>
        <div class="stat-bar-bg"><div class="stat-bar-fill ${colorClass}" style="width:${pct}%;"></div></div>
    </div>`;
}

function getMoveHTML(name, level) {
    return `<div class="move-item">
        <span>${name}</span><span class="move-level">Lv. ${level}</span>
    </div>`;
}

function getAbilityHTML(name, isHidden, desc) {
    let hiddenBadge = isHidden ? '<span class="hidden-badge">(Hidden)</span>' : '';
    return `<div class="ability-item">
        <span>${name} ${hiddenBadge}</span><span class="ability-desc">${desc}</span>
    </div>`;
}