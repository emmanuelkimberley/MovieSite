
const notFound = '/static/notFound.jpg'
const logoLink = 'https://image.tmdb.org/t/p/w92'
const posterLink = 'https://image.tmdb.org/t/p/w500'
const cardBackdropLink = 'https://image.tmdb.org/t/p/w780'
const bannerBackdropLink = 'https://image.tmdb.org/t/p/w1280'

const isInTheFuture = (date) => {
    if (date) {
        let today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let released = new Date(date);
        return (released > yesterday)
    } else {
        return true
    }
}

const getLogo = (item) => {
    let logo = logoLink + item.logo_path
    return logo
}

const getFinancials = (number) => {

    // FORMAT BUDGET AND REVENUE FOR EXTRA-INFO CARD
    // Create the number to USD formatter.
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    });

    let usdValue
    if (parseInt(number) === 0) {
        usdValue = 'No Data'
    } else {
        usdValue = formatter.format(parseInt(number)).split('.')[0]
    }

    return usdValue
}

const getPoster = (item) => {
    let imgSource
    if (item.media_type === 'person') {
        if (!item.profile_path) {
            imgSource = notFound
        } else {
            imgSource = posterLink + item.profile_path
        }
    } else {
        if (!item.poster_path) {
            imgSource = notFound
        } else {
            imgSource = posterLink + item.poster_path
        }
    }

    return imgSource
}

const getCardBackdrop = (item) => {

    let backdrop
    if (item.media_type === 'person') {
        backdrop = '/static/actors.jpg'
    } else {
        if (!item.poster_path) {
            backdrop = '/static/altBackdrop.jpg'
        } else {
            if (!item.backdrop_path) {
                backdrop = cardBackdropLink + item.poster_path
            } else {
                backdrop = cardBackdropLink + item.backdrop_path
            }
                
        }
    }

    return backdrop
}

const getBannerBackdrop = (item) => {

    let backdrop
    if (item.media_type === 'person') {
        backdrop = '/static/actors.jpg'
    } else {
        if (!item.poster_path) {
            backdrop = '/static/altBackdrop.jpg'
        } else {
            if (!item.backdrop_path) {
                backdrop = bannerBackdropLink + item.poster_path
            } else {
                backdrop = bannerBackdropLink + item.backdrop_path
            }

        }
    }

    return backdrop
}


const getAllAiredEpisodes = (rawData) => {

    let allEpisodes = []
    for (let season of rawData.seasons) {
        if ((season.season_number !== 0) && (season.air_date)) {
            let season_number = season.season_number;
            let season_episode_count = season.episode_count;

            for (let episode_number = season_episode_count; episode_number > 0; episode_number--) {
                allEpisodes.push([season_number, episode_number])
            };

        }
    }

    // Get ALL AIRED EPISODES IN A DESC LIST
    let allAiredEp = [];
    const latestSeason = rawData.last_episode_to_air.season_number;
    const latestEpisode = rawData.last_episode_to_air.episode_number;
    allEpisodes.reverse().forEach(element => {
        if (element[0] == latestSeason) {
            if (element[1] <= latestEpisode) {
                allAiredEp.push([element[0], element[1]])
            }
        } else { allAiredEp.push([element[0], element[1]]) }
    });

    return allAiredEp

}

const removeDoubles = (list) => {
    let uniqueList = [];
    for (let item of list) {
        let isPresent = uniqueList.some((el) => el.id === item.id);
        if (!isPresent) { uniqueList.push(item) }
    }
    return uniqueList
}

function isInWatchList(id) {
    // check if card is in the watchList
    let localStorageItems = Object.keys(localStorage)
    let isInWatchlist = localStorageItems.find((e) => {
        return e == id
    })

    return isInWatchlist
}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}




