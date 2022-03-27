import createCard from './createCard.js'

const spinner = document.querySelector('.loader-container')
let resultsDiv = document.querySelector(`#results`)
let cards = document.getElementsByClassName("all_card");

document.addEventListener('DOMContentLoaded', () => {
    const getNewCards = async (page) => {

        // GET PAGE TYPE (genre/trending/search/random)
        if (window.location.href.indexOf("search") != -1) {
            let query = window.location.href.split('search/')[1];
            let data = await fetch(`/api/search/${query}/${page}`)
            let newCards = await data.json();
            return newCards

        } else if (window.location.href.indexOf("genre") != -1) {
            let genre = window.location.href.split('genre')[1].split('/')[1];
            let data = await fetch(`/api/genre/${genre}/${page}`)
            let newCards = await data.json();
            return newCards

        } else if (window.location.href.indexOf("trending") != -1) {
            let data = await fetch(`/api/trending/${page}`)
            let newCards = await data.json();
            return newCards
        }
    }

    const checkCardsForDoubles = (tmdbId) => {
        for (let card of cards) {
            // Get the tmdbId of each card on the page
            let cardID = card.getAttribute('id').split('card-')[1]

            // If the provided tmdbID match any card ID, then it's a double
            if (parseInt(cardID) === parseInt(tmdbId)) {
                return true
            }
        }
        // otherwise it is not
        return false
    }

    let timer = null;
    let page = 1;
    const infiniteScrollHandler = (page) => {
        page += 1
        timer = setTimeout(async function () {
            let newCards = await getNewCards(page)
            // Parse for cards AND create new card with new data
            for (let newCard of newCards) {
                if (checkCardsForDoubles(newCard.id) === false) {
                    newCard.classes = `all_card All ${newCard.type}`

                    if (document.getElementById('flexRadioMovie').checked) {
                        if ((newCard.type === 'series') || (newCard.type === 'person')) {
                            newCard.classes += ` hidden`
                        }
                    } else if (document.getElementById('flexRadioSeries').checked) {
                        if ((newCard.type === 'movie') || (newCard.type === 'person')) {
                            newCard.classes += ` hidden`
                        }
                    } else if (document.getElementById('flexRadioPerson').checked) {
                        if ((newCard.type === 'movie') || (newCard.type === 'series')) {
                            newCard.classes += ` hidden`
                        }
                    }

                    // This code isn't run on the bookmark page
                    newCard.bookmarks = false

                    let card = await createCard(newCard)
                    resultsDiv.innerHTML += card
                }
            }
        }, 500);

        spinner.classList += " hidden"

        return page 
    }

    // INFINITE SCROLL
    window.onscroll = async (ev) => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            spinner.classList.remove("hidden")
            if (timer) {
                clearTimeout(timer);
                page = await infiniteScrollHandler(page)
            } else {
                page = await infiniteScrollHandler(page)
            };
        }
    }
    
})