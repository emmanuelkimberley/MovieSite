const express = require("express")
const route = express.Router()

const services = require('./controllers/render')
const apiController = require('./controllers/apiController')

route.get('/', services.home)
route.get('/movie/:id/:slug', services.movie)
route.get('/series/:id/:slug', services.series)
route.get('/person/:id/:slug', services.person)
route.get('/episode/:id/:slug', services.episode)
route.get('/search/:query', services.search)
route.get('/genre/:id/:slug', services.genre)
route.get('/trending', services.trending)
route.get('/random-movies', services.randomMovies)
route.get('/random-series', services.randomSeries)
route.get('/bookmarks', services.bookmarks)
// route.get('/coming-up', services.comingUp)

// API
route.get('/api/genre/:id/:page', apiController.genre)
route.get('/api/trending/:page', apiController.trending)
route.get('/api/random-episode/:id/:slug', apiController.randomEpisode)
route.get('/api/search/:query/:page', apiController.search)
route.get('/api/trailer/:type/:id', apiController.trailer)
// route.get('/api/vidlox', apiController.vidlox)
// route.get('/api/messages/:userId', apiController.messages)
// route.get('/api/request/:userId/:vidId/:vidSlug', apiController.handleRequest)


route.get('*', services.notFound)

module.exports = route