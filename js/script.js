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

async function getBestMovie() {
    const movies = await get(BestMovie);
    const bestMovie = movies.results[0];
    const bestMovieId = bestMovie.id;

    const bestMovieTitleDiv = document.getElementById('bestMovieTitle');
    bestMovieTitleDiv.textContent = bestMovie.title;
    const bestMovieImgDiv = document.getElementById('bestMovieImg');
    bestMovieImgDiv.src = bestMovie.image_url.replaceAll('268', '1072').replace('182', '728');

    bestMovieImgDiv.addEventListener('click', function () {
        renderModal(bestMovieId, bestMovie.title, bestMovie.image_url, bestMovie.genres, bestMovie.year, bestMovie.rated);
    });

    return bestMovie;
}

// Fonction générique pour récupérer les meilleurs films
async function getBestMovies(url) {
    const movies = await get(url);
    let movies2 = await get(url + '&page=2');
    movies.results = movies.results.concat(movies2.results);
    const bestMovies = movies.results.slice(0, 7);

    const containerId = url === BestMovie
        ? 'sevenBestMoviesContainer'
        : url === BestFamilyMovie
            ? 'sevenBestFamilyMoviesContainer'
            : url === BestSciFiMovie
                ? 'sevenBestSciFiMoviesContainer'
                : url === BestThrillerMovie
                    ? 'sevenBestThrillerMoviesContainer'
                    : '';

    const container = document.getElementById(containerId);

    bestMovies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('bestMovieItem');

        const imgDiv = document.createElement('img');
        imgDiv.classList.add('bestMovieImg');
        imgDiv.src = movie.image_url;
        imgDiv.alt = movie.title;
        imgDiv.addEventListener('click', function () {
            renderModal(movie.id, movie.title, movie.image_url, movie.genres, movie.year, movie.rated);
        });
        movieItem.appendChild(imgDiv);
        container.appendChild(movieItem);

    });

    return bestMovies;
}

function renderModal(movieId, movieTitle, movieImg, movieGenres, movieDate, movieRated) {
    const modal = document.getElementById('myModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalGenre = document.getElementById('modalGenre');
    const modalDate = document.getElementById('modalDate');
    const modalRated = document.getElementById('modalRated');

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

}

function closeModal() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}


// Appel des fonctions au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const bestMovie = await getBestMovie();
        console.log("Meilleur film :", bestMovie);

        // Appeler la fonction pour récupérer les sept meilleurs films
        const sevenBestMovies = await getBestMovies(BestMovie);
        console.log("Sept meilleurs films :", sevenBestMovies);
        const sevenBestFamilyMovies = await getBestMovies(BestFamilyMovie);
        console.log("Sept meilleurs films de fantasy :", sevenBestFamilyMovies);
        const sevenBestSciFiMovies = await getBestMovies(BestSciFiMovie);
        console.log("Sept meilleurs films de science-fiction :", sevenBestSciFiMovies);
        const sevenBestThrillerMovies = await getBestMovies(BestThrillerMovie);
        console.log("Sept meilleurs films de thriller :", sevenBestThrillerMovies);
    } catch (error) {
        console.error("Erreur :", error);
    }
});
