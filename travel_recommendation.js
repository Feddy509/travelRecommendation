// Varyab global pou sere done API yo
let travelData = {};

// 1. Rekiperere done yo nan API JSON an (Tâche 6)
function fetchRecommendations() {
    const apiUrl = './travel_recommendation_api.json';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            travelData = data;
            console.log("Done yo chaje ak siksè :", travelData);
        })
        .catch(error => {
            console.error("Erreur nan rekiperasyon done yo:", error);
        });
}

// 2. Lojik pou jere rechèch la (Tâche 7)
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const resultContainer = document.getElementById('result-container');
    
    // Netwaye zòn afichaj la anvan nou kòmanse
    resultContainer.innerHTML = '';

    // Pran sa itilizatè a tape a, retire espas initil (trim) epi mete l an miniskil (toLowerCase)
    const keyword = searchInput.value.trim().toLowerCase();

    if (keyword === '') {
        resultContainer.innerHTML = '<p class="error-msg">Veuillez entrer un mot-clé pour la recherche.</p>';
        return;
    }

    let resultsFound = [];

    // Tcheke si mo kle a gen rapò ak plaj (plage, plages, etc.)
    if (keyword.includes('plage')) {
        // Si estrikti JSON ou gen yon kle "beaches" oswa "plages"
        resultsFound = travelData.beaches || travelData.plages || [];
    } 
    // Tcheke si mo kle a gen rapò ak tanp (temple, temples)
    else if (keyword.includes('temple')) {
        resultsFound = travelData.temples || [];
    } 
    // Tcheke si mo kle a gen rapò ak peyi (pays, country)
    else if (keyword.includes('pays') || keyword.includes('countr')) {
        // Nan anpil pwojè IBM, "countries" gen yon lis peyi ki gen vil anndan yo
        if (travelData.countries) {
            travelData.countries.forEach(country => {
                resultsFound = resultsFound.concat(country.cities);
            });
        } else if (travelData.countries_list) {
            resultsFound = travelData.countries_list;
        }
    } 
    // Si se non yon vil oswa peyi dirèk li tape
    else {
        // Chache nan tout kote ki disponib yo si gen yon korespondans dirèk
        const allDestinations = [
            ...(travelData.beaches || []),
            ...(travelData.temples || []),
            ...((travelData.countries) ? travelData.countries.reduce((acc, c) => acc.concat(c.cities), []) : [])
        ];
        
        resultsFound = allDestinations.filter(item => 
            item.name.toLowerCase().includes(keyword) || 
            item.description.toLowerCase().includes(keyword)
        );
    }

    // 3. Afiche rezilta yo sou ekran an
    displayResults(resultsFound);
}

// 3. Fonksyon pou desine rezilta yo nan HTML lan
function displayResults(results) {
    const resultContainer = document.getElementById('result-container');

    if (results.length === 0) {
        resultContainer.innerHTML = '<p class="error-msg">Aucun résultat trouvé pour ce mot-clé.</p>';
        return;
    }

    // Boucle sou chak rezilta pou n kreye HTML li
    results.forEach(place => {
        const card = document.createElement('div');
        card.classList.add('result-card');

        card.innerHTML = `
            <img src="${place.imageUrl}" alt="${place.name}" class="result-img">
            <div class="result-info">
                <h3>${place.name}</h3>
                <p>${place.description}</p>
                <button type="button" class="btn-visit">Visiter</button>
            </div>
        `;
        resultContainer.appendChild(card);
    });
}

// 4. Konekte bouton yo ak koute evenman yo (EventListeners)
document.addEventListener("DOMContentLoaded", () => {
    // Chaje done yo otomatikman nan kòmansman
    fetchRecommendations();

    const btnSearch = document.getElementById('btn-search');
    const btnClear = document.getElementById('btn-clear');
    const searchInput = document.getElementById('search-input');

    // Lè moun klike sou bouton Rechercher
    if (btnSearch) {
        btnSearch.addEventListener('click', handleSearch);
    }

    // Si moun peze "Enter" nan klavye a tou pandan yo nan input la
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Lè moun klike sou bouton Réinitialiser (Mete tout bagay a zewo)
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            searchInput.value = '';
            document.getElementById('result-container').innerHTML = '';
        });
    }
});