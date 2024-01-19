const BestMovie = "http://127.0.0.1:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=";
const BestFamilyMovie = "http://127.0.0.1:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Family&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=";
const BestSciFiMovie = "http://127.0.0.1:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Sci-Fi&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=";
const BestThrillerMovie = "http://127.0.0.1:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Thriller&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=";

// Récupérer les données de l'API
async function get(url) {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (err) {
        console.error("Erreur lors de la requête :", err);
        throw err;
    }
}
// Récupérer les détails d'un film
async function getMovieDetails(id) {
    try {
        const movieDetailsUrl = `http://127.0.0.1:8000/api/v1/titles/${id}`;
        const movieDetails = await get(movieDetailsUrl);
        return movieDetails;
    } catch (error) {
        console.error(`Erreur lors de la récupération des détails du film avec ID ${id}:`, error);
        throw error;
    }
}
// Créer les éléments HTML pour chaque film
function createMovieElement(movieDetails) {
    const movieItem = document.createElement('div');
    movieItem.classList.add('bestMovieItem');

    const imgDiv = document.createElement('img');
    imgDiv.classList.add('bestMovieImg');
    imgDiv.src = movieDetails.image_url;
    imgDiv.alt = movieDetails.title;

    imgDiv.addEventListener('click', function () {
        renderModal(movieDetails.id, movieDetails.title, movieDetails.image_url, movieDetails.genres, movieDetails.year,
            movieDetails.rated, movieDetails.imdb_score, movieDetails.directors, movieDetails.actors, movieDetails.duration,
            movieDetails.countries, movieDetails.worldwide_gross_income, movieDetails.description);
    });

    movieItem.appendChild(imgDiv);
    return movieItem;
}
async function getBestMoviesWithCarousel(url, containerId) {
    try {
        const movies = await get(url);
        const bestMovies = movies.results.slice(0, 7);
        const container = document.getElementById(containerId);

        // Créer un conteneur pour le carousel
        const carouselContainer = document.createElement('div');
        carouselContainer.classList.add('carousel-container');

        // Cloner les éléments pour créer l'effet de boucle
        const clonedMovies = bestMovies.map(movie => ({ ...movie }));
        for (const movie of clonedMovies) {
            const movieDetails = await getMovieDetails(movie.id);
            const movieElement = createMovieElement(movieDetails);
            carouselContainer.appendChild(movieElement);
        }
        // Ajouter le bouton précédent
        const prevButton = document.createElement('div');
        prevButton.classList.add('carousel-button', 'left');
        const prevArrow = document.createElement('img');
        prevArrow.src = '/img/left-arrow.svg';
        prevArrow.alt = 'Previous';
        prevButton.appendChild(prevArrow);
        prevButton.addEventListener('click', () => {
            scrollCarousel(carouselContainer, -1);
        });
        container.appendChild(prevButton);


        container.appendChild(carouselContainer);
        // Ajouter les images au carousel
        for (const movie of bestMovies) {
            const movieDetails = await getMovieDetails(movie.id);
            const movieElement = createMovieElement(movieDetails);
            carouselContainer.appendChild(movieElement);
        }
        // Ajouter les images de la page suivante si elle existe
        if (movies.next) {
            const moviesPage2 = await get(movies.next);
            const additionalMovies = moviesPage2.results.slice(0, 7 - bestMovies.length);
            for (const movie of additionalMovies) {
                const movieDetails = await getMovieDetails(movie.id);
                const movieElement = createMovieElement(movieDetails);
                carouselContainer.appendChild(movieElement);
            }
        }

        container.appendChild(carouselContainer);

        // Ajouter le bouton suivant
        const nextButton = document.createElement('div');
        nextButton.classList.add('carousel-button', 'right');
        const nextArrow = document.createElement('img');
        nextArrow.src = '/img/right-arrow.svg';
        nextArrow.alt = 'Next';
        nextButton.appendChild(nextArrow);
        nextButton.addEventListener('click', () => {
            scrollCarousel(carouselContainer, 1);
        });

        container.appendChild(nextButton);

        return bestMovies;
    } catch (error) {
        console.error("Erreur :", error);
    }
}
function scrollCarousel(carouselContainer, direction) {
    const items = carouselContainer.querySelectorAll('.bestMovieItem');
    const itemWidth = items.length > 0 ? items[0].clientWidth : 0;
    const totalWidth = itemWidth * items.length;

    let newScrollLeft = carouselContainer.scrollLeft + direction * itemWidth;

    // Si le nouveau défilement dépasse la fin du carrousel, revenir au début
    if (newScrollLeft > totalWidth) {
        newScrollLeft = 0;
    }

    // Si le nouveau défilement est avant le début du carrousel, aller à la fin
    if (newScrollLeft < 0) {
        newScrollLeft = totalWidth;
    }

    // Appliquer le nouveau défilement
    carouselContainer.scrollLeft = newScrollLeft;
}

