
const getServers = async (params) => {

    let servers

    if (params.type === 'movie') {
        servers = [{ type: 'fsapi', url: `https://fsapi.xyz/tmdb-movie/${params.id}` },
        { type: '2embed', url: `https://www.2embed.ru/embed/tmdb/movie?id=${params.id}` },
            { type: 'moviehungershaven', url: `https://moviehungershaven.xyz/tplayer/npls1.php?id=${params.id}` }
        ]

    } else if (params.type === 'episode') {

        let slugSplit = params.slug.split('-');
        let seasonAndEpisode = slugSplit[slugSplit.length - 1].split('x');
        let seasonNum = parseInt(seasonAndEpisode[0]);
        let episodeNum = parseInt(seasonAndEpisode[1]);
        let episodeId = `${params.id}-${seasonNum}-${episodeNum}`

        servers = [{ type: 'fsapi', url: `https://fsapi.xyz/tv-tmdb/${params.id}-${seasonNum}-${episodeNum}` },
        { type: '2embed', url: `https://www.2embed.ru/embed/tmdb/tv?id=${params.id}&s=${seasonNum}&e=${episodeNum}` },
        { type: 'imdbapi', url: `https://imdbapi.xyz/tv/?c=${params.id}&sea=${seasonNum}&epi=${episodeNum}` }
        ]
    } 
    return servers.slice(0, 3)
}

module.exports = getServers;