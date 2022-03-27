const { tmdbMovieData } = require('./utils/TMDBwrapper')
const { isInTheFuture, slugify, getPoster, getBannerBackdrop, getFinancials } = require('./utils/dataProcessing')
const parseForSingleCard = require('./utils/parseForSingleCard')

const getMovieContent = async (tmdbId) => {

    // Get movie data
    let movieData = await tmdbMovieData(tmdbId)

    // parse movie data
    let movieSlug = await slugify(movieData.title)
    let posterImg = await getPoster(movieData)

    // Get summary for cards (limited characters)
    let cardSummary = movieData.overview
    if (cardSummary.length > 265) {
        cardSummary = cardSummary.substring(0, 260) + '...'
    }

    // Get categories info
    let categories = [];
    for (let genre of movieData.genres) {
        let cat = {
            'id': genre.id,
            'name': genre.name,
            'slug': await slugify(genre.name)
        }
        categories.push(cat)
    }

    // Get production companies info
    let production_companies = [];
    for (let prodComp of movieData.production_companies ) {
        let prod = {
            'name': prodComp.name,
            'country': prodComp.origin_country 
        }

        production_companies.push(prod)
    }

        // Get directors name from data
    let director;
    movieData.credits.crew.find((e) => {
    if (e.job == "Director") {
        e.media_type = 'person'
        director = {
            'id': e.id,
            'name': e.name,
            'slug': slugify(e.name),
            'profileImage': getPoster(e),
            }
            return
        }
    })

    // Get cast info
    let castList = [];
    for (let cast of movieData.credits.cast) {
        cast.media_type = 'person'
        castInfo = {
            'id': cast.id,
            'name': String(cast.name),
            'slug': await slugify(String(cast.name)),
            'profileImage': await getPoster(cast),
            'character': cast.character
        }
        castList.push(castInfo)
    }

    // Adding 10 similar movie to the similar movie placeHolder
    let similarList = [];
    if (movieData.similar.results.length > 0) {
        let movies = 0;
        for (let similar of movieData.similar.results) {

            if (similar.id != tmdbId) {
                if (movies < 10) {
                    // Get similar movie release year for the posters
                    releaseYear = similar.release_date.split('-')[0]

                    // Check if the movie aired already or not
                    if (!isInTheFuture(similar.release_date)) {
                        similar.media_type = 'movie'

                        let similarWLinfo = await parseForSingleCard(similar)

                        similarList.push({
                            'type': 'movie',
                            'id': similar.id,
                            'title': similar.title,
                            'slug': await slugify(similar.title),
                            'releaseYear': releaseYear,
                            'WLinfo': similarWLinfo.WLinfo,
                            'posterImg': await getPoster(similar)
                        })
                    }
                    movies++;
                }
            }
        };
    }

    // get card info for bookmark
    movieData.media_type = 'movie'
    let watchListInfo = await parseForSingleCard(movieData)

    // Send all collected data to the RENDER page
    movieData = {
        'type': 'movie', 
        'id': tmdbId, // movie id
        'title': String(movieData.title), // movie title
        'original_title': String(movieData.original_title), // movie original_title
        'slug': movieSlug, // movie title slug
        'tagline': String(movieData.tagline), // movie tagline
        'posterImg': posterImg, // movie poster
        'director': director,
        'bannerBackdrop': await getBannerBackdrop(movieData), // movie backdrop
        'releaseDate': movieData.release_date, // movie release date
        'rating': movieData.vote_average, // movie ratings
        'website': movieData.homepage, // movie website
        'budget': getFinancials(movieData.budget), // movie budget
        'revenue': getFinancials(movieData.revenue), // movie revenue
        'runtime': movieData.runtime, // movie runtime
        'language': movieData.original_language, // movie language
        'summary': movieData.overview, // movie summary
        'categories': categories, // movie categories
        'production_companies': production_companies.slice(0, 4), // movie production_companies
        'cast': castList, // movie cast
        'similar': similarList, // movie similar titles
        'WLinfo': watchListInfo.WLinfo, // movie similar titles
    }

    return movieData
}

module.exports = getMovieContent;