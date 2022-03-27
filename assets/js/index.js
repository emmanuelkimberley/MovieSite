const spinner = document.querySelector('.loader-container')
const cards = document.getElementsByClassName("all_card");
const userID = localStorage.getItem('MA-userID');
const checkPageType = (string) => (window.location.href.indexOf(`/${string}`) != -1)

const generateId = () => {
    let idLength = 20
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < idLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


// SITE WIDE EVENT LISTENERS
document.addEventListener('DOMContentLoaded', async () => {
    spinner.classList += ' hidden'

    // Get or create UserId
    if (!userID) {
        let newId = generateId()
        localStorage.setItem('MA-userID', newId);
    }

    //  TOOLTIP HANDLERS
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, { placement: 'bottom' })
    })

    // Force the reload on top of the page for random movies/series
    if (checkPageType('random-')) {
        history.scrollRestoration = 'manual';
    }

    // Add the "person" button filter on the search and bookmark page
    if (checkPageType('search/') || checkPageType('bookmarks')) {
        const personBTN = document.getElementById("radioPersonLabel");
        personBTN.classList = 'btn btn-secondary'
    }

    //  SEARCH HANDLERS:
    const search = document.querySelector('#search');

    // SEARCH: Timeout is used to count 800ms after the keyup, to limit the number of API requests to TMDB.
    let timeout = null;
    document.addEventListener('keyup', function (e) {
        if (e.target && e.target.id == 'search') {
            clearTimeout(timeout);
            const { value } = e.target;
            let searchQuery = value;
            timeout = setTimeout(function () {
                if (searchQuery.length >= 3) {
                    if (checkPageType('search/')) {
                        window.location.href = `/search/${searchQuery}`;
                    } else {
                        window.location.href = `/search/${searchQuery}`;
                    }
                }

                if (search.value === '') {
                    history.back();
                }
            }, 3000);
        }
    });

    // SEARCH: Listen to the enter key on the search field and send request if pressed
    document.addEventListener('keypress', function (e) {
        if (e.target && e.target.id == 'search') {
            if (e.key === 'Enter') {
                const { value } = e.target;
                let searchQuery = value;
                setTimeout(function () {
                    window.location.href = `/search/${searchQuery}`;
                }, 100);
            }
        }
    })

    // CHECK IF A MOVIE IS IN THE Bookmarks
    // check if movie / series is in local storage
    // check if card is in the watchList
    let isInWatchlist = (tmdbId) => {
        return Object.keys(localStorage).find((e) => e === `tmdb-${tmdbId}`)
    }

    // If the page Is bookarked, change the watchlist Icon
    let WLButtonHandler = (tmdbId) => {
        let tooltip = document.querySelector(`#watchlistButton${tmdbId}`)
        tooltip.title = "Remove from Bookmarks"
        tooltip.setAttribute('data-original-title', "Remove from Bookmarks")
        tooltip.innerHTML = "favorite"
        // added timeout to prevent double actions on the search page (issue fixed: add and remove item instantly)
        setTimeout(function () { tooltip.classList += ' removeWatchlist' }, 200);
    }
    // Select all the cards
    let checkCards = document.getElementsByClassName('all_card')

    for (let card of checkCards) {
        // get the TMDB ID from html
        let tmdbId = card.innerHTML.split('watchlistButton')[1].split('"')[0]
        if (isInWatchlist(tmdbId)) {
            WLButtonHandler(tmdbId)
        }
    }

    // Select all posters
    let checkPosters = document.getElementsByClassName('poster')

    for (let poster of checkPosters) {
        // get the TMDB ID from html
        let tmdbId = poster.innerHTML.split('watchlistButton')[1].split('"')[0]
        if (isInWatchlist(tmdbId)) {
            WLButtonHandler(tmdbId)
        }
    }

    // Handle he WL button on the series, episodes and movies pages (not for the posters)
    if (checkPageType('episode/') || checkPageType('series/') || checkPageType('movie/')) {
        let tmdbId = window.location.href.split('/')[4]
        if (isInWatchlist(tmdbId)) {
            WLButtonHandler(tmdbId)
        }
    }

    // ALL CLICK LISTENERS
    document.addEventListener('click', async function (e) {

        // TRAILER HANDLERS 
        const getTrailer = async (type, tmdbId) => {
            let data = await fetch(`/api/trailer/${type}/${tmdbId}`)
            let trailerURL = await data.json();
            return trailerURL.data
        } 

        // TRAILER: Listener for Trailer modals
        if (e.target && e.target.className.includes('trailer-movie')) {
            let type = 'movie'
            let tmdbID = e.target.getAttribute("tmdb");
            let modalBody = document.getElementById(`body-${tmdbID}`);
            let trailerURL = await getTrailer(type, tmdbID)

            if ((trailerURL[0].indexOf("youtube") != -1)) {
                if (trailerURL.length > 1) {

                    let modalButtons = ''
                    let vidLink = 1
                    for (let link of trailerURL) {
                        if (vidLink === 1) {
                            modalButtons += `<div class="col-2 d-grid gap-2">
                        <input type="radio" class="btn-check modal-radio" name="trailer-${vidLink}" link="${link}" tmdb="${tmdbID}" id="trailer-${vidLink}" autocomplete="off" checked>
                        <label class="btn btn-secondary modal-radio-btn" for="trailer-${vidLink}">trailer #${vidLink}</label>
                        </div>`
                        } else {
                            modalButtons += `<div class="col-2 d-grid gap-2">
                        <input type="radio" class="btn-check modal-radio" name="trailer-${vidLink}" link="${link}" tmdb="${tmdbID}" id="trailer-${vidLink}" autocomplete="off">
                        <label class="btn btn-secondary modal-radio-btn" for="trailer-${vidLink}">trailer #${vidLink}</label>
                        </div>`
                        }
                        vidLink++
                    }

                    modalBody.innerHTML = `
                        <div class="row">
                        <div id='player-${tmdbID}' class="player">
                        <iframe
                            id="iframe-${tmdbID}"
                            src="${trailerURL[0]}"
                            frameborder="0"
                            scrolling="no"
                            allowfullscreen
                        ></iframe></div></div>
                        <div class="row">${modalButtons}</div>`

                } else {
                    modalBody.innerHTML = `
                        <div id='player-${tmdbID}' class="player">
                        <iframe
                            id="iframe-${tmdbID}"
                            src="${trailerURL[0]}"
                            frameborder="0"
                            scrolling="no"
                            allowfullscreen
                        ></iframe>`
                }
            } else {
                modalBody.innerHTML = `<img class='img-fluid' src="${trailerURL.url}"/>`
            }

        } else if (e.target && e.target.className.includes('trailer-series')) {

            let type = 'series'
            let tmdbID = e.target.getAttribute("tmdb");
            let modalBody = document.getElementById(`body-${tmdbID}`);
            let trailerURL = await getTrailer(type, tmdbID)

            if ((trailerURL[0].indexOf("youtube") != -1)) {
                if (trailerURL.length > 1) {

                    let modalButtons = ''
                    let vidLink = 1
                    for (let link of trailerURL) {
                        if (vidLink === 1) {
                            modalButtons += `<div class="col-2 d-grid gap-2">
                        <input type="radio" class="btn-check modal-radio" name="trailer-${vidLink}" link="${link}" tmdb="${tmdbID}" id="trailer-${vidLink}" autocomplete="off" checked>
                        <label class="btn btn-secondary modal-radio-btn" for="trailer-${vidLink}">trailer #${vidLink}</label>
                        </div>`
                        } else {
                            modalButtons += `<div class="col-2 d-grid gap-2">
                        <input type="radio" class="btn-check modal-radio" name="trailer-${vidLink}" link="${link}" tmdb="${tmdbID}" id="trailer-${vidLink}" autocomplete="off">
                        <label class="btn btn-secondary modal-radio-btn" for="trailer-${vidLink}">trailer #${vidLink}</label>
                        </div>`
                        }
                        vidLink++
                    }

                    modalBody.innerHTML = `
                        <div class="row">
                        <div id='player-${tmdbID}' class="player">
                        <iframe
                            id="iframe-${tmdbID}"
                            src="${trailerURL[0]}"
                            frameborder="0"
                            scrolling="no"
                            allowfullscreen
                        ></iframe></div></div>
                        <div class="row">${modalButtons}</div>`

                } else {
                    modalBody.innerHTML = `
                        <div id='player-${tmdbID}' class="player">
                        <iframe
                            id="iframe-${tmdbID}"
                            src="${trailerURL[0]}"
                            frameborder="0"
                            scrolling="no"
                            allowfullscreen
                        ></iframe>`
                }
            } else {
                modalBody.innerHTML = `<img class='img-fluid' src="${trailerURL}"/>`
            }
        }


        // VIDEO SERVERS HANDLER:
        else if (e.target.classList.contains('modal-radio')) {
            let serverLink = e.target.getAttribute('link');
            let tmdbID = e.target.getAttribute('tmdb');
            let player = document.getElementById(`iframe-${tmdbID}`)
            player.src = serverLink
        }

        // VIDEO SERVERS HANDLER:
        else if (e.target.classList.contains('serverBTN')) {
            let serverLink = e.target.getAttribute('link');
            let player = document.getElementById("player-iframe")
            player.src = serverLink
        }

        // RANDOM EPISODE HANDLER
        else if (e.target && e.target.className.includes('random')) {
            let tmdbId = e.target.getAttribute("tmdb")
            let slug = window.location.pathname.split('/')[3]
            let data = await fetch(`/api/random-episode/${tmdbId}/${slug}`)
            let RandURL = await data.json();
            location.href = RandURL.url 
        }

        // Listener for Watchlist
        else if (e.target.classList.contains('removeWatchlist')) {
            let tmdbId = e.target.getAttribute('tmdb');
            e.target.title = "Add to Bookmarks"
            e.target.setAttribute('data-original-title', "Add to Bookmarks")
            localStorage.removeItem(`tmdb-${tmdbId}`)

            // If a client delete a bookmark, make the card disapear
            if (checkPageType('bookmarks')) {
                let card = document.querySelector(`#card-${tmdbId}`)
                card.classList += ' hidden'

            } else {
                e.target.innerHTML = "favorite_border"
                e.target.classList.remove("removeWatchlist")
                // added timeout to prevent double actions on the search page (issue fixed: add and remove item instantly)
                setTimeout(function () { e.target.classList += ' addWatchlist' }, 200);
            }

        } else if (e.target.classList.contains('addWatchlist')) {
            let cardInfo = JSON.stringify(e.target.getAttribute('watchlist'));
            let tmdbId = e.target.getAttribute('tmdb');
            e.target.title = "Remove from Bookmarks"
            e.target.setAttribute('data-original-title', "Remove from Bookmarks")
            localStorage.setItem(`tmdb-${tmdbId}`, `${cardInfo}`)
            e.target.innerHTML = "favorite"
            e.target.classList.remove("addWatchlist")

            // added timeout to prevent double actions on the search page (issue fixed: add and remove item instantly)
            setTimeout(function () { e.target.classList += ' removeWatchlist' }, 200);

            // FILTERS LISTENERS
        } else if (e.target.classList.contains('btn-check')) {
            if (e.target.getAttribute('filterRadio')) {
                for (let card of cards) {
                    if (card.classList.contains(e.target.getAttribute('filterRadio'))) {
                        card.classList.remove("hidden");
                    } else { card.classList += ' hidden'; }
                } 
            } else if (e.target.getAttribute('profileRadio')) {
                for (let card of cards) {
                    let cardJob = card.getAttribute('job')
                    if ((cardJob.includes(e.target.getAttribute('profileRadio'))) || (e.target.getAttribute('profileRadio') === 'All')) {
                        card.classList.remove("hiddenProfile");
                    } else { card.classList += ' hiddenProfile'; }
                }
            }

        } else if (e.target.classList.contains('randMore')) {
            location.reload()
            window.onbeforeunload = function () {
                if (window.scrollTo) window.scrollTo(0, 0);
            };

// END OF CLICK LISTENERS
        }

// END OF DOM CONTENT LOADED
    })
})
