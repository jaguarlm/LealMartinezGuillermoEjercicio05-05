let currentPageUrl = 'https://pokeapi.co/api/v2/pokemon?limit=20';

function fetchPokemon(url) {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        mostrarPokemon(data.results);
        actualizarBotones(data.previous, data.next);
    })
    .catch(error => console.error('Error fetching data:', error));
}
fetchPokemon(currentPageUrl);

function mostrarPokemon(pokemonList) { 
    const listElement = document.getElementById('lista-pokemon'); 
    listElement.innerHTML = '';
    pokemonList.forEach(pokemon => {
        const id = pokemon.url.split('/').filter(Boolean).pop(); // Se obtiene el ID del Pokémon
        const row = document.createElement('tr'); // Se crea una fila para el Pokémon
        const idCell = document.createElement('td'); // Se crea una celda para el ID
        idCell.textContent = id; // Se agrega el ID a la celda
        const nameCell = document.createElement('td'); // Se crea una celda para el nombre
        const link = document.createElement('a'); // Se crea un enlace para el nombre
        link.href = '#'; // Se agrega un href al enlace
        link.textContent = pokemon.name; // Se agrega el nombre al enlace
        link.onclick = (event) => { 
            event.preventDefault(); // Evitar que el enlace siga el href
            cargarDetallesPokemon(id); // Cargar los detalles del Pokémon
        }; 
        nameCell.appendChild(link); // Se agrega el enlace a la celda
        row.appendChild(idCell); // Se agrega la celda del ID a la fila
        row.appendChild(nameCell); // Se agrega la celda del nombre a la fila
        listElement.appendChild(row);   // Se agrega la fila a la tabla
    });
}
function actualizarBotones(prevUrl, nextUrl) {
    const backButton = document.querySelector('button[onclick="cambiarPagina(-1)"]');
    const nextButton = document.querySelector('button[onclick="cambiarPagina(1)"]');

    backButton.onclick = () => prevUrl && fetchPokemon(prevUrl);
    nextButton.onclick = () => nextUrl && fetchPokemon(nextUrl);

    backButton.disabled = !prevUrl;
    nextButton.disabled = !nextUrl;
}

function cambiarPagina(change) {
    const currentUrl = new URL(currentPageUrl);
    const currentParams = currentUrl.searchParams;
    let currentPage = parseInt(currentParams.get('offset') || '0');
    let newPage = currentPage + (change * 20);
    if (newPage < 0) newPage = 0;

    currentParams.set('offset', newPage.toString());
    fetchPokemon(currentUrl.href);
}

function cargarDetallesPokemon(pokemonId) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const infoDiv = document.getElementById('pokemon-info'); // Se obtiene el div donde se mostrará la información
        infoDiv.innerHTML = `<h1>${data.name}</h1>
                             <img src="${data.sprites.front_default}" alt="${data.name}"> <!-- Se agrega la imagen del Pokémon -->
                             <p>Experiencia base: ${data.base_experience}</p> <!-- Se agrega la experiencia base -->
                             <p>Altura: ${data.height} decímetros</p> <!-- Se agrega la altura -->
                             <p>Peso: ${data.weight} hectogramos</p>`; // Se agrega el peso
    })
    .catch(error => {
        console.error('Error al cargar datos del Pokémon:', error);
    });
}