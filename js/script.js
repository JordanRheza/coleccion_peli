const resultConteiner = document.getElementById('results');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const urlImg = 'https://image.tmdb.org/t/p/w500'; // Define la URL base para las imágenes

searchButton.addEventListener('click', searchMovie);

const url = '.netlify/functions/fetchData';

// Cargar películas populares al inicio
getMovies();

// Función asíncrona para obtener las películas
async function getMovies() {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        showMovies(data.results);
    } catch (error) {
        console.error('Error fetching data:', error);
        resultConteiner.innerHTML = `<p>Error al cargar las películas.</p>`;
    }
}

// Función para crear el elemento HTML de una película
function createMovieElement(movie) {
    const { id, title, backdrop_path, release_date, vote_average, overview } = movie;

    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie');

    const imgSrc = backdrop_path ? `${urlImg + backdrop_path}` : 'https://th.bing.com/th/id/OIP.H1gHhKVbteqm1U5SrwpPgwAAAA?rs=1&pid=ImgDetMain';
    const date = release_date ? `Estreno: ${release_date}` : 'Fecha desconocida';
    movieDiv.innerHTML = `
        <img src="${imgSrc}" alt="${title}" />
        <div class="movie-info">
            <h3>${title}</h3>
            <p>${date}</p>
            <button class="play-button">Play</button>
        </div>
    `;
    // Agregar el evento de clic al botón Play
    movieDiv.querySelector('.play-button').addEventListener('click', function () {
        openModal(id, overview, vote_average);
    });
    
    return movieDiv;
}

// Función para mostrar las películas
function showMovies(movies) {
    resultConteiner.innerHTML = '';
    movies.forEach(movie => {
        const movieElement = createMovieElement(movie);
        resultConteiner.appendChild(movieElement);
    });
}

// Función para buscar películas 
function searchMovie() {
    const searchTerm = searchInput.value.trim();

    if (searchTerm === '') {
        getMovies();
    } else {
        performSearch(searchTerm);
    }
}

// Función para realizar la búsqueda en la API
function performSearch(search) {
    fetch(`/.netlify/functions/fetchData?url=https://api.themoviedb.org/3/search/movie?api_key=${apiKey}${language}&query=${search}`)
        .then(response => {
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            return response.json();
        })
        .then(response => showMovies(response.results))
        .catch(error => {
            console.error('Error fetching search results', error);
            resultConteiner.innerHTML = `<p>Error al buscar películas</p>`;
        });
}

/* MODAL */
// Obtener el modal
const modal = document.getElementById('myModal');
const span = document.getElementsByClassName('close')[0];

function openModal(movieId, movieDescription, vote) {
    const modalBody = document.getElementById('modal-body');
    const rating = vote.toFixed(2);

    fetch(`/.netlify/functions/fetchData?url=https://api.themoviedb.org/3/movie/${movieId}/videos?${language}&api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const video = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

            if (video) {
                modalBody.innerHTML = `
                    <h2>Tráiler</h2>
                    <iframe width="100%" height="315" src="https://www.youtube.com/embed/${video.key}" frameborder="0" allowfullscreen></iframe>
                    <div class="trailer-info">
                        <h3>Descripción</h3>
                        <p>${movieDescription}</p>
                        <p>Calificación: <span class="${getClassByRate(rating)}">${rating}</span></p>
                    </div>
                `;
            } else {
                modalBody.innerHTML = `
                    <p>Tráiler no disponible.</p>
                    <h3>Descripción</h3>
                    <p>${movieDescription}</p>
                `;
            }

            modal.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching trailer:', error);
            modalBody.innerHTML = `
                <p>Error al cargar el tráiler.</p>
                <h3>Descripción</h3>
                <p>${movieDescription}</p>
            `;
            modal.style.display = 'block';
        });
}

function getClassByRate(vote) {
    if(vote >= 8) return 'green';
    else if(vote >= 5) return 'orange';
    else return 'red';
}

// Cerrar el modal cuando se haga clic en <span> (x)
span.onclick = function() {
    closeModal();
}

// Cerrar el modal cuando el usuario haga clic fuera del modal
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Función para cerrar el modal y detener el tráiler
function closeModal() {
    modal.style.display = 'none';
    document.getElementById('modal-body').innerHTML = '';
}
