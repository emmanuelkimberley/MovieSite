const axios = require('axios')
const apiKey = process.env.MOVIEDB_KEY

const tmdbMovieData = async (tmdbId) => {

    // Get the TMDB API link and the 
    const link = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=en-US&append_to_response=credits,similar,videos`;

    let results
    // Call TMDB and parse the response 
    await axios.get(link)
        .then(response => {
            results = response.data
        })
        .catch(err => console.log(err.data))
    return results
}

const tmdbSeriesData = async (tmdbId) => {

    // Get the TMDB API link and the 
    const link = `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${apiKey}&include_adult=false&language=en-US&append_to_response=credits,similar,videos`;

    let results
    // Call TMDB and parse the response 
    await axios.get(link)
        .then(response => {
            results = response.data
        })
        .catch(err => console.log(err.data))
    return results
}


const tmdbEpisodeData = async (tmdbId, seasonNum, episodeNum) => {

    // TMDB API link to fetch episode data
    const link = `https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNum}/episode/${episodeNum}?api_key=${apiKey}&language=en-US`;

    let results
    // Call TMDB and parse the response 
    await axios.get(link)
        .then(response => {
            results = response.data
        })
        .catch(err => console.log(err.data))

    return results
}

const tmdbPersonData = async (personID) => {

    // Get the TMDB API link and the 
    const link = `https://api.themoviedb.org/3/person/${personID}?api_key=${apiKey}&language=en-US&append_to_response=movie_credits,tv_credits `;

    let results
    // Call TMDB and parse the response 
    await axios.get(link)
        .then(response => {
            results = response.data
        })
        .catch(err => console.log(err.data))
    return results
}

const tmdbRandomMovies = async () => {
    // Get a number between 1 and 40 (that is to get a random page in the API request)
    const random = () => {
        let num = Math.floor(Math.random() * 40)
        if (num === 0) {
            num = 1
        }
        return num
    };

    // Get a number between 1 and 40 (that is to get a random page in the API request)
    let page = random()
    let page2 = random()

    // Place holder for results
    let results = []

    // Request links
    const axiosrequest1 = axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&include_adult=false&page=${page}`);
    const axiosrequest2 = axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&include_adult=false&language=en-US&page=${page2}`);

    // Make the requests
    await axios.all([axiosrequest1, axiosrequest2])
        .then(axios.spread(function (res1, res2) {

            // Parse the Movies from the "popular" request
            for (let item of res1.data.results) {
                item.media_type = 'movie'
                results.push(item)
            }

            // Parse the Movies from the "top_rated" request
            for (let item of res2.data.results) {
                item.media_type = 'movie'
                results.push(item)
            }
        }))
        .catch(err => console.log(err.data));

    return results
}

const tmdbRandomSeries = async () => {

    // Get a number between 1 and 40 (that is to get a random page in the API request)
    const random = () => {
        let num = Math.floor(Math.random() * 20)
        if (num === 0) {
            num = 1
        }
        return num
    };

    // Get a number between 1 and 40 (that is to get a random page in the API request)
    let page = random()
    let page2 = random()

    // Place holder for results
    let results = []

    // Request links
    const axiosrequest1 = axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&include_adult=false&language=en-US&page=${page}`);
    const axiosrequest2 = axios.get(`https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&include_adult=false&language=en-US&page=${page2}`);

    // Make the requests
    await axios.all([axiosrequest1, axiosrequest2])
        .then(axios.spread(function (res1, res2) {

            // Parse the Series from the "popular" request
            for (let item of res1.data.results) {
                item.media_type = 'tv'
                results.push(item)
            }

            // Parse the Series from the "top_rated" request
            for (let item of res2.data.results) {
                item.media_type = 'tv'
                results.push(item)
            }
        }))
        .catch(err => console.log(err.data));
    
    return results
}


const tmdbHomeData = async () => {

    // Place holder for results
    let moviesResults = []
    let seriesResults = []

    // Request links
    const axiosrequest1 = axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&include_adult=false&page=1`);
    const axiosrequest2 = axios.get(`https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&include_adult=false&page=1`);

    // Make the requests
    await axios.all([axiosrequest1, axiosrequest2])
        .then(axios.spread(function (res1, res2) {

            // Send movies to the results array
            for (let item of res1.data.results) {
                item.media_type = 'movie'
                moviesResults.push(item)
            }

            // Send series to the results array
            for (let item of res2.data.results) {
                item.media_type = 'tv'
                seriesResults.push(item)
            }

        }))
        .catch(err => console.log(err.data))

    let data = { 'movies': moviesResults, 'series': seriesResults }

    return data
}


const tmdbSearchData = async (searchQuery, page) => {

    // WAITING FOR INFINITE SCROLLING
    if (!page) {
        let page = 1
    }

    // Get the TMDB API link and the 
    const link = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=${searchQuery}&page=${page}&include_adult=false&&append_to_response=last_episode_to_air`;

    let results
    // Call TMDB and parse the response 
    await axios.get(link)
        .then(response => {
            results = []
            // Remove results not yet released
            for (let item of response.data.results) {
                results.push(item)
            }
        })
        .catch(err => console.log(err.data))
    return results
}

const tmdbGenreData = async (genreId, page) => {

    // WAITING FOR INFINITE SCROLLING
    if (!page) {
        let page = 1
    }

    // Place holder for results
    let results = []

    // Request links
    const axiosrequest1 = axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&language=en-US&sort_by=popularity.desc&page=${page}&with_genres=${genreId}`);
    const axiosrequest2 = axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&include_adult=false&language=en-US&sort_by=popularity.desc&page=${page}&with_genres=${genreId}`);

    // Make the requests
    await axios.all([axiosrequest1, axiosrequest2])
        .then(axios.spread(function (res1, res2) {

            // Send 10 series to the results array
            let serNum = 1
            for (let item of res2.data.results) {
                if (serNum < 11) {
                    item.media_type = 'tv'
                    results.push(item)
                    serNum++
                }
            }

            // Complete the results with movies (for the movies only categories)
            for (let item of res1.data.results) {
                if (results.length < 20) {
                    item.media_type = 'movie'
                    results.push(item)
                }
            }

        }))
        .catch(err => console.log(err.data))

    return results
}

const tmdbTrendingData = async (page) => {

    // WAITING FOR INFINITE SCROLLING
    if (!page) {
        page = 1
    }

    // Get the TMDB API link and the 
    const link = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}&include_adult=false&page=${page}`;

    let results
    // Call TMDB and parse the response 
    await axios.get(link)
        .then(response => {
            results = []
            // Remove results not yet released
            for (let item of response.data.results) {
                results.push(item)
            }
        })
        .catch(err => console.log(err.data))
    return results
}

const tmdbUpcomingMovies = async (personID) => {

    // Get the TMDB API link and the 
    const link = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1&append_to_response=movie_credits,tv_credits `;

    let results
    // Call TMDB and parse the response 
    await axios.get(link)
        .then(response => {
            results = response.data
        })
        .catch(err => console.log(err.data))
    return results
}

module.exports = {
    tmdbSeriesData: tmdbSeriesData,
    tmdbEpisodeData: tmdbEpisodeData,
    tmdbHomeData: tmdbHomeData,
    tmdbPersonData: tmdbPersonData,
    tmdbRandomSeries: tmdbRandomSeries,
    tmdbRandomMovies: tmdbRandomMovies, 
    tmdbTrendingData: tmdbTrendingData,
    tmdbMovieData: tmdbMovieData,
    tmdbGenreData: tmdbGenreData,
    tmdbSearchData: tmdbSearchData,
    tmdbUpcomingMovies: tmdbUpcomingMovies,
}