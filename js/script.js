const BestMovie = "http://127.0.0.1:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=";



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
        renderModal(bestMovieId, bestMovie.title, bestMovie.image_url);
    });

    return bestMovie;
}

// Fonction générique pour récupérer les meilleurs films
async function getBestMovies(url) {
    const movies = await get(url);
    let movies2 = await get(url + '&page=2');
    movies.results = movies.results.concat(movies2.results);
    const bestMovies = movies.results.slice(0, 7);

    const containerId = url === BestMovie ? 'sevenBestMoviesContainer' : '';
    //url === BestMovie2 ? 'sevenBestMoviesContainer2' :
    //url === BestMovie3 ? 'sevenBestMoviesContainer3' :
    //url === BestMovie4 ? 'sevenBestMoviesContainer4' : '';

    const container = document.getElementById(containerId);

    bestMovies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('bestMovieItem');

        const imgDiv = document.createElement('img');
        imgDiv.classList.add('bestMovieImg');
        imgDiv.src = movie.image_url.replaceAll('268', '1072').replace('182', '728');
        imgDiv.alt = movie.title;
        imgDiv.addEventListener('click', function () {
            renderModal(movie.id, movie.title, movie.image_url);
        });
        movieItem.appendChild(imgDiv);
        container.appendChild(movieItem);
    });

    return bestMovies;
}

//creation d'un modal
function renderModal(movieId, movieTitle, movieImg) {
    const modal = document.getElementById('myModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');

    // Mettez à jour le contenu du modal avec les informations spécifiques
    modal.style.display = 'block';
    modalImg.src = movieImg;
    modalImg.alt = movieTitle;
    modalTitle.textContent = movieTitle;

    // Ajoutez d'autres actions ou données spécifiques au film si nécessaire
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
    } catch (error) {
        console.error("Erreur :", error);
    }
});
