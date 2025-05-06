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

document.addEventListener('DOMContentLoaded', () => {
    document.body.className = "bg-gray-100";

    const sortedFilms = [...filmy].sort((a, b) => b.ocena - a.ocena);

    createHeader();
    createMain(sortedFilms);
    createFooter();
});

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

    let film_catalog_section = document.createElement("section");
    film_catalog_section.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

    window.currentFilter = "Wszystkie";
    window.currentSort = "Oceny (najlepsze)";

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

    let sort_article = document.createElement("article");
    sort_article.className = "mb-2";

    filter_article = createFilterArticle(filter_article);
    sort_article = createSortArticle(sort_article);

    sort_section.appendChild(h2);
    sort_section.appendChild(filter_article);
    sort_section.appendChild(sort_article);

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
        });

        ul.appendChild(li);
    }

    sort_article.appendChild(h3);
    sort_article.appendChild(ul);
    return sort_article;
}

function createFilmCatalogSection(film_catalog_section, films) {
    let h2 = document.createElement("h2");
    h2.setAttribute("hidden", "");
    h2.innerText = "Katalog filmów";
    film_catalog_section.appendChild(h2);

    window.filmCatalogSection = film_catalog_section;
    window.allFilms = films;

    renderFilms(films, film_catalog_section);

    return film_catalog_section;
}

function renderFilms(films, container) {
    while (container.children.length > 1) {
        container.removeChild(container.lastChild);
    }

    for (let i = 0; i < films.length; i++) {
        let film_card = document.createElement("article");
        film_card.className = "mb-4";

        let film_image_container = document.createElement("div");
        film_image_container.className = "bg-white p-4 flex justify-center items-center";


        let img = document.createElement("img");
        img.setAttribute("src", "question.png");
        img.setAttribute("alt", "Obrazek " + films[i].tytul);
        img.className = "w-12 h-12 border border-gray-300";

        film_image_container.appendChild(img);
        film_card.appendChild(film_image_container);

        let film_title = document.createElement("h3");
        film_title.className = "bg-white p-2 border-b text-lg font-medium";
        film_title.innerText = films[i].tytul;
        film_card.appendChild(film_title);

        let ul_details = document.createElement("ul");
        ul_details.className = "bg-white p-4 rounded-b-lg shadow-md";


        let li_director = document.createElement("li");
        li_director.innerText = "Reżyser: " + films[i].rezyser;
        li_director.className = "mb-1 text-gray-700";
        ul_details.appendChild(li_director);

        let li_year = document.createElement("li");
        li_year.innerText = "Rok: " + films[i].rok;
        li_year.className = "mb-1 text-gray-700";
        ul_details.appendChild(li_year);

        let li_genre = document.createElement("li");
        li_genre.innerText = "Gatunek: " + films[i].gatunek;
        li_genre.className = "mb-1 text-gray-700";
        ul_details.appendChild(li_genre);

        let li_rating = document.createElement("li");
        li_rating.className = "mt-2 text-gray-700";

        let rating_label = document.createElement("div");
        rating_label.innerText = "Ocena: " + films[i].ocena;
        rating_label.className = "mb-1 text-gray-700";
        li_rating.appendChild(rating_label);

        let rating_bar_container = document.createElement("div");
        rating_bar_container.className = "w-full bg-gray-200 rounded-full h-2";

        let rating_bar = document.createElement("div");
        let width = (films[i].ocena / 10) * 100;
        rating_bar.className = "bg-green-500 h-2 rounded-full";
        rating_bar.style.width = width + "%";

        rating_bar_container.appendChild(rating_bar);
        li_rating.appendChild(rating_bar_container);

        ul_details.appendChild(li_rating);

        film_card.appendChild(ul_details);
        container.appendChild(film_card);
    }
}

function createFooter() {
    let footer = document.createElement("footer");
    footer.className = "text-center py-4 text-gray-600 text-sm mt-8";

    let p = document.createElement("p");
    p.innerText = "© 2025 Biblioteka Filmowa | Stworzone z użyciem JavaScript i Tailwind CSS";
    footer.appendChild(p);

    document.body.appendChild(footer);
}