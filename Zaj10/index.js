const filmy = [
    {
        tytul: "Skazani na Shawshank",
        rezyser: "Frank Darabont",
        rok: 1994,
        gatunek: "Dramat",
        ocena: 9.3
    },
    {
        tytul: "Pulp Fiction",
        rezyser: "Quentin Tarantino",
        rok: 1994,
        gatunek: "Kryminał",
        ocena: 8.9
    },
    {
        tytul: "Władca Pierścieni: Powrót Króla",
        rezyser: "Peter Jackson",
        rok: 2003,
        gatunek: "Fantasy",
        ocena: 8.9
    },
    {
        tytul: "Incepcja",
        rezyser: "Christopher Nolan",
        rok: 2010,
        gatunek: "Sci-Fi",
        ocena: 8.8
    },
    {
        tytul: "Zielona Mila",
        rezyser: "Frank Darabont",
        rok: 1999,
        gatunek: "Dramat",
        ocena: 8.6
    }
];

let selected_film = 0;
let visible_films = [];
let filmsPerRow = 3; // Domyślna wartość dla układu siatki

document.addEventListener('DOMContentLoaded', () => {
    document.body.className = "bg-gray-100";

    const sortedFilms = [...filmy].sort((a, b) => b.ocena - a.ocena);

    window.currentFilter = "Wszystkie";
    window.currentSort = "Oceny (najlepsze)";
    window.searchText = "";

    createHeader();
    createMain(sortedFilms);
    createFooter();

    setupKeyboardNavigation();

    updateFilmsPerRow();
    window.addEventListener('resize', updateFilmsPerRow);
});

function updateFilmsPerRow() {
    if (window.innerWidth < 768) {
        filmsPerRow = 1;
    } else if (window.innerWidth < 1024) {
        filmsPerRow = 2;
    } else {
        filmsPerRow = 3;
    }
}

function setupKeyboardNavigation() {
    document.removeEventListener("keydown", handleKeyNavigation);
    document.addEventListener("keydown", handleKeyNavigation);
}