const slugify = (string) => {
    let urlFriendlyString = ""

    // Initial clean up.
    string = string
        // Remove spaces from start and end.
        .trim()
        // Changes all characters to lower case.
        .toLowerCase()
        // Remove symbols with a space.
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g, " ")

    // Special characters and the characters they will be replaced by.
    const specialCharacters = "àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœṕŕßśșțùúüûǘẃẍÿź"
    const replaceCharacters = "aaaaaaaaceeeeghiiiimnnnoooooprssstuuuuuwxyz"
    // Creates a regular expression that matches all the special characters
    // from the specialCharacters constant. Will make something like this:
    // /à|á|ä/g and matches à or á or ä...
    const specialCharactersRegularExpression = new RegExp(
        specialCharacters.split("").join("|"),
        "g"
    )
    // Replaces special characters by their url friendly equivalent.
    string = string
        .replace(
            specialCharactersRegularExpression,
            matchedCharacter => replaceCharacters.charAt(
                specialCharacters.indexOf(matchedCharacter)
            )
        )
        .replace(/œ/g, "oe")

    // Only keeps Arabic, English and numbers in the string.
    const arabicLetters = "ىشغظذخثتسرقضفعصنملكيطحزوهدجبأاإآلإلألآؤءئة"
    const englishLetters = "abcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    for (let character of string) {
        if (character === " ") {
            urlFriendlyString += character
            continue
        }
        const characterIsURLFriendly = Boolean(
            arabicLetters.includes(character) ||
            englishLetters.includes(character) ||
            numbers.includes(character)
        )
        if (characterIsURLFriendly) urlFriendlyString += character
    }

    // Clean up before text direction algorithm.
    // Replace multiple spaces with one space.
    urlFriendlyString = urlFriendlyString.replace(/\s+/g, "-")

    // Regular expression that matches strings that have
    // right to left direction.
    const isRightToLeft = /[\u0590-\u05ff\u0600-\u06ff]/u
    // Makes an array of all the words in urlFriendlyString
    let words = urlFriendlyString.split("-")

    // Checks if urlFriendlyString is a unidirectional string.
    // Makes another array of boolean values that signify if
    // a string isRightToLeft. Then basically checks if all
    // the boolean values are the same. If yes then the string
    // is unidirectional.
    const stringIsUnidirectional = Boolean(
        words
            .map(word => isRightToLeft.test(word))
            .filter((isWordRightToLeft, index, words) => {
                if (isWordRightToLeft === words[0]) return true
                else return false
            })
            .length === words.length
    )

    // If the string is unidirectional, there is no need for
    // it to pass through our bidirectional algorithm.
    if (stringIsUnidirectional) {
        return urlFriendlyString
            // Replaces multiple hyphens by one hyphen
            .replace(/-+/g, "-")
            // Remove hyphen from start.
            .replace(/^-+/, "")
            // Remove hyphen from end.
            .replace(/-+$/, "")
    }

    // Reset urlFriendlyString so we can rewrite it in the
    // direction we want.
    urlFriendlyString = ""
    // Add U+202B "Right to Left Embedding" character to the
    // start of the words array.
    words.unshift("\u202B")
    // Loop throught the values on the word array.
    for (let word of words) {
        // Concatinate - before every word (the first one will
        // be cleaned later on).
        urlFriendlyString += "-"
        // If the word isn't right to left concatinate the "Right
        // to Left Embedding" character before the word.
        if (!isRightToLeft.test(word)) urlFriendlyString += `\u202B${word}`
        // If not then just concatinate the word.
        else urlFriendlyString += word
    }

    return urlFriendlyString
        // Replaces multiple hyphens by one hyphen.
        .replace(/-+/g, "-")
        // Remove hyphen from start.
        .replace(/^-+/, "")
        // Remove hyphen from end.
        .replace(/-+$/, "")
        // The character U+202B is invisible, so if it is in the start
        // or the end of a string, the first two regular expressions won't
        // match them and the string will look like it still has hyphens
        // in the start or the end.
        .replace(/^\u202B-+/, "")
        .replace(/-+\u202B$/, "")
        // Removes multiple hyphens that come after U + 202B
        .replace(/\u202B-+/, "")
}




module.exports = {
    isInTheFuture: isInTheFuture,
    removeDoubles: removeDoubles,
    getFinancials: getFinancials,
    getLogo: getLogo,
    getPoster: getPoster,
    getCardBackdrop: getCardBackdrop,
    getBannerBackdrop: getBannerBackdrop,
    shuffle: shuffle,
    isInWatchList: isInWatchList,
    getAllAiredEpisodes: getAllAiredEpisodes,
    slugify: slugify
};