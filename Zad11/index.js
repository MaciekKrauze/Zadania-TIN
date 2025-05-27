const filmy = [];
let selectedFilm = 0;
let visibleFilms = [];
let filmsPerRow = 3;
let currentPage = 1;
let filmsPerPage = 6;


async function loadFilms() {
    try {
        const response = await fetch('https://api.tvmaze.com/shows?page=0');
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const shows = await response.json();

        return shows.map(show => ({
            tytul: show.name || 'Nieznany tytuł',
            rezyser: show.network?.name || 'Nieznana sieć',
            rok: show.premiered ? new Date(show.premiered).getFullYear() : 0,
            gatunek: show.genres?.length ? show.genres[0] : 'Nieznany',
            gatunki: show.genres || [],
            ocena: show.rating?.average || 0,
            obrazek: show.image?.medium || 'question.png',
            opis: show.summary ? show.summary.replace(/<[^>]*>/g, '') : 'Brak opisu'
        }));
    } catch (err) {
        console.error('Błąd ładowania:', err);
        return [];
    }
}

function updateFilmsPerRow() {
    const w = window.innerWidth;
    if (w < 768) {
        filmsPerRow = 1;
        filmsPerPage = 5;
    } else if (w < 1024) {
        filmsPerRow = 2;
        filmsPerPage = 6;
    } else {
        filmsPerRow = 3;
        filmsPerPage = 6;
    }
}

function setupKeyboardNavigation() {
    document.removeEventListener('keydown', handleKeyNavigation);
    document.addEventListener('keydown', handleKeyNavigation);
}

function handleKeyNavigation(e) {
    if (!visibleFilms.length) return;
    const prev = selectedFilm;
    const currentPageFilms = getCurrentPageFilms();
    switch (e.key) {
        case 'ArrowUp': if (selectedFilm >= filmsPerRow) selectedFilm -= filmsPerRow; break;
        case 'ArrowDown': if (selectedFilm + filmsPerRow < currentPageFilms.length) selectedFilm += filmsPerRow; break;
        case 'ArrowLeft': if (selectedFilm > 0) selectedFilm--; break;
        case 'ArrowRight': if (selectedFilm < currentPageFilms.length - 1) selectedFilm++; break;
        case 'Enter': {
            const f = currentPageFilms[selectedFilm];
            if (f) alert(`Szczegóły serialu "${f.tytul}"\nSieć: ${f.rezyser}\nRok: ${f.rok}\nGatunek: ${f.gatunek}\nOcena: ${f.ocena || 'Brak oceny'}`);
            break;
        }
        default: return;
    }
    if (prev !== selectedFilm) {
        renderFilms(currentPageFilms);
        const cards = document.querySelectorAll('#film-catalog-section > article');
        cards[selectedFilm]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function filterBySearch(arr) {
    if (!window.searchText) return arr;
    return arr.filter(f => f.tytul.toLowerCase().includes(window.searchText)
        || f.rezyser.toLowerCase().includes(window.searchText));
}

function filterByCategory(arr) {
    if (window.currentFilter === 'Wszystkie') return arr;

    if (window.currentFilter === 'Ulubione') {
        const favoriteFilms = JSON.parse(localStorage.getItem('favoriteFilms') || '[]');
        return arr.filter(f => favoriteFilms.some(fav => fav.tytul === f.tytul));
    }

    return arr.filter(f => f.gatunki.includes(window.currentFilter));
}

function sortFilms(arr) {
    if (window.currentSort === 'Oceny (najlepsze)') return [...arr].sort((a,b)=>b.ocena - a.ocena);
    if (window.currentSort === 'Roku (najnowsze)') return [...arr].sort((a,b)=>b.rok - a.rok);
    return arr;
}

function updateButtonStyles() {
    const categoryButtons = document.querySelectorAll('#filter-controls li');
    categoryButtons.forEach(btn => {
        if (btn.innerText === window.currentFilter) {
            if (btn.innerText === 'Ulubione') {
                btn.className = 'bg-red-500 text-white px-4 py-1 rounded cursor-pointer';
            } else {
                btn.className = 'bg-blue-500 text-white px-4 py-1 rounded cursor-pointer';
            }
        } else {
            if (btn.innerText === 'Ulubione') {
                btn.className = 'bg-red-400 text-white px-4 py-1 rounded cursor-pointer hover:bg-red-500';
            } else {
                btn.className = 'bg-gray-200 text-gray-800 px-4 py-1 rounded cursor-pointer hover:bg-gray-300';
            }
        }
    });

    const sortButtons = document.querySelectorAll('#sort-controls li');
    sortButtons.forEach(btn => {
        if (btn.innerText === window.currentSort) {
            btn.className = 'bg-blue-500 text-white px-4 py-1 rounded cursor-pointer';
        } else {
            btn.className = 'bg-gray-200 text-gray-800 px-4 py-1 rounded cursor-pointer hover:bg-gray-300';
        }
    });
}

function getCurrentPageFilms() {
    const startIndex = (currentPage - 1) * filmsPerPage;
    const endIndex = startIndex + filmsPerPage;
    return visibleFilms.slice(startIndex, endIndex);
}

function getTotalPages() {
    return Math.ceil(visibleFilms.length / filmsPerPage);
}

function createPaginationControls() {
    const paginationContainer = document.getElementById('pagination-controls');
    if (paginationContainer) {
        paginationContainer.remove();
    }

    const totalPages = getTotalPages();
    if (totalPages <= 1) return;

    const pagination = document.createElement('div');
    pagination.id = 'pagination-controls';
    pagination.className = 'flex justify-center items-center gap-2 mt-6 mb-4';

    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '← Poprzednia';
    prevBtn.className = currentPage === 1 ?
        'px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed' :
        'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            selectedFilm = 0;
            renderFilms(getCurrentPageFilms());
            createPaginationControls();
        }
    });

    const pageInfo = document.createElement('span');
    pageInfo.className = 'px-4 py-2 text-gray-700';
    pageInfo.innerHTML = `Strona ${currentPage} z ${totalPages}`;

    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = 'Następna →';
    nextBtn.className = currentPage === totalPages ?
        'px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed' :
        'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            selectedFilm = 0;
            renderFilms(getCurrentPageFilms());
            createPaginationControls();
        }
    });

    pagination.append(prevBtn, pageInfo, nextBtn);

    const catalogSection = document.getElementById('film-catalog-section');
    catalogSection.parentNode.insertBefore(pagination, catalogSection.nextSibling);
}

