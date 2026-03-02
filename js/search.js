const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

async function performSearch() {
    let term = searchInput.value.toLowerCase().trim();
    let isNum = !isNaN(term) && term !== '';
    if (!isNum && term.length > 0 && term.length < 3) return;

    removeNoResultsMsg();
    if (term.length === 0) return restoreNormalView();

    document.getElementById('load-more-btn').style.display = 'none';
    await executeSearchQuery(term, isNum);
}

async function executeSearchQuery(term, isNum) {
    let data = await fetchData('https://pokeapi.co/api/v2/pokemon?limit=151');
    let matches = data.results.filter(p => isMatch(p, term, isNum));
    
    let visibleIds = matches.map(p => parseInt(p.url.split('/').slice(-2, -1)[0]));
    
    if (visibleIds.length === 0) {
        await updateGridView([]);
        showNoResultsMsg();
    } else {
        await updateGridView(visibleIds);
    }
}

function isMatch(p, term, isNum) {
    let eng = p.name;
    let ger = getGermanName(eng);
    let id = p.url.split('/').slice(-2, -1)[0];
    if (isNum) return id === Number(term).toString();
    return eng.startsWith(term) || ger.startsWith(term);
}

function getGermanName(engName) {
    let keys = Object.keys(germanToEnglish);
    return keys.find(k => germanToEnglish[k] === engName) || "";
}

function showNoResultsMsg() {
    let grid = document.getElementById('pokemon-grid');
    grid.insertAdjacentHTML('beforeend', '<p id="no-results-msg" class="no-results" style="order: 999;">No Pokemon found.</p>');
}

function removeNoResultsMsg() {
    let msg = document.getElementById('no-results-msg');
    if (msg) msg.remove();
}

searchInput.addEventListener('input', performSearch);
searchBtn.addEventListener('click', performSearch);