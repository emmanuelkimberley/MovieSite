const { tmdbEpisodeData } = require('./utils/TMDBwrapper')
const getSeriesContent = require('./getSeriesContent')
 
const getEpisodeContent = async (tmdbId, seasonNum, episodeNum) => {

    // Get series data
    let seriesData = await getSeriesContent(tmdbId)

    // Get episode data
    let episodeData = await tmdbEpisodeData(tmdbId, seasonNum, episodeNum)
 

    //  GET PREVIOUS AND NEXT EPISODES, IF ANY
    // find current episode in all aired episodes ranked
    function getCurrentEpIndex(item) {
        return item[0] === seasonNum && item[1] == episodeNum
    }


    let allAiredEpisodes = [...seriesData.allAiredEpisodes]
    let AllEpisodesRanked = allAiredEpisodes.sort((a, b) => b[0] - a[0]);
    let epIndex = AllEpisodesRanked.findIndex(getCurrentEpIndex)
    

    const getPrevEp = () => {
        if (AllEpisodesRanked[epIndex + 1]) {
            let prevEp = AllEpisodesRanked[epIndex + 1]
            let prevSlug = `/episode/${tmdbId}/${seriesData.slug}-${prevEp[0]}x${prevEp[1]}`
            return prevSlug
        } else {
            return false
        }
    }


    // Get NEXT EP LINK IF ANY
    function getNextEp() {
        if (AllEpisodesRanked[epIndex - 1]) {
            let prevEp = AllEpisodesRanked[epIndex - 1]
            let prevSlug = `/episode/${tmdbId}/${seriesData.slug}-${prevEp[0]}x${prevEp[1]}`
            return prevSlug
        } else {
            return false
        }
    }
    let perviousEpisode = getPrevEp()
    let nextEpisode = getNextEp()

    // Avoid errors in case no Episode data is returned from TMDB
    let epTitle = `S${seasonNum}E${episodeNum}`
    let epAirDate = '()'
    if (episodeData) {
        if (!(episodeData.name === '')) {
            epTitle = String(episodeData.name)
        } 
        epAirDate = episodeData.air_date
    }

    // Send all collected data to the RENDER page
    seriesData.epTitle = epTitle // EPISODE name
    seriesData.seasonNum = seasonNum // EPISODE Season Number
    seriesData.episodeNum = episodeNum // EPISODE Number
    seriesData.releaseDate = epAirDate // EPISODE release date
    seriesData.perviousEpisode = perviousEpisode // LINK to previous episode ('false' if none)
    seriesData.NextEpisode = nextEpisode // LINK to next episode ('false' if none)

    return seriesData
}

module.exports = getEpisodeContent;