function dynamicSort(fullList) {
    let result = filterBySearch(fullList);
    result = filterByCategory(result);
    result = sortFilms(result);
    visibleFilms = result;
    currentPage = 1;
    selectedFilm = 0;
    renderFilms(getCurrentPageFilms());
    createPaginationControls();
    updateButtonStyles();
}

function createHeader() {
    const header = document.createElement('header');
    header.className = 'bg-blue-600 text-white py-4 mb-4';
    const h1 = document.createElement('h1');
    h1.innerText = 'Biblioteka Seriali';
    h1.className = 'text-center text-2xl font-bold';
    header.appendChild(h1);
    document.body.appendChild(header);
}

function createMain(list) {
    const main = document.createElement('main');
    main.className = 'container mx-auto px-4';
    const sortSec = document.createElement('section');
    sortSec.id = 'sort-section';
    sortSec.className = 'bg-white p-4 rounded-lg shadow-md mb-4';
    const catSec = document.createElement('section');
    catSec.id = 'film-catalog-section';
    catSec.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
    sortSec.append(createFilterControls(list), createSortControls(list), createSearchControls(list));
    main.append(sortSec, catSec);
    document.body.appendChild(main);
}

function createFilterControls(fullList) {
    const art = document.createElement('article');
    art.className = 'mb-4';
    art.id = 'filter-controls';

    const h3 = document.createElement('h3');
    h3.innerText = 'Filtruj według gatunku:';
    h3.className = 'font-medium text-gray-800 mb-2';

    const ul = document.createElement('ul');
    ul.className = 'flex flex-wrap gap-2';

    const favoritesLi = document.createElement('li');
    favoritesLi.innerText = 'Ulubione';
    favoritesLi.className = window.currentFilter === 'Ulubione' ?
        'bg-red-500 text-white px-4 py-1 rounded cursor-pointer' :
        'bg-red-400 text-white px-4 py-1 rounded cursor-pointer hover:bg-red-500';

    favoritesLi.addEventListener('click', () => {
        window.currentFilter = 'Ulubione';
        dynamicSort(fullList);
    });
    ul.appendChild(favoritesLi);

    const genres = ['Wszystkie', ...new Set(fullList.flatMap(f=>f.gatunki))];
    genres.forEach(g => {
        const li = document.createElement('li');
        li.innerText = g;
        li.className = g === window.currentFilter ?
            'bg-blue-500 text-white px-4 py-1 rounded cursor-pointer' :
            'bg-gray-200 text-gray-800 px-4 py-1 rounded cursor-pointer hover:bg-gray-300';

        li.addEventListener('click', () => {
            window.currentFilter = g;
            dynamicSort(fullList);
        });
        ul.appendChild(li);
    });

    art.append(h3, ul);
    return art;
}

function createSortControls(fullList) {
    const art = document.createElement('article');
    art.className = 'mb-2';
    art.id = 'sort-controls';

    const h3 = document.createElement('h3');
    h3.innerText = 'Sortuj według:';
    h3.className = 'font-medium text-gray-800 mb-2';

    const ul = document.createElement('ul');
    ul.className = 'flex flex-wrap gap-2';

    ['Oceny (najlepsze)', 'Roku (najnowsze)'].forEach(cat => {
        const li = document.createElement('li');
        li.innerText = cat;
        li.className = cat === window.currentSort ?
            'bg-blue-500 text-white px-4 py-1 rounded cursor-pointer' :
            'bg-gray-200 text-gray-800 px-4 py-1 rounded cursor-pointer hover:bg-gray-300';

        li.addEventListener('click', () => {
            window.currentSort = cat;
            dynamicSort(fullList);
        });
        ul.appendChild(li);
    });
    art.append(h3, ul);
    return art;
}

