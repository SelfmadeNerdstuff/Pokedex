const germanToEnglish = {
    "bisasam": "bulbasaur", "bisaknosp": "ivysaur", "bisaflor": "venusaur", 
    "glumanda": "charmander", "glutexo": "charmeleon", "glurak": "charizard", 
    "schiggy": "squirtle", "schillok": "wartortle", "turtok": "blastoise", 
    "raupy": "caterpie", "safcon": "metapod", "smettbo": "butterfree", 
    "hornliu": "weedle", "kokuna": "kakuna", "bibor": "beedrill", 
    "taubsi": "pidgey", "tauboga": "pidgeotto", "tauboss": "pidgeot", 
    "rattfratz": "rattata", "rattikarl": "raticate", "habitak": "spearow", 
    "ibitak": "fearow", "rettan": "ekans", "arbok": "arbok", 
    "pikachu": "pikachu", "raichu": "raichu", "sandan": "sandshrew", 
    "sandamer": "sandslash", "nidoran♀": "nidoran-f", "nidorina": "nidorina", 
    "nidoqueen": "nidoqueen", "nidoran♂": "nidoran-m", "nidorino": "nidorino", 
    "nidoking": "nidoking", "piepi": "clefairy", "pixi": "clefable", 
    "vulpix": "vulpix", "vulnona": "ninetales", "pummeluff": "jigglypuff", 
    "knuddeluff": "wigglytuff", "zubat": "zubat", "golbat": "golbat", 
    "myrapla": "oddish", "duflor": "gloom", "giflor": "vileplume", 
    "paras": "paras", "parasek": "parasect", "bluzuk": "venonat", 
    "omot": "venomoth", "digda": "diglett", "digdri": "dugtrio", 
    "mauzi": "meowth", "snobilikat": "persian", "enton": "psyduck", 
    "entoron": "golduck", "menki": "mankey", "rasaff": "primeape", 
    "fukano": "growlithe", "arkani": "arcanine", "quapsel": "poliwag", 
    "quaputzi": "poliwhirl", "quappo": "poliwrath", "abra": "abra", 
    "kadabra": "kadabra", "simsala": "alakazam", "machollo": "machop", 
    "maschock": "machoke", "machomei": "machamp", "knofensa": "bellsprout", 
    "ultigaria": "weepinbell", "sarzenia": "victreebel", "tentacha": "tentacool", 
    "tentoxa": "tentacruel", "kleinstein": "geodude", "georok": "graveler", 
    "geowaz": "golem", "ponita": "ponyta", "gallopa": "rapidash", 
    "flegmon": "slowpoke", "lahmus": "slowbro", "magnetilo": "magnemite", 
    "magneton": "magneton", "porenta": "farfetchd", "dodu": "doduo", 
    "dodri": "dodrio", "jurob": "seel", "jugong": "dewgong", 
    "sleima": "grimer", "sleimok": "muk", "muschas": "shellder", 
    "austos": "cloyster", "nebulak": "gastly", "alpollo": "haunter", 
    "gengar": "gengar", "onix": "onix", "traumato": "drowzee", 
    "hypno": "hypno", "krabby": "krabby", "kingler": "kingler", 
    "voltobal": "voltorb", "lektrobal": "electrode", "owei": "exeggcute", 
    "kokowei": "exeggutor", "tragosso": "cubone", "knogga": "marowak", 
    "kicklee": "hitmonlee", "nockchan": "hitmonchan", "schlurp": "lickitung", 
    "smogon": "koffing", "smogmog": "weezing", "rihorn": "rhyhorn", 
    "rizeros": "rhydon", "chaneira": "chansey", "tangela": "tangela", 
    "kangama": "kangaskhan", "seeper": "horsea", "seemon": "seadra", 
    "goldini": "goldeen", "golking": "seaking", "sterndu": "staryu", 
    "starmie": "starmie", "pantimos": "mr-mime", "sichlor": "scyther", 
    "rossana": "jynx", "elektek": "electabuzz", "magmar": "magmar", 
    "pinsir": "pinsir", "tauros": "tauros", "karpador": "magikarp", 
    "garados": "gyarados", "lapras": "lapras", "ditto": "ditto", 
    "evoli": "eevee", "aquana": "vaporeon", "blitza": "jolteon", 
    "flamara": "flareon", "porygon": "porygon", "amonitas": "omanyte", 
    "amoroso": "omastar", "kabuto": "kabuto", "kabutops": "kabutops", 
    "aerodactyl": "aerodactyl", "relaxo": "snorlax", "arktos": "articuno", 
    "zapdos": "zapdos", "lavados": "moltres", "dratini": "dratini", 
    "dragonir": "dragonair", "dragoran": "dragonite", "mewtu": "mewtwo", 
    "mew": "mew"
};

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

async function performSearch() {
    let term = searchInput.value.toLowerCase().trim();
    let isNum = !isNaN(term) && term !== '';
    if (!isNum && term.length > 0 && term.length < 3) return;

    let grid = document.getElementById('pokemon-grid');
    grid.innerHTML = '';
    if (term.length === 0) return resetApp();

    toggleLoading(true);
    await executeSearchQuery(term, isNum, grid);
    toggleLoading(false);
}

async function executeSearchQuery(term, isNum, grid) {
    let data = await fetchData('https://pokeapi.co/api/v2/pokemon?limit=151');
    let matches = data.results.filter(p => isMatch(p, term, isNum));
    
    if (matches.length === 0) {
        grid.innerHTML = '<p class="no-results">No Pokemon found.</p>';
        return;
    }
    for (let i = 0; i < matches.length; i++) await loadAndRenderSinglePokemon(matches[i].url);
}

function isMatch(p, term, isNum) {
    let eng = p.name;
    let ger = getGermanName(eng);
    let id = p.url.split('/').slice(-2, -1)[0];
    if (isNum) return id === Number(term).toString();
    return eng.includes(term) || ger.includes(term);
}

function getGermanName(engName) {
    return Object.keys(germanToEnglish).find(k => germanToEnglish[k] === engName) || "";
}

searchInput.addEventListener('input', performSearch);
searchBtn.addEventListener('click', performSearch);