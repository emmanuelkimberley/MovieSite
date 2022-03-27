const { isInTheFuture, getPoster, getCardBackdrop, slugify } = require('./dataProcessing')

const genresList = [
    { "id": 10759, "name": "Action" },
    { "id": 28, "name": "Action" },
    { "id": 12, "name": "Action" },
    { "id": 16, "name": "Animation" },
    { "id": 35, "name": "Comedy" },
    { "id": 80, "name": "Crime" },
    { "id": 99, "name": "Documentary" },
    { "id": 18, "name": "Drama" },
    { "id": 10751, "name": "Family" },
    { "id": 14, "name": "Fantasy" },
    { "id": 36, "name": "History" },
    { "id": 27, "name": "Horror" },
    { "id": 10762, "name": "Kids" },
    { "id": 10402, "name": "Music" },
    { "id": 10763, "name": "News" },
    { "id": 9648, "name": "Mystery" },
    { "id": 10749, "name": "Romance" },
    { "id": 878, "name": "Sci-Fi" },
    { "id": 10770, "name": "TV Movie" },
    { "id": 10764, "name": "Reality" },
    { "id": 53, "name": "Thriller" },
    { "id": 10765, "name": "Sci-Fi" },
    { "id": 10752, "name": "War" },
    { "id": 10766, "name": "Soap" },
    { "id": 10767, "name": "Talk" },
    { "id": 10768, "name": "War" },
    { "id": 37, "name": "Western" }]



//  CONSIDER parseForCards - and merge search, genre, trending

const parseForSingleCard = async (item) => {

    let card = {}
    try { 
        if (item.media_type === 'movie') {

            releaseDate = item.release_date
            // Remove results not yet released
            if (!isInTheFuture(releaseDate)) {
                let imgSource = getPoster(item)
                // Get directors name from data

                let categories = [];
                // Get genre info - depending on the TMDB source, it could be stored in 'genre_ids' or 'genres'
                if (item.hasOwnProperty('genre_ids')) {
                    for (let id of item.genre_ids) {

                        function catName(genres) {
                            return genres.id === id
                        }
                        let name = await genresList.find(catName).name
                        let cat = {
                            'id': id,
                            'name': name,
                            'slug': await slugify(name)
                        }
                        categories.push(cat)
                    }
                } else if (item.hasOwnProperty('genres')) {

                    for (let genre of item.genres) {
                        let cat = {
                            'id': genre.id,
                            'name': genre.name,
                            'slug': await slugify(genre.name)
                        }
                        categories.push(cat)

                    }
                }

                let releaseYear = item.release_date.split('-')[0]

                let summary = item.overview
                if (summary.length > 265) {
                    summary = summary.substring(0, 260) + '...'
                }

                let backdrop = getCardBackdrop(item)
                
                card = {
                    'type': 'movie',
                    'id': item.id,
                    'imgSource': imgSource,
                    'backdrop': backdrop,
                    'title': String(item.title),
                    'slug': await slugify(item.title),
                    'categories': categories.slice(0, 2),
                    'runtime': item.runtime,
                    'rating': item.vote_average,
                    'summary': summary,
                    'releaseDate': releaseYear
                }
            }
        } else if (item.media_type === 'tv') {

            releaseDate = item.first_air_date
            if (!isInTheFuture(releaseDate)) {

                let imgSource = await getPoster(item)

                let releaseYear = item.first_air_date.split('-')[0]
                let summary = item.overview
                if (summary.length > 265) {
                    summary = summary.substring(0, 260) + '...'
                }

                let categories = [];
            // Get genre info - depending on the TMDB source, it could be stored in 'genre_ids' or 'genres'
                if (item.hasOwnProperty('genre_ids')) {
                for (let id of item.genre_ids) {

                    function catName(genres) {
                        return genres.id === id
                    }
                    let name = await genresList.find(catName).name
                    let cat = {
                        'id': id,
                        'name': name,
                        'slug': await slugify(name)
                    }
                    categories.push(cat)
                    }
                } else if (item.hasOwnProperty('genres')) {

                    for (let genre of item.genres) {
                        let cat = {
                            'id': genre.id,
                            'name': genre.name,
                            'slug': await slugify(genre.name)
                        }
                        categories.push(cat)

                    }
                }

                let backdrop = getCardBackdrop(item)

                card = {
                    'type': 'series',
                    'id': item.id,
                    'imgSource': imgSource,
                    'backdrop': backdrop,
                    'title': String(item.name),
                    'slug': await slugify(item.name),
                    'categories': categories.slice(0, 2),
                    'seasonNUm': item.number_of_seasons,
                    'rating': item.vote_average,
                    'summary': summary,
                    'releaseDate': releaseYear
                }
            }
        } else {
            let backdrop = getCardBackdrop(item)
            let imgSource = getPoster(item)
            card = {
                'type': 'person',
                'id': item.id,
                'imgSource': imgSource,
                'backdrop': backdrop,
                'title': String(item.name),
                'slug': await slugify(String(item.name)),
                'rating': item.popularity,
                'job': item.known_for_department
            }
        }
    } catch (err) {
        console.log(err.message);
    }

    let watchListInfo = JSON.stringify(card).replace(/'/g, "&apos;")
    card.WLinfo = watchListInfo

    return card
}

module.exports = parseForSingleCard;