const { tmdbSeriesData } = require('./utils/TMDBwrapper')
const { isInTheFuture, getPoster, slugify, getAllAiredEpisodes, getBannerBackdrop } = require('./utils/dataProcessing')
const parseForSingleCard = require('./utils/parseForSingleCard')

const getSeriesContent = async (tmdbId) => {

    // Get series data
    let seriesData = await tmdbSeriesData(tmdbId)

    // parse series data
    let seriesSlug = await slugify(seriesData.name)
    let posterImg = await getPoster(seriesData)

    // Get summary for cards (limited characters)
    let cardSummary = seriesData.overview
    if (cardSummary.length > 265) {
        cardSummary = cardSummary.substring(0, 260) + '...'
    }

    // Get categories info
    let categories = [];
    for (let genre of seriesData.genres) {
        let cat = {
            'id': genre.id,
            'name': String(genre.name),
            'slug': await slugify(String(genre.name))
        }
        categories.push(cat)
    }

    // Get cast info
    let castList = [];
    for (let cast of seriesData.credits.cast) {
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


    // Get production companies info
    let production_companies = [];
    for (let prodComp of seriesData.production_companies) {
        let prod = {
            'name': prodComp.name,
            'country': prodComp.origin_country
        }

        production_companies.push(prod)
    }





    // Adding 10 similar series to the similar series placeHolder
    let similarList = [];
    if (seriesData.similar.results.length > 0) {
        let series = 0;
        for (let similar of seriesData.similar.results) {

            if (similar.id != tmdbId) {
                if (series < 10) {
                    // Get similar series release year for the posters
                    releaseYear = similar.first_air_date.split('-')[0]

                    // Check if the series aired already or not
                    if (!isInTheFuture(similar.first_air_date)) {

                        // get card info for bookmark
                        similar.media_type = 'tv'
                        let similarWLinfo = await parseForSingleCard(similar)

                        similarList.push({
                            'type': 'series',
                            'id': similar.id,
                            'title': similar.name,
                            'slug': await slugify(similar.name),
                            'releaseYear': releaseYear,
                            'WLinfo': similarWLinfo.WLinfo,
                            'posterImg': await getPoster(similar)
                        })
                    }
                    series++;
                }
            }
        };
    }

    // All aired episodes (exclude "not released" and "season 0")
    let AllAiredEpisodes = await getAllAiredEpisodes(seriesData).reverse()

    // Remove empty seasons and keep only seasons with episodes
    let numberOfSeasons = AllAiredEpisodes[AllAiredEpisodes.length -1][0]

    // get card info for bookmark
    seriesData.media_type = 'tv'
    let watchListInfo = await parseForSingleCard(seriesData)

    // Send all collected data to the RENDER page
    serieData = {
        'type': 'series',
        'id': tmdbId, // SERIES id
        'title': String(seriesData.name), // SERIES name
        'numberOfSeasons': numberOfSeasons, // Total number of seasons in this series (needed for the episode list (_SElist))
        'slug': seriesSlug, // SERIES name slug
        'posterImg': posterImg, // SERIES poster
        'bannerBackdrop': await getBannerBackdrop(seriesData), // SERIES backdrop
        'releaseDate': seriesData.first_air_date, // SERIES release date
        'website': seriesData.homepage, // SERIES website
        'in_production': seriesData.in_production, // SERIES boolean if series is in prod now
        'last_episode_to_air': seriesData.last_episode_to_air, // SERIES object { air_date, episode_number, name, season_number },
        'next_episode_to_air': seriesData.next_episode_to_air, // SERIES object { air_date, episode_number, name, season_number },
        'original_name': seriesData.original_name, // SERIES original name
        'origin_country': seriesData.origin_country, // SERIES origin_country
        'tagline': seriesData.tagline, // SERIES tagline
        'rating': seriesData.vote_average, // SERIES ratings
        'status': seriesData.status, // SERIES status
        'language': seriesData.original_language, // SERIES language
        'summary': seriesData.overview, // SERIES summary
        'categories': categories, // SERIES categories
        'cast': castList, // SERIES cast
        'production_companies': seriesData.production_companies, // SERIES object {id ,name}
        'similar': similarList, // SERIES similar titles
        'WLinfo': watchListInfo.WLinfo, // SERIES similar titles
        'allAiredEpisodes': AllAiredEpisodes
    }


return serieData
}

module.exports = getSeriesContent;