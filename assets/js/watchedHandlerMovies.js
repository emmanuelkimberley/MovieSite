// Get all watched movies
let watchedMovies = localStorage.getItem('MO-watched');

const addItemToLocalStorage = (itemToAdd) => {
        // Append a new item to the string
        let updateLocalStorage = watchedMovies ? watchedMovies + `,${itemToAdd}` : `${itemToAdd}`;

        // Save back to localStorage
        localStorage.setItem('MO-watched', updateLocalStorage);
}

// Get tmdbID from URL
let tmdbID = window.location.href.split('/movie/')[1].split('/')[0]

if (watchedMovies) {
    // Split of the watched episode string
    let watchedMoviesSplit = watchedMovies.split(',')

    // Check if current Episode is in localstorage as watched
    let isPresent = watchedMoviesSplit.some((el) => el === tmdbID);

    // if it is not, add it to watched after 10min 
    if (!isPresent) {

        try {
            // get movie runtime
            let runtime = parseInt(document.querySelector('#runtime').innerHTML)

            // if 70% of the movie is watched, add it to the watched movies
            let totalTimeout = runtime * 600 * 70

            setTimeout(function () {
                addItemToLocalStorage(tmdbID)
            }, totalTimeout);

        } catch (err) {
            console.log(err.message);
        }

    } else {
        console.log('Movie Already watched');
    }
} else {
    try {
        // get movie runtime
        let runtime = parseInt(document.querySelector('#runtime').innerHTML)

        // if 70% of the movie is watched, add it to the watched movies
        let totalTimeout = runtime * 600 * 70

        setTimeout(function () {
            addItemToLocalStorage(tmdbID)
        }, totalTimeout);

    } catch (err) {
        console.log(err.message);
    }
}