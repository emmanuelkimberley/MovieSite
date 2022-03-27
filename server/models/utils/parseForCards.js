const { isInTheFuture, removeDoubles, getPoster, getCardBackdrop, slugify } = require('./dataProcessing')

const genresList = [
    { "id": 10759, "name": "Action" },
    { "id": 28, "name": "Action" },
    { "id": 12, "name": "Adventure" },
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

const parseForCards = async (rawData) => {
    results = []
    
    for (let item of rawData) {

        try { 
            if (item.media_type === 'movie') {

                releaseDate = item.release_date
                // Remove results not yet released
                if (!isInTheFuture(releaseDate)) {
                    let imgSource = getPoster(item)
                    // Get directors name from data

                    // Get genre info
                    let categories = [];
                    for (let id of item.genre_ids) {
                        function catName(genres) {
                            return genres.id === id
                        }
                        let name = await genresList.find(catName).name

                        let cat = {
                            'id': id,
                            'name': name,
                            'slug': slugify(name)
                        }
                        categories.push(cat)
                    }

                    let releaseYear = item.release_date.split('-')[0]

                    let summary = item.overview
                    if (summary.length > 235) {
                        summary = summary.substring(0, 230) + '...'
                    }

                    let title = item.title
                    if (title.length > 43) {
                        title = title.substring(0, 40) + '...'
                    }

                    let backdrop = getCardBackdrop(item)

                    let job
                    item.hasOwnProperty('job') ? job = item.job : job = null
                    
                    results.push({
                        'type': 'movie',
                        'id': item.id,
                        'imgSource': imgSource,
                        'backdrop': backdrop,
                        'title': String(title),
                        'slug': slugify(item.title),
                        'categories': categories.slice(0, 2),
                        'runtime': item.runtime,
                        'rating': item.vote_average,
                        'job': job,
                        'summary': summary,
                        'releaseDate': releaseYear
                    })
                }
            } else if (item.media_type === 'tv') {
                
                    releaseDate = item.first_air_date
                    if (!isInTheFuture(releaseDate)) {

                        let imgSource = getPoster(item)

                        let releaseYear = item.first_air_date.split('-')[0]
                        let summary = item.overview
                        if (summary.length > 235) {
                            summary = summary.substring(0, 230) + '...'
                        }

                        let title = item.name
                        if (title.length > 43) {
                            title = title.substring(0, 40) + '...'
                        }

                        // Get genre info
                        let categories = [];
                        for (let id of item.genre_ids) {

                            function catName(genres) {
                                return genres.id === id
                            }
                            let name = await genresList.find(catName).name
                            let cat = {
                                'id': id,
                                'name': name,
                                'slug': slugify(name)
                            }
                            categories.push(cat)
                        }

                        let backdrop = getCardBackdrop(item)

                        let job
                        item.hasOwnProperty('job') ? job = item.job : job = null

                        results.push({
                            'type': 'series',
                            'id': item.id,
                            'imgSource': imgSource,
                            'backdrop': backdrop,
                            'title': String(title),
                            'slug': slugify(item.name),
                            'categories': categories.slice(0, 2),
                            'seasonNUm': item.number_of_seasons,
                            'rating': item.vote_average,
                            'summary': summary,
                            'job': job,
                            'releaseDate': releaseYear
                        })
                }
            } else {
                let backdrop = getCardBackdrop(item)
                let imgSource = getPoster(item)
                results.push({
                    'type': 'person',
                    'id': item.id,
                    'imgSource': imgSource,
                    'backdrop': backdrop,
                    'title': String(item.name),
                    'slug': slugify(item.name),
                    'rating': item.popularity,
                    'job': item.known_for_department
                })
            }
        } catch (err) {
            console.log(err.message);
        }
    };
        
    const allResultsNoDoubles = removeDoubles(results)
    const allResults = allResultsNoDoubles.map((item) => {
        let watchListInfo = JSON.stringify(item).replace(/'/g, "&apos;")
        item.WLinfo = watchListInfo 
        return item
    })

    return allResults
}

module.exports = parseForCards;