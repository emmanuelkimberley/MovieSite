const { getPoster, slugify } = require('./dataProcessing')
const parseForSingleCard = require('./parseForSingleCard')

const parseForPoster = async (rawData) => {
    results = []

    for (let item of rawData) {

        let watchListInfo = await parseForSingleCard(item)

        try {
            let title
            let type
            let releaseYear
            if (item.media_type === 'movie') {
                type = 'movie'
                releaseYear = item.release_date.split('-')[0]
                title = item.title
            } else {
                type = 'series'
                releaseYear = item.first_air_date.split('-')[0]
                title = item.name
            }

            let posterImg = getPoster(item)
            results.push({
                'type': type,
                'id': item.id,
                'posterImg': posterImg,
                'title': String(title),
                'slug': slugify(title),
                'releaseYear': releaseYear,
                'WLinfo': watchListInfo.WLinfo
            })
            
        } catch (err) {
            console.log(err.message);
        }
    };

    return results
}

module.exports = parseForPoster;