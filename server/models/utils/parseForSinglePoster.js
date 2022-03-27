const { getPoster, slugify } = require('./dataProcessing')
const parseForSingleCard = require('./parseForSingleCard')

const parseForSinglePoster = async (item) => {

    let poster
    let releaseYear
    let watchListInfo = await parseForSingleCard(item)

    try {
        let title
        let type
        if ((item.media_type === 'movie')) {
            type = 'movie'
            releaseYear = item.release_date.split('-')[0]
            title = item.title
        } else {
            type = 'series'
            releaseYear = item.first_air_date.split('-')[0]
            title = item.name
        }

        let posterImg = await getPoster(item)
        poster = {
            'type': type,
            'id': item.id,
            'posterImg': posterImg,
            'title': String(title),
            'slug': slugify(title),
            'releaseYear': releaseYear,
            'WLinfo': watchListInfo.WLinfo
        }
        
    } catch (err) {
        console.log(err.message);
    }

    return poster
}

module.exports = parseForSinglePoster;