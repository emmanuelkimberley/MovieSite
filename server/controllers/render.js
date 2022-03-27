const getHomeContent = require('../models/getHomeContent')
const getSeriesContent = require('../models/getSeriesContent')
const getEpisodeContent = require('../models/getEpisodeContent')
const getMovieContent = require('../models/getMovieContent')
const { tmdbSearchData, tmdbGenreData, tmdbTrendingData, tmdbRandomSeries, tmdbRandomMovies, tmdbPersonData } = require('../models/utils/TMDBwrapper')
const getServers = require('../models/utils/getServers')
const parseForCards = require('../models/utils/parseForCards')
const parseForPerson = require('../models/utils/parseForPerson')
const parseForPosters = require('../models/utils/parseForPosters')
const { shuffle, removeDoubles } = require('../models/utils/dataProcessing')




exports.home = async (req, res) => {

    const data = await getHomeContent()
    res.render('index', { sliderData: data.slider, seriesPosters: data.series.slice(0, 15), moviesPosters: data.movies.slice(0, 15) })
}

exports.movie = async (req, res) => {

    let tmdbId = req.params.id;
    const data = await getMovieContent(tmdbId);

    let moviesServers

    if (process.env.VIDEO === 'ON') {
        // Get the video sources
        req.params.type = 'movie'
        moviesServers = await getServers(req.params);
    } else {
        moviesServers = false
    }

    res.render('movie', { movieData: data, servers: moviesServers })
}

exports.series = async (req, res) => {
    let tmdbId = req.params.id;
    const data = await getSeriesContent(tmdbId);
    res.render('series', { serieData: data })
}

exports.episode = async (req, res) => {

    let tmdbId = req.params.id;
    let slugSplit = req.params.slug.split('-');
    let seasonAndEpisode = slugSplit[slugSplit.length - 1].split('x');
    let seasonNum = parseInt(seasonAndEpisode[0]);
    let episodeNum = parseInt(seasonAndEpisode[1]);

    const data = await getEpisodeContent(tmdbId, seasonNum, episodeNum)

    let episodeServers

    if (process.env.VIDEO === 'ON') {
        // Get the video sources
        req.params.type = 'episode'
        episodeServers = await getServers(req.params);
    } else {
        episodeServers = false
    }

    res.render('episode', { epData: data, servers: episodeServers})
}

exports.person = async (req, res) => {
    let personID = req.params.id;
    
    const rawData = await tmdbPersonData(personID)
    const data = await parseForPerson(rawData)

    let credits = await parseForCards(data.allCredits)
    let pageTitle = `Profile of ${data.name}`

    res.render('person', { data: data, pageTitle: pageTitle, cardList: credits })
}

exports.search = async (req, res) => {

    let query = req.params.query;
    let pageTitle = `Results for: ${String(query).replace(/%20/g, ' ')}`
    const rawData = await tmdbSearchData(query)
    const data = await parseForCards(rawData);
    
    res.render('results', { data: data, pageTitle: pageTitle })
}

exports.genre = async (req, res) => {

    let genreId = req.params.id;
    let genreTitle = req.params.slug;
    let pageTitle = `Genre: ${genreTitle}`
    const rawData = await tmdbGenreData(genreId)
    const data = shuffle(await parseForCards(rawData));

    res.render('results', { data: data, pageTitle: pageTitle })
}

exports.trending = async (req, res) => {
    let pageTitle = `Trending` 
    let page
    const rawData = await tmdbTrendingData(page)
    const data = await parseForCards(rawData);
    res.render('results', { data: data, pageTitle: pageTitle })
}

exports.bookmarks = async (req, res) => {
    let pageTitle = `Bookmarks`
    res.render('bookmarks', { pageTitle: pageTitle })
}

exports.randomMovies = async (req, res) => {
    let pageTitle = ''
    const rawData = await tmdbRandomMovies()
    const data = shuffle(removeDoubles(await parseForPosters(rawData)));
    // const data = shuffle(await parseForCards(rawData));
    res.render('random', { 'posters': data, pageTitle: pageTitle})
}

exports.randomSeries = async (req, res) => {
    let pageTitle = ''
    const rawData = await tmdbRandomSeries()
    const data = shuffle(removeDoubles(await parseForPosters(rawData)));
    // const data = shuffle(await parseForCards(rawData));
    res.render('random', { 'posters': data, pageTitle: pageTitle })
}

// exports.comingUp = async (req, res) => {
//     let pageTitle = 'Upcoming'
//     // const rawData = await tmdbUpcomingMovies()
//     // // const data = shuffle(await parseForCards(rawData));


//     const rawData = await tmdbRandomMovies()
//     // const posters = await parseForPosters(rawData)



//     res.render('comingUp', { data: posters, pageTitle: pageTitle })
// }

exports.notFound = async (req, res) => {
    res.status(404).render('404')
}