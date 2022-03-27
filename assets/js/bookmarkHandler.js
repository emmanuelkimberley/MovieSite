import createCard from './createCard.js'

let resultsDiv = document.querySelector(`#results`)
let cards = document.getElementsByClassName("all_card");

// POPULATE THE BOOKMARKS WITH CLIENTS DATA
let items = Object.keys(localStorage)
const bookmarks = [];
for (let item of items) {
    if (item.includes('tmdb-')) {
        let cardInfo = JSON.parse(localStorage[item])
        bookmarks.push(cardInfo)
    }
}

if (bookmarks.length > 0) {
    // Creating cards of each credit 
    for (let BMitem of bookmarks) {
        let item = JSON.parse(BMitem)
        item.WLinfo = JSON.stringify(BMitem)
        item.bookmarks = true
        item.classes = `all_card All ${item.type}`
        let card = createCard(item)
        resultsDiv.innerHTML += card
    }
} else {
    resultsDiv.innerHTML = `                
        <div class='empty-bookmarks'>
            <h2>Nothing here... Yet</h2><br />
            <p>You can keep track of your favorite movies and TV shows<br />
            by clicking the <span class="material-icons">favorite_border</span> Icon</p><br />
            <p><b>It's free, and no account is required.</b></p>
        </div>
    `
}
// END OF - POPULATE THE BOOKMARKS WITH CLIENTS DATA


document.addEventListener('click', async function (e) {

    if (e.target && e.target.className.includes('fav-icon')) {
        let cardNumber = cards.length
        for (let card of cards) {
            if (card.className.includes('hidden')) {
                cardNumber -= 1
            }
        }

        // If the last card is removed, add text
        if (cardNumber === 1) {
            // The setTimeout here will prevent the last tooltip to stay on the page
            setTimeout(function () { 
                resultsDiv.innerHTML = `
                    <div class='empty-bookmarks'>
                        <h2>No more items in your bookmarks</h2><br />
                        <p>You can keep track of your favorite movies and TV shows<br /> 
                        by clicking the <span class="material-icons"> favorite_border</span> Icon</p><br />
                        <p><b>We don't need to tell you... You know how it works.</b></p>
                    </div>
                    `
             }, 200);
            
        } 
    }
})