function handleKeyNavigation(e) {
    if (visible_films.length === 0) return;

    const previousSelectedFilm = selected_film;

    switch (e.key) {
        case "ArrowUp":
            if (selected_film >= filmsPerRow) {
                selected_film -= filmsPerRow;
            }
            break;
        case "ArrowDown":
            if (selected_film + filmsPerRow < visible_films.length) {
                selected_film += filmsPerRow;
            }
            break;
        case "ArrowLeft":
            if (selected_film > 0) {
                selected_film--;
            }
            break;
        case "ArrowRight":
            if (selected_film < visible_films.length - 1) {
                selected_film++;
            }
            break;
        case "Enter":
            if (visible_films[selected_film]) {
                const film = visible_films[selected_film];
                const message = `Szczegóły filmu "${film.tytul}"\n\nReżyser: ${film.rezyser}\nRok: ${film.rok}\nGatunek: ${film.gatunek}\nOcena: ${film.ocena}`;
                alert(message);
            }
            break;
        default:
            console.log("Inny przycisk");
            return;
    }

    if (previousSelectedFilm !== selected_film) {
        renderFilms(visible_films, window.filmCatalogSection);

        const filmCards = document.querySelectorAll('#film-catalog-section > article');
        if (filmCards[selected_film]) {
            filmCards[selected_film].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }
}

function dynamicSort(films){
    let films_after_search = filterBySearch(films);
    let films_after_filter = filterByCategory(films_after_search);
    let films_after_sort = sortFilms(films_after_filter);

    visible_films = films_after_sort;

    if (selected_film >= visible_films.length && visible_films.length > 0) {
        selected_film = 0;
    }

    renderFilms(films_after_sort, window.filmCatalogSection);
}

function filterBySearch(films){
    let filteredFilms = [];

    if (!window.searchText || window.searchText === "") {
        return films;
    }

    for (let i = 0; i < films.length; i++) {
        if (films[i].tytul.toLowerCase().includes(window.searchText.toLowerCase())
            || films[i].rezyser.toLowerCase().includes(window.searchText.toLowerCase())) {
            filteredFilms.push(films[i]);
        }
    }

    return filteredFilms;
}

function filterByCategory(films){
    if (window.currentFilter === "Wszystkie") {
        return films;
    }

    let filteredFilms = [];
    for (let i = 0; i < films.length; i++) {
        if (films[i].gatunek === window.currentFilter) {
            filteredFilms.push(films[i]);
        }
    }
    return filteredFilms;
}

function sortFilms(films){
    let sortedFilms = [];

    if (window.currentSort === "Oceny (najlepsze)") {
        sortedFilms = [...films].sort((a, b) => b.ocena - a.ocena);
    }
    else if (window.currentSort === "Roku (najnowsze)") {
        sortedFilms = [...films].sort((a, b) => b.rok - a.rok);
    }

    return sortedFilms;
}

function createHeader() {
    let header = document.createElement("header");
    header.className = "bg-blue-600 text-white py-4 mb-4";

    let h1 = document.createElement("h1");
    h1.innerText = "Biblioteka Filmowa";
    h1.className = "text-center text-2xl font-bold";
    header.appendChild(h1);

    document.body.appendChild(header);
}

function createMain(films) {
    let main = document.createElement("main");
    main.className = "container mx-auto px-4";

    let sort_section = document.createElement("section");
    sort_section.className = "bg-white p-4 rounded-lg shadow-md mb-4";
    sort_section.setAttribute("id", "sort-section");

    let film_catalog_section = document.createElement("section");
    film_catalog_section.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
    film_catalog_section.setAttribute("id", "film-catalog-section");

    sort_section = createSortSection(sort_section);
    film_catalog_section = createFilmCatalogSection(film_catalog_section, films);

    main.appendChild(sort_section);
    main.appendChild(film_catalog_section);
    document.body.appendChild(main);
}

function createSortSection(sort_section) {
    let h2 = document.createElement("h2");
    h2.setAttribute("hidden", "");
    h2.innerText = "Sekcja filtracji";

    let filter_article = document.createElement("article");
    filter_article.className = "mb-4";
    filter_article.setAttribute("id", "filter-article");

    let sort_article = document.createElement("article");
    sort_article.className = "mb-2";
    sort_article.setAttribute("id", "sort-article");

    let search_article = document.createElement("article");
    search_article.className = "mb-4";
    search_article.setAttribute("id", "search-article");

    filter_article = createFilterArticle(filter_article);
    sort_article = createSortArticle(sort_article);
    search_article = createSearchArticle(search_article);

    sort_section.appendChild(h2);
    sort_section.appendChild(filter_article);
    sort_section.appendChild(sort_article);
    sort_section.appendChild(search_article);

    return sort_section;
}

function createFilterArticle(filter_article) {
    let h3 = document.createElement("h3");
    h3.innerText = "Filtruj według gatunku:";
    h3.className = "font-medium text-gray-800 mb-2";

    let ul = document.createElement("ul");
    ul.className = "flex flex-wrap gap-2";

    const categories = ["Wszystkie", "Sci-Fi", "Kryminał", "Dramat", "Fantasy"];

    for (let i = 0; i < categories.length; i++) {
        let li = document.createElement("li");

        if (categories[i] === window.currentFilter) {
            li.className = "bg-blue-500 text-white px-4 py-1 rounded cursor-pointer";
        } else {
            li.className = "bg-gray-200 text-gray-800 px-4 py-1 rounded cursor-pointer hover:bg-gray-300";
        }

        li.innerText = categories[i];

        li.addEventListener('click', function() {
            window.currentFilter = categories[i];

            const filterButtons = this.parentNode.querySelectorAll('li');
            filterButtons.forEach(button => {
                if (button === this) {
                    button.className = "bg-blue-500 text-white px-4 py-1 rounded cursor-pointer";
                } else {
                    button.className = "bg-gray-200 text-gray-800 px-4 py-1 rounded cursor-pointer hover:bg-gray-300";
                }
            });

            dynamicSort(filmy);
        });

        ul.appendChild(li);
    }

    filter_article.appendChild(h3);
    filter_article.appendChild(ul);
    return filter_article;
}

function createSortArticle(sort_article) {
    let h3 = document.createElement("h3");
    h3.innerText = "Sortuj według:";
    h3.className = "font-medium text-gray-800 mb-2";

    const categories = ["Oceny (najlepsze)", "Roku (najnowsze)"];
    const ul = document.createElement("ul");
    ul.className = "flex flex-wrap gap-2";

    for (let i = 0; i < categories.length; i++) {
        let li = document.createElement("li");

        if (categories[i] === window.currentSort) {
            li.className = "bg-blue-500 text-white px-4 py-1 rounded cursor-pointer";
        } else {
            li.className = "bg-gray-200 text-gray-800 px-4 py-1 rounded cursor-pointer hover:bg-gray-300";
        }

        li.innerText = categories[i];

        li.addEventListener('click', function() {
            window.currentSort = categories[i];

            const sortButtons = this.parentNode.querySelectorAll('li');
            sortButtons.forEach(button => {
                if (button === this) {
                    button.className = "bg-blue-500 text-white px-4 py-1 rounded cursor-pointer";
                } else {
                    button.className = "bg-gray-200 text-gray-800 px-4 py-1 rounded cursor-pointer hover:bg-gray-300";
                }
            });

            dynamicSort(filmy);
        });

        ul.appendChild(li);
    }

    sort_article.appendChild(h3);
    sort_article.appendChild(ul);
    return sort_article;
}

function createSearchArticle(search_article) {
    let h3 = document.createElement("h3");
    h3.innerText = "Wyszukaj film:";
    h3.className = "font-medium text-gray-800 mb-2";

    let input = document.createElement("input");
    input.className = "bg-gray-200 text-gray-800 px-4 py-1 rounded";
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "wpisz nazwę filmu");
    input.setAttribute("aria-label", "Wpisz tytuł lub nazwisko reżysera");
    input.setAttribute("id", "search_text");

    input.addEventListener("input", function(e) {
        window.searchText = e.target.value;
        dynamicSort(filmy);
    });

    search_article.appendChild(h3);
    search_article.appendChild(input);
    return search_article;
}

