
const createCard = (card) => {


  let categories = ''
  let BMclass
  let BMmessage
  let BMIcon

  if (card.bookmarks) {
    BMclass = 'removeWatchlist'
    BMmessage = 'Remove from Bookmarks'
    BMIcon = 'favorite'
  } else {
    BMclass = 'addWatchlist'
    BMmessage = 'Add to Bookmarks'
    BMIcon = 'favorite_border'
  }

  if (card.categories) {
    for (let category of card.categories) {
        categories += `<a href="/genre/${category.id}/${category.slug}">${category.name}</a>, `
    }
    }


  if (card.type === 'movie') {
    return `<div id='card-${card.id}' class="${card.classes}">
  <div class="info_section">
    <div class="movie_header">
      <a href="/${card.type}/${card.id}/${card.slug}">
      <img class="locandina" src="${card.imgSource}"/></a>
      <a href="/${card.type}/${card.id}/${card.slug}"><h2>${card.title}</h2></a>
      <h5>${card.releaseDate} - Movie</h5>
      <span class="minutes">${card.rating} /10</span>
      <p class="type">
        ${categories}
      </p>
    </div>
    <div class="movie_desc">
      <p class="text">
        ${card.summary}
      </p>
    </div>
    <div class="movie_social">
      <ul>
        <li><a href="/${card.type}/${card.id}/${card.slug}">
        <span 
        class="material-icons watch-movie-icon"
        data-bs-toggle="tooltip"
        data-bs-placement="bottom"
        title="Watch Now">play_circle_filled</span></a></li>
        <li>
          <span
          class="material-icons trailer-icon trailer-${card.type}"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          tmdb="${card.id}"
          data-toggle="modal"
          data-target="#modal${card.id}"
          title="Watch Trailer">theaters</span></li>
        <li>
          <span
          id="watchlistButton${card.id}"
          watchlist='${card.WLinfo}'
          tmdb="${card.id}"
          class="material-icons fav-icon ${BMclass}"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          title="${BMmessage}">${BMIcon}</span></li>
      </ul>
    </div>
  </div>
  <div class="blur_back" style="
  background: url(${card.backdrop}) no-repeat"></div>
</div>
<div
  class="modal fade"
  id="modal${card.id}"
  tabindex="-1"
  role="dialog"
  aria-labelledby="myModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
      <div  id='body-${card.id}' class="modal-body mb-0 p-0">
      </div>
    </div>
  </div>
</div>`
  } else if (card.type === 'series') {
    return `<div id='card-${card.id}' class="${card.classes}" >
  <div class="info_section">
    <div class="movie_header">
      <a href="/${card.type}/${card.id}/${card.slug}">
      <img class="locandina" src="${card.imgSource}"/></a>
      <a href="/${card.type}/${card.id}/${card.slug}"><h2>${card.title}</h2></a>
      <h5>${card.releaseDate} - Series</h5>
      <span class="minutes">${card.rating} /10</span>
      <p class="type">
        ${categories}
      </p>
    </div>
    <div class="movie_desc">
      <p class="text">
        ${card.summary}
      </p>
    </div>
    <div class="movie_social">
      <ul>
        <li><a href="/${card.type}/${card.id}/${card.slug}"><span
        class="material-icons watch-series-icon"
        data-bs-toggle="tooltip"
        data-bs-placement="bottom"
        title="Watch Now">play_circle_filled</span></a></li>
        <li>
          <span
          class="material-icons random"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          tmdb="${card.id}"
          title="Random Episode">shuffle</span></li>
        <li>
          <span
          class="material-icons trailer-icon trailer-${card.type}"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          tmdb="${card.id}"
          data-toggle="modal"
          data-target="#modal${card.id}"
          title="Watch Trailer">theaters</span></li>
        <li>
          <span
          id="watchlistButton${card.id}"
          watchlist='${card.WLinfo}'
          tmdb="${card.id}"
          class="material-icons fav-icon ${BMclass}"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          title="${BMmessage}">${BMIcon}</span></li>
      </ul>
    </div>
  </div>
  <div class="blur_back" style="
  background: url(${card.backdrop}) no-repeat"></div>
</div>
<div
  class="modal fade"
  id="modal${card.id}"
  tabindex="-1"
  role="dialog"
  aria-labelledby="myModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
      <div  id='body-${card.id}' class="modal-body mb-0 p-0">
      </div>
    </div>
  </div>
</div>`

  } else if (card.type === 'person') {
    return `<div id='card-${card.id}' class="${card.classes}" >
  <div class="info_section">
    <div class="movie_header">
      <a href="/${card.type}/${card.id}/${card.slug}">
      <img class="locandina" src="${card.imgSource}"/></a>
      <a href="/${card.type}/${card.id}/${card.slug}"><h2>${card.title}</h2></a>
      <h5>Known for: ${card.job}</h5>
    </div>
    <div class="movie_desc">
    </div>
    <div class="movie_social">
      <ul>
        <li><a href="/filmography/${card.id}/${card.slug}"><span class="material-icons">movie</span></a></li>
        <li>
          <span
          id="watchlistButton${card.id}"
          watchlist='${card.WLinfo}'
          tmdb="${card.id}"
          class="material-icons fav-icon ${BMclass}"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          title="${BMmessage}">${BMIcon}</span></li>
      </ul>
    </div>
  </div>
  <div class="blur_back" style="
  background: url(${card.backdrop})"></div>
</div>
<div
  class="modal fade"
  id="modal${card.id}"
  tabindex="-1"
  role="dialog"
  aria-labelledby="myModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
      <div  id='body-${card.id}' class="modal-body mb-0 p-0">
      </div>
    </div>
  </div>
</div>`
    }
    return card
}

export default createCard