function createSearchControls(fullList) {
    const art = document.createElement('article'); art.className='mb-4';
    const h3 = document.createElement('h3'); h3.innerText='Wyszukaj serial:'; h3.className='font-medium text-gray-800 mb-2';
    const input=document.createElement('input');
    input.type='text'; input.id='search_text'; input.placeholder='wpisz nazwę serialu'; input.ariaLabel='Wpisz tytuł lub sieć';
    input.className='bg-gray-200 text-gray-800 px-4 py-1 rounded';
    input.addEventListener('input', e=>{ window.searchText=e.target.value.toLowerCase(); dynamicSort(fullList); });
    art.append(h3, input);
    return art;
}

function renderFilms(list) {
    const container = document.getElementById('film-catalog-section');
    container.innerHTML = '<h2 hidden>Katalog seriali</h2>';
    if (!list.length) {
        container.innerHTML += '<p class="col-span-3 text-center p-4 text-gray-600">Nie znaleziono seriali spełniających kryteria.</p>';
        return;
    }
    list.forEach((item,i)=>{
        const card = document.createElement('article'); card.dataset.index=i;
        card.className = `mb-4 bg-white rounded-lg shadow-md transition-all duration-200${i===selectedFilm?' border-2 border-blue-500 ring-2 ring-blue-300':''}`;
        card.innerHTML = `
      <div class="flex justify-between">
        <h3 class="bg-white p-2 border-b text-lg font-medium rounded-t-lg">${item.tytul}</h3>
        <p><i class="fas fa-heart"></i></p>
      </div>
      
      <div class="bg-white p-4 flex justify-center items-center">
        <img src="${item.obrazek}" alt="Plakat ${item.tytul}" class="w-32 h-48 object-cover border border-gray-300" onerror="this.src='https://via.placeholder.com/210x295?text=Brak+obrazu';" />
      </div>
      <ul class="bg-white p-4 rounded-b-lg">
        <li class="mb-1 text-gray-700">Sieć: ${item.rezyser}</li>
        <li class="mb-1 text-gray-700">Rok: ${item.rok}</li>
        <li class="mb-1 text-gray-700">Gatunek: ${item.gatunek}</li>
        <li class="mt-2 text-gray-700">
          <div class="mb-1 text-gray-700">Ocena: ${item.ocena||'Brak'}</div>
          ${item.ocena>0?`<div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-green-500 h-2 rounded-full" style="width:${(item.ocena/10)*100}%"></div></div>`:''}
        </li>
      </ul>`;
        card.addEventListener('click',()=>{ selectedFilm=i; renderFilms(list); });

        const heartIcon = card.querySelector('.fa-heart');
        heartIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            let updatedFavorites = JSON.parse(localStorage.getItem('favoriteFilms') || '[]');
            const alreadyFavorite = updatedFavorites.some(f => f.tytul === item.tytul);

            if (alreadyFavorite) {
                updatedFavorites = updatedFavorites.filter(f => f.tytul !== item.tytul);
                heartIcon.classList.remove('text-red-500');
            } else {
                updatedFavorites.push(item);
                heartIcon.classList.add('text-red-500');
            }

            localStorage.setItem('favoriteFilms', JSON.stringify(updatedFavorites));
        });

        container.appendChild(card);
    });
}

function createFooter() {
    const f=document.createElement('footer'); f.className='text-center py-4 text-gray-600 text-sm mt-8';
    f.innerHTML=`<p>© 2025 Biblioteka Seriali | Dane z TVMaze API</p><p class="mt-2 text-xs">Użyj strzałek (←↑→↓) do nawigacji i Enter, aby zobaczyć szczegóły serialu</p>`;
    document.body.appendChild(f);
}

window.addEventListener('DOMContentLoaded', async () => {
    updateFilmsPerRow(); window.addEventListener('resize', updateFilmsPerRow);
    setupKeyboardNavigation();
    const data = await loadFilms();
    document.getElementById('loading')?.remove();
    if (!data.length) return document.body.innerHTML = '<div class="text-center mt-10"><h2>Błąd ładowania danych z API</h2></div>';
    window.currentFilter = 'Wszystkie'; window.currentSort = 'Oceny (najlepsze)'; window.searchText = '';
    createHeader(); createMain(data); createFooter();
    visibleFilms = [...data].sort((a,b) => b.ocena - a.ocena);
    renderFilms(getCurrentPageFilms());
    createPaginationControls();
});