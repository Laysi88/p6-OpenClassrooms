const BestMovie = "http://127.0.0.1:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=";
const BestFamilyMovie = "http://127.0.0.1:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Family&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=";
const BestSciFiMovie = "http://127.0.0.1:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Sci-Fi&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=";
const BestThrillerMovie = "http://127.0.0.1:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=Thriller&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=";

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

async function getBestMovies(url, containerId) {
    const movies = await get(url);
    const bestMovies = movies.results.slice(0, 7);
    const container = document.getElementById(containerId);

    for (const movie of bestMovies) {
        const movieDetails = await getMovieDetails(movie.id);
        const movieElement = createMovieElement(movieDetails);
        container.appendChild(movieElement);
    }

    // Check if there are more movies on the next page
    if (movies.next) {
        const moviesPage2 = await get(movies.next);
        const additionalMovies = moviesPage2.results.slice(0, 7 - bestMovies.length);

        for (const movie of additionalMovies) {
            const movieDetails = await getMovieDetails(movie.id);
            const movieElement = createMovieElement(movieDetails);
            container.appendChild(movieElement);
        }
    }

    return bestMovies;
}

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

function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}


// Appel des fonctions au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await getBestMovie();
        await getBestMovies(BestMovie, 'sevenBestMoviesContainer');
        await getBestMovies(BestFamilyMovie, 'sevenBestFamilyMoviesContainer');
        await getBestMovies(BestSciFiMovie, 'sevenBestSciFiMoviesContainer');
        await getBestMovies(BestThrillerMovie, 'sevenBestThrillerMoviesContainer');
    } catch (error) {
        console.error("Erreur :", error);
    }
});