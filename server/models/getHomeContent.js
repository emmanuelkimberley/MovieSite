
const { isInTheFuture, getBannerBackdrop, removeDoubles, slugify } = require('./utils/dataProcessing')
const { tmdbHomeData } = require('./utils/TMDBwrapper')
const parseForSinglePoster = require('./utils/parseForSinglePoster')

const getHomeContent = async () => {

    const data = await tmdbHomeData()

    // Call TMDB and parse the response 

    let rawTrendingMovies = []
    let rawTrendingSeries = []

    for (item of data.movies) {
        // Check if the movies aired already or not, if not parse for poster
        if (!isInTheFuture(item.release_date)) {
            let poster = await parseForSinglePoster(item)
            rawTrendingMovies.push(poster)
        }
    }

    for (item of data.series) {
        // Check if the movies aired already or not, if not parse for poster
        if (!isInTheFuture(item.first_air_date)) {
            let poster = await parseForSinglePoster(item)
            rawTrendingSeries.push(poster)
        }
    }

    // Get data for the slider - only the 2 most trending movies and series
    let sliderRawData = [data.movies[0], data.series[0], data.movies[1], data.series[1], data.movies[2], data.series[2]]
    let sliderData = []

    for (slide of sliderRawData) {
        if (slide.media_type === 'movie') {
            sliderData.push({
                'type': 'movie',
                'id': slide.id,
                'slug': slugify(slide.title),
                'backdrop': getBannerBackdrop(slide),
                'title': slide.title,
                'summary': slide.overview,
            })

        } else {
            sliderData.push({
                'type': 'series',
                'id': slide.id,
                'slug': slugify(slide.name),
                'backdrop': getBannerBackdrop(slide),
                'title': slide.name,
                'summary': slide.overview,
            })
        }
    }

    let trendingMovies = await removeDoubles(rawTrendingMovies)
    let trendingSeries = await removeDoubles(rawTrendingSeries)

    // Send all collected data to the RENDER page
    let finalData = { 'slider': sliderData, 'series': trendingSeries, 'movies': trendingMovies }
 
    return finalData
}

module.exports = getHomeContent;