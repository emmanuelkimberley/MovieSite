const { slugify, getBannerBackdrop, getPoster } = require('./dataProcessing')

const parseForPerson = async (item) => {

    item.media_type = 'person'

    let allCredits = []

    let foundIndex = (credit) => {
        return allCredits.findIndex(el => el.id === credit.id);
    }


    item.movie_credits.cast.map((credit) => {
        credit.media_type = 'movie'
        credit.job = 'Actor'
        let creditIndex = foundIndex(credit)
        if (creditIndex < 0) {
            allCredits.push(credit)
        } else {
            allCredits[creditIndex].job += `, ${credit.job}`
        }
        
        return item
    })

    item.movie_credits.crew.map((credit) => {
        credit.media_type = 'movie'
        let creditIndex = foundIndex(credit)
        if (creditIndex < 0) {
            allCredits.push(credit)
        } else {
            allCredits[creditIndex].job += `, ${credit.job}`
        }
        return item
    })

    item.tv_credits.cast.map((credit) => {
        credit.media_type = 'tv'
        credit.job = 'Actor'
        let creditIndex = foundIndex(credit)
        if (creditIndex < 0) {
            allCredits.push(credit)
        } else {
            allCredits[creditIndex].job += `, ${credit.job}`
        }
        return item
    })

    item.tv_credits.crew.map((credit) => {
        credit.media_type = 'tv'
        let creditIndex = foundIndex(credit)
        if (creditIndex < 0) {
            allCredits.push(credit)
        } else {
            allCredits[creditIndex].job += `, ${credit.job}`
        }
        return item 
    })

    // Send all collected data to the RENDER page
    personData = {
        'id': item.id,
        'type': 'person',
        'name': item.name,
        'slug': slugify(item.name),
        'backdropSource': getBannerBackdrop(item),
        'imgSource': getPoster(item),
        'birthday': item.birthday,
        'deathday': item.deathday,
        'biography': item.biography,
        'website': item.homepage,
        'known_for': item.known_for_department,
        'place_of_birth': item.place_of_birth,
        'allCredits': allCredits,

    }
    
    return personData
}

module.exports = parseForPerson;