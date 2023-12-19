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
    const bestMovieTitle = movies.results[0].title;
    const bestMovieImg = movies.results[0].image_url;

    // Sélectionnez la div par son identifiant et mettez à jour son contenu
    const bestMovieTitleDiv = document.getElementById('bestMovieTitle');
    bestMovieTitleDiv.textContent = bestMovieTitle;
    const bestMovieImgDiv = document.getElementById('bestMovieImg');
    bestMovieImgDiv.src = bestMovieImg;

    return movies.results[0];
}

// Appel de la fonction pour afficher le titre
getBestMovie();