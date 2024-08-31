const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const apiKey = process.env.API_KEY;
    console.log('API_KEY:', apiKey); // Verifica que la clave se esté cargando

    let url;
    try {
        if (event.queryStringParameters && event.queryStringParameters.url) {
            url = event.queryStringParameters.url;
        } else {
            const urlDiscover = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc';
            const numberPage = 'page=1';
            const language = '&language=es-MX';
            const urlFirstPage = `${urlDiscover}&api_key=${apiKey}${language}&${numberPage}`;
            url = urlFirstPage;
        }
    } catch (error) {
        console.error('Error parsing URL:', error.message);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid request URL', error: error.message }),
        };
    }

    try {
        console.log('Fetching URL:', url);
        const res = await fetch(url);
        if (!res.ok) {
            console.error('Fetch error:', res.status, res.statusText);
            throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching data', error: error.message }),
        };
    }
};
