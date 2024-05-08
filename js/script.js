document.getElementById('searchButton').addEventListener('click', searchMovies)

let api_key = '0e927052ecbcd7591d0506b82bbbae63'
let urlBase = 'https://api.themoviedb.org/3/search/movie'
let urlImg = 'https://image.tmdb.org/t/p/w200'
let resultConteiner = document.getElementById('results')
    
function searchMovies(){
    resultConteiner.innerHTML = 'Cargando...'
    let searchInput = document.getElementById('searchInput').value
    fetch(`${urlBase}?api_key=${api_key}&query=${searchInput}`)
    .then(response => response.json())
    .then(response => displayMovies(response.results))
}

function displayMovies(movies){
    
    resultConteiner.innerHTML = ''

    if(movies.length === 0){
        resultConteiner.innerHTML = '<p>No se encontraron peliculas relacionadas con tu busqueda </p>'
        return
    }

    movies.forEach(movie => {
        let movieDiv = document.createElement('div') 
        movieDiv.classList.add('movie')

        let title = document.createElement('h2')
        title.textContent = movie.title

        let release_date = document.createElement('p')
        release_date.textContent = 'La fecha de lamzamiento fue: ' + movie.release_date

        let overview = document.createElement('p')
        overview.textContent = movie.overview
        
        let poster_path = urlImg + movie.poster_path
        let poster = document.createElement('img')
        poster.src = poster_path
        
        movieDiv.appendChild(poster)
        movieDiv.appendChild(title)
        movieDiv.appendChild(release_date)
        movieDiv.appendChild(overview)

        resultConteiner.appendChild(movieDiv)
        
    })

    
}