// Récupérer le meilleur film
async function getBestMovie() {
    try {
        const movies = await get(BestMovie);
        const bestMovie = movies.results[0];
        const bestMovieDetails = await getMovieDetails(bestMovie.id);

        const bestMovieTitleDiv = document.getElementById('bestMovieTitle');
        bestMovieTitleDiv.textContent = bestMovieDetails.title;

        const bestMovieImgDiv = document.getElementById('bestMovieImg');
        bestMovieImgDiv.src = bestMovieDetails.image_url.replaceAll('268', '1072').replace('182', '728');

        bestMovieImgDiv.addEventListener('click', function () {
            renderModal(bestMovieDetails.id, bestMovieDetails.title, bestMovieDetails.image_url, bestMovieDetails.genres, bestMovieDetails.year,
                bestMovieDetails.rated, bestMovieDetails.imdb_score, bestMovieDetails.directors, bestMovieDetails.actors, bestMovieDetails.duration,
                bestMovieDetails.countries, bestMovieDetails.worldwide_gross_income, bestMovieDetails.description);
        });

        return bestMovieDetails;
    } catch (error) {
        console.error("Erreur lors de la récupération du meilleur film :", error);
        throw error;
    }
}



// Créer le modal
function renderModal(movieId, movieTitle, movieImg, movieGenres, movieDate, movieRated, movieScore, movieDirector, movieActors, movieDuration, movieCountries, movieIncome, movieDescription) {
    const modal = document.getElementById('myModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalGenre = document.getElementById('modalGenre');
    const modalDate = document.getElementById('modalDate');
    const modalRated = document.getElementById('modalRated');
    const modalScore = document.getElementById('modalScore');
    const modalDirector = document.getElementById('modalDirector');
    const modalActors = document.getElementById('modalActors');
    const modalDuration = document.getElementById('modalDuration');
    const modalCountries = document.getElementById('modalCountries');
    const modalIncome = document.getElementById('modalIncome');
    const modalDescription = document.getElementById('modalDescription');


    // Mettez à jour le contenu du modal avec les informations spécifiques
    modal.style.display = 'block';
    modalImg.src = movieImg;
    modalImg.alt = movieTitle;
    modalTitle.textContent = movieTitle;
    if (movieGenres && movieGenres.length > 0) {
        modalGenre.textContent = "Genres: " + movieGenres.join(', ');
    } else {
        modalGenre.textContent = "Genres non spécifiés";
    }
    modalDate.textContent = "Date de sortie: " + movieDate;
    modalRated.textContent = "Classification: " + movieRated;
    modalScore.textContent = "Score IMDB: " + movieScore;
    modalDirector.textContent = "Réalisateur(s): " + movieDirector.join(', ');
    modalActors.textContent = "Acteur(s): " + movieActors.join(', ');
    modalDuration.textContent = "Durée: " + movieDuration + " minutes";
    modalCountries.textContent = "Pays: " + movieCountries.join(', ');
    modalIncome.textContent = movieIncome
        ? "Revenus: " + movieIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        : "Revenus non spécifiés";
    modalDescription.textContent = "Résumé: " + movieDescription;

}
// Fermer le modal
function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}


// Appel de la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await getBestMovie();
        await getBestMoviesWithCarousel(BestMovie, 'sevenBestMoviesContainer');
        await getBestMoviesWithCarousel(BestFamilyMovie, 'sevenBestFamilyMoviesContainer');
        await getBestMoviesWithCarousel(BestSciFiMovie, 'sevenBestSciFiMoviesContainer');
        await getBestMoviesWithCarousel(BestThrillerMovie, 'sevenBestThrillerMoviesContainer');
    } catch (error) {
        console.error("Erreur :", error);
    }
});

