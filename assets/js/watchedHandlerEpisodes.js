// Get all watched episodes and movies
let watchedEpisodes = localStorage.getItem('EP-watched');

const episodeTimer = (watchedEpisodes, itemToAdd) => {
    setTimeout(function () {
        // Append a new item to the string
        let updateLocalStorage = watchedEpisodes ? watchedEpisodes + `,${itemToAdd}` : `${itemToAdd}`;

        // Save back to localStorage
        localStorage.setItem('EP-watched', updateLocalStorage);
    }, 600000);
}

// Get TMDBID from URL
let urlSplit
let tmdbID
if (window.location.href.indexOf("/episode/") != -1) {

    urlSplit = window.location.href.split('/episode/')[1]
    tmdbID = urlSplit.split('/')[0]

    let linkSplit = urlSplit.split('/')[1].split('-')
    let seasonAndEpisode = linkSplit[linkSplit.length - 1].split('x')

    // Split the current URL to check if it is already in localstorage
    let seasonNum = seasonAndEpisode[0]
    let episodeNum = seasonAndEpisode[1]
    let itemToAdd = `E${tmdbID}-${seasonNum}-${episodeNum}`

    if (watchedEpisodes) {

        // All watched episodes from different shows are separated into TMDB-seasNum-EpNum blocks
        let watchedEpisodesSplit = watchedEpisodes.split(',')

        // Check if current Episode is in localstorage as watched
        let isPresent = watchedEpisodesSplit.some((el) => el === itemToAdd);

        // if it is not, add it to watched after 10min 
        if (!isPresent) {
            episodeTimer(watchedEpisodes, itemToAdd)
        } 
    } else {
        episodeTimer(false, itemToAdd)
    }

} else if (window.location.href.indexOf("/series/") != -1) {
    urlSplit = window.location.href.split('/series/')[1]
    tmdbID = urlSplit.split('/')[0]
}


//  EPISODE BUTTON HANDLER
if (watchedEpisodes) {

    // Loop trough all episodes stored in local storage 
    for (let watchedEp of watchedEpisodes.split(',')) {

        // Parse the episode from local storage
        let watchedTmdbID = watchedEp.split('E')[1].split('-')[0]
        let watchedSeasonNum = watchedEp.split('-')[1]
        let watchedEpisodeNum = watchedEp.split('-')[2]

        // Check if any items in local storage matches this series
        if (watchedTmdbID === tmdbID) {
            // Get the episode buttons and add the class 'watched' to add extra styles to watched episodes buttons
            let episodeButton = document.querySelector(`#E${watchedTmdbID}-${watchedSeasonNum}-${watchedEpisodeNum}`)
            episodeButton.classList += ' watched'
        }
        
    }
}