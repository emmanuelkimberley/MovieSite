
const { tmdbSearchData, tmdbGenreData, tmdbTrendingData, tmdbMovieData, tmdbSeriesData } = require('../models/utils/TMDBwrapper')

const parseForCards = require('../models/utils/parseForCards')
const getSeriesContent = require('../models/getSeriesContent')
const { shuffle, slugify } = require('../models/utils/dataProcessing')
const axios = require('axios')

//  get more content for genre
exports.genre = async (req, res) => {
    // Need page and category ID
    let id = req.params.id
    let page = req.params.page

    const rawData = await tmdbGenreData(id, page)
    let data = shuffle(await parseForCards(rawData));

    res.send(data);
}

//  get more content for trending
exports.trending = async (req, res) => {
    // Need page
    let page = req.params.page

    const rawData = await tmdbTrendingData(page)
    let data = shuffle(await parseForCards(rawData));

    res.send(data);
}

//  get more content for search
exports.search = async (req, res) => {
    // Need page and search query
    let query = req.params.query
    let page = req.params.page

    const rawData = await tmdbSearchData(query, page)
    const data = shuffle(await parseForCards(rawData));
    res.send(data);
}


exports.randomEpisode = async (req, res) => {
    let id = req.params.id 
    let slugSplit = req.params.slug.split('-');
    let seasonAndEpisode = slugSplit[slugSplit.length - 1].split('x');
    let seasonNum = parseInt(seasonAndEpisode[0]);
    let episodeNum = parseInt(seasonAndEpisode[1]);

    const rawData = await getSeriesContent(id)

    // Get a random episode from the all episode aired list
    let randomItemInArray = Math.floor((Math.random() * rawData.allAiredEpisodes.length))
    let randEpisode = rawData.allAiredEpisodes[randomItemInArray]
    let randSeaNum = randEpisode[0]
    let randEpNum = randEpisode[1]

    // Check if the random episode is the episode the client is already on
    if ((seasonNum === randSeaNum) && (episodeNum === randEpNum)) {
        // If only 1 episode aired in this series, Don't worry about it
        if (!(rawData.allAiredEpisodes.length === 1)) {
            // Otherwise do this:
            if (rawData.allAiredEpisodes[randomItemInArray + 1]) {
                randSeaNum = rawData.allAiredEpisodes[randomItemInArray + 1][0]
                randEpNum = rawData.allAiredEpisodes[randomItemInArray + 1][1]
            } else {
                randSeaNum = rawData.allAiredEpisodes[randomItemInArray - 1][0]
                randEpNum = rawData.allAiredEpisodes[randomItemInArray - 1][1]
            }
        } 
    }


    let name = slugify(rawData.title)
    let RanEpURL = {
        'url': `/episode/${id}/${name}-${randSeaNum}x${randEpNum}`
}
    
    res.send(RanEpURL);
}

//  get TRAILER
exports.trailer = async (req, res) => {
    // Need page and search query
    let type = req.params.type
    let tmdbID = req.params.id
    let videoUnavailable = '/static/video-unavailable.jpg';
    let data

    if (type === 'movie') {
        const rawData = await tmdbMovieData(tmdbID)
        if (rawData.videos.results.length === 0) {
            data = videoUnavailable
        } else {
            data = []
            for (let vid of rawData.videos.results) {
                data.push(`https://www.youtube.com/embed/${vid.key}`)
            }
        }
    } else {
        const rawData = await tmdbSeriesData(tmdbID)
        if (rawData.videos.results.length === 0) {
            data = videoUnavailable
        } else {
            data = []
            for (let vid of rawData.videos.results) {
                data.push(`https://www.youtube.com/embed/${vid.key}`)
            }
        }
    }

    let trailerURL = {
        'data': data
    }

    res.send(trailerURL);
}