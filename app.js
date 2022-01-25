let DB;
let urlImagen = '';
const divGatos = document.querySelector('.imagenesGatos')
const btnGato = document.querySelector('#otroGato');
const btnGuardarGato = document.querySelector('#guardarGato');

btnGato.addEventListener('click', consultarAPI);
btnGuardarGato.addEventListener('click', agregarGato);

document.addEventListener('DOMContentLoaded', function () {
    consultarAPI();
    crearDB();
    conectarDB();
})


function consultarAPI() {
    const urlAPI = 'https://api.thecatapi.com/v1/images/search';

    mostrarSpinner()
    fetch(urlAPI)
        .then(respuestaAPI => respuestaAPI.json())
        .then(datosAPI => {
            urlImagen = datosAPI[0].url;
            mostrarGatos(urlImagen);
        });
}

function cambiarGato() {
    fetch(urlAPI)
        .then(respuestaAPI => respuestaAPI.json())
        .then(datosAPI => {
            urlImagen = datosAPI[0].url;
            mostrarGatos(urlImagen);
        });
}

function mostrarGatos(imagenGato) {
    divGatos.innerHTML = `
        <img src="${imagenGato}">
    `
}

function limpiarHTML() {
    while (divGatos.firstChild) {
        divGatos.removeChild(divGatos.firstChild)
    }
}

function mostrarSpinner() {
    limpiarHTML()
    const spinner = document.createElement('DIV')
    spinner.classList.add('spinner')
    spinner.innerHTML = `
        <div class="dot1"></div>
        <div class="dot2"></div>
    `
    divGatos.appendChild(spinner)
}

// Bases de datos (IndexedDB)
function crearDB() {
    const crearDB = window.indexedDB.open('GATOS', 2)

    crearDB.onerror = function () {
        console.log('Hubo un error');
    }

    crearDB.onsuccess = function () {
        DB = crearDB.result;
    }

    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore('GATOS', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('imagen', 'imagen', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });

        console.log('Lista y Creada La DB');
    }
}

function conectarDB() {
    const abrirConexion = window.indexedDB.open('GATOS', 2);

    abrirConexion.onerror = function () {
        console.log('Error');
    }
    abrirConexion.onsuccess = function() {
        DB = abrirConexion.result;
    }
}

function agregarGato() {
    // Leer url
    const urlGato = urlImagen;
    const divGatoAgregado = document.createElement('DIV');
    divGatoAgregado.innerHTML = `
        <img src="${urlGato}">
    `
    enviarGatoDB(urlGato);    
}

function enviarGatoDB(urlGato) {
    const transaction = DB.transaction('GATOS', 'readwrite');
    const objectStore = transaction.objectStore('GATOS')
    objectStore.add(gato)

    transaction.onerror = function () {
        console.log('Hay un error');
    }
    transaction.oncomplete = function () {
        console.log('Gato Agregado');
    }
}