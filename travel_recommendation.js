// 1. Varyab global pou sere done API yo
let travelData = {};

// 2. Fonksyon pou rekiperere done nan API JSON an (Tâche 6)
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

// 3. Lojik pou jere rechèch la (Tâche 7 & 8)
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const resultContainer = document.getElementById('result-container');
    
    // Netwaye zòn afichaj la anvan nou mete nouvo rezilta
    resultContainer.innerHTML = '';

    // Konvèti mo kle a an miniskil epi retire espas initil
    const keyword = searchInput.value.trim().toLowerCase();

    if (keyword === '') {
        resultContainer.innerHTML = '<p class="error-msg">Veuillez entrer un mot-clé pour la recherche.</p>';
        return;
    }

    let resultsFound = [];

    // Filtraj selon mo kle yo (plage, temple, pays)
    if (keyword.includes('plage')) {
        resultsFound = travelData.beaches || [];
    } 
    else if (keyword.includes('temple')) {
        resultsFound = travelData.temples || [];
    } 
    else if (keyword.includes('pays') || keyword.includes('countr')) {
        if (travelData.countries) {
            travelData.countries.forEach(country => {
                resultsFound = resultsFound.concat(country.cities);
            });
        }
    } 
    else {
        // Rechèch jeneral si moun nan tape non yon vil dirèk
        const allDestinations = [
            ...(travelData.beaches || []),
            ...(travelData.temples || []),
            ...(travelData.countries ? travelData.countries.reduce((acc, c) => acc.concat(c.cities), []) : [])
        ];
        
        resultsFound = allDestinations.filter(item => 
            item.name.toLowerCase().includes(keyword) || 
            item.description.toLowerCase().includes(keyword)
        );
    }

    // Afiche rezilta yo
    displayResults(resultsFound);
}

// 4. Fonksyon pou desine rezilta yo nan HTML lan avèk Grid (Tâche 8)
function displayResults(results) {
    const resultContainer = document.getElementById('result-container');

    if (results.length === 0) {
        resultContainer.innerHTML = '<p class="error-msg">Aucun résultat trouvé pour ce mot-clé.</p>';
        return;
    }

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

// 5. FONKSYON POU EFFACER / REINITIALISER (Tâche 9)
function clearResults() {
    const searchInput = document.getElementById('search-input');
    const resultContainer = document.getElementById('result-container');

    // 1. Vider jaden kote itilizatè a tape a
    if (searchInput) {
        searchInput.value = '';
    }

    // 2. Vider tout kat rezilta ki te afiche yo
    if (resultContainer) {
        resultContainer.innerHTML = '';
    }

    console.log("Rechèch la ak rezilta yo efase ak siksè.");
}

// 6. Koute evenman yo (EventListeners) lè paj la fin chaje
document.addEventListener("DOMContentLoaded", () => {
    // Chaje done yo otomatikman
    fetchRecommendations();

    const btnSearch = document.getElementById('btn-search');
    const btnClear = document.getElementById('btn-clear');
    const searchInput = document.getElementById('search-input');

    // Koute klik sou bouton Rechèch la
    if (btnSearch) {
        btnSearch.addEventListener('click', handleSearch);
    }

    // Sipòte bouton "Enter" nan klavye a pou rechèch la
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Koute klik sou bouton Réinitialiser / Effacer la (Tâche 9)
    if (btnClear) {
        btnClear.addEventListener('click', clearResults);
    }
});