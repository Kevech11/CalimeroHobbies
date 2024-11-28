const loginBtn = document.getElementById("loginBtn")
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")
const apiURL = 'https://restcountries.com/v3.1/all';

if (loginBtn) {
    if (window.localStorage.getItem("user")) {
        loginBtn.innerHTML = `<a class="btn btn-primary" onclick='window.localStorage.removeItem("user"); window.location.reload();'>Cerrar sesion</a>`
    } else {
        loginBtn.innerHTML = `<a href="/login" class="btn btn-primary">Iniciar sesion</a>`
    }
}

function redireccionarAlBuscar() {
    const term = searchInput.value
    window.location.href = `/Productos?search=${term}`
}

searchBtn.addEventListener("click", redireccionarAlBuscar)
searchInput.addEventListener("keypress", (e) => {
    console.log(e.key)
    if (e.key === "Enter") {
        redireccionarAlBuscar()
    }
})


async function cargarPaises() {
    try {
        const response = await fetch(apiURL);
        const countries = await response.json();

        const selectPais = document.getElementById('pais');

        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.name.common;
            option.textContent = country.name.common;
            selectPais.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los países:', error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    cargarPaises();
});