function createFilmCatalogSection(film_catalog_section, films) {
    let h2 = document.createElement("h2");
    h2.setAttribute("hidden", "");
    h2.innerText = "Katalog filmów";
    film_catalog_section.appendChild(h2);

    window.filmCatalogSection = film_catalog_section;
    window.allFilms = films;
    visible_films = films;

    renderFilms(films, film_catalog_section);

    return film_catalog_section;
}

function renderFilms(films, container) {
    while (container.children.length > 1) {
        container.removeChild(container.lastChild);
    }

    if (films.length === 0) {
        let noFilmsMessage = document.createElement("p");
        noFilmsMessage.innerText = "Nie znaleziono filmów spełniających kryteria wyszukiwania.";
        noFilmsMessage.className = "col-span-3 text-center p-4 text-gray-600";
        container.appendChild(noFilmsMessage);
        return;
    }

    for (let i = 0; i < films.length; i++) {
        const item = films[i];
        let film_card = document.createElement("article");
        film_card.className = "mb-4 bg-white rounded-lg shadow-md transition-all duration-200";
        film_card.setAttribute("data-index", i);

        if (i === selected_film) {
            film_card.className += " border-2 border-blue-500 ring-2 ring-blue-300";
        }

        let film_title = document.createElement("h3");
        film_title.className = "bg-white p-2 border-b text-lg font-medium rounded-t-lg";
        film_title.innerText = item.tytul;
        film_card.appendChild(film_title);

        let film_image_container = document.createElement("div");
        film_image_container.className = "bg-white p-4 flex justify-center items-center";

        let img = document.createElement("img");
        img.setAttribute("src", "question.png");
        img.setAttribute("alt", "Obrazek " + item.tytul);
        img.className = "w-12 h-12 border border-gray-300";

        film_image_container.appendChild(img);
        film_card.appendChild(film_image_container);

        let ul_details = document.createElement("ul");
        ul_details.className = "bg-white p-4 rounded-b-lg";

        let li_director = document.createElement("li");
        li_director.innerText = "Reżyser: " + item.rezyser;
        li_director.className = "mb-1 text-gray-700";
        ul_details.appendChild(li_director);

        let li_year = document.createElement("li");
        li_year.innerText = "Rok: " + item.rok;
        li_year.className = "mb-1 text-gray-700";
        ul_details.appendChild(li_year);

        let li_genre = document.createElement("li");
        li_genre.innerText = "Gatunek: " + item.gatunek;
        li_genre.className = "mb-1 text-gray-700";
        ul_details.appendChild(li_genre);

        let li_rating = document.createElement("li");
        li_rating.className = "mt-2 text-gray-700";

        let rating_label = document.createElement("div");
        rating_label.innerText = "Ocena: " + item.ocena;
        rating_label.className = "mb-1 text-gray-700";
        li_rating.appendChild(rating_label);

        let rating_bar_container = document.createElement("div");
        rating_bar_container.className = "w-full bg-gray-200 rounded-full h-2";

        let rating_bar = document.createElement("div");
        let width = (item.ocena / 10) * 100;
        rating_bar.className = "bg-green-500 h-2 rounded-full";
        rating_bar.style.width = width + "%";

        rating_bar_container.appendChild(rating_bar);
        li_rating.appendChild(rating_bar_container);

        ul_details.appendChild(li_rating);

        film_card.appendChild(ul_details);

        film_card.addEventListener('click', function() {
            selected_film = parseInt(this.getAttribute('data-index'));
            renderFilms(films, container);
        });

        container.appendChild(film_card);
    }
}

function createFooter() {
    let footer = document.createElement("footer");
    footer.className = "text-center py-4 text-gray-600 text-sm mt-8";

    let p = document.createElement("p");
    p.innerText = "© 2025 Biblioteka Filmowa | Stworzone z użyciem JavaScript i Tailwind CSS";

    let keyboard_info = document.createElement("p");
    keyboard_info.className = "mt-2 text-xs";
    keyboard_info.innerText = "Użyj strzałek (←↑→↓) do nawigacji i Enter, aby zobaczyć szczegóły filmu";

    footer.appendChild(p);
    footer.appendChild(keyboard_info);

    document.body.appendChild(footer);
}