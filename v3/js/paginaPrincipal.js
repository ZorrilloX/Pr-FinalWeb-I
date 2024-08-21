/*
    Funcionalidades para la gestión de cursos en la página. Incluye:
    - Inserción y visualización de elementos de curso.
    - Matriculación y marcado de cursos como favoritos.
    - Carga y filtrado de categorías y cursos desde la API.
    - Manejo de cookies para personalizar la interfaz.
    - Búsqueda de cursos basada en palabras clave.
*/

function insertElementos(className, htmlStrings) {
    const parentElement = document.querySelector(`.${className}`);

    parentElement.innerHTML = htmlStrings.join('');
}

function mostrarCursos (cursos) {
    const cursosElem = cursos.map(curso => {

        return `<li>
                    <img src="img/cursosPortadas/${curso.imgportada}" alt="imagen referencia">
                    <div class="_c_v_datos">
                        <h3><a class="_c_v_title" href="html/2_curso_data.html?id=${curso.id}">
                            ${curso.titulo}</a></h3>
                        <a class="_c_v_user" style="color: rgb(128, 64, 128)"><i class="fas fa-user"></i>${curso.profesional}</a>
                        <div class="_c_v_cont_text">
                            <p>
                            ${curso.descripcion}
                            </p>
                        </div>
                        <a class="_c_v_cont_text" style="color: black">${categorias
                            .filter(cat => cat.id == `${curso.categoria_id}`)[0].nombre}</a>
                        ${misCursosIds 
                            ? (!misCursosIds.includes(curso.id) 
                                ? `<button class="_b_l_help" onclick="matricularCurso(${curso.id})">Matricular</button>` 
                                : "") 
                            : ""}
                        ${misFavoritosIds 
                            ? (misFavoritosIds.includes(curso.id) 
                                ? `<p style="color: white; background-color: rgb(61, 203, 177);width: min-content" class="_c_v_user">FAVORITO</p>` 
                                : `<button class="_b_l_help" onclick="cursoFavorito(${curso.id})">Marcar Favorito</button>`) 
                            : ""}
                    </div>
                </li>`;
    });
    insertElementos("_cursos_videos", cursosElem)
}

async function matricularCurso (id) {
    try {

        const datosPeticion = {idUsuario: document.cookie.split(';')[0].trim().split('=')[1]}
        const res = await fetch(`http://localhost:3000/cursos/matricular-curso/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPeticion)
        });

        if (res.ok) {
            alert(`¡Curso ${id} matriculado!`)
            window.location.reload()
        }
        else {
            alert(`Error al matricular curso ${id}`)
        }
    } catch (err) {
        alert(`Error: ${err}`)
    }
}

async function cursoFavorito (cursoId) {
    try {

        const datosPeticion = {
            idUsuario: document.cookie.split(';')[0].trim().split('=')[1],
            esFavorito: true,
            visto: false,
        }
        const res = await fetch(`http://localhost:3000/cursos/actualizar-curso/${cursoId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPeticion)
        });

        if (res.ok) {
            alert(`¡Curso ${cursoId} es favorito!`)
            window.location.reload()
        }
        else {
            alert(`Error al cambiar curso ${cursoId}`)
        }
    } catch (err) {
        alert(`Error: ${err}`)
    }
}

let categorias;

async function loadCategorias () {
    try {
        const res = await fetch('http://localhost:3000/cursos/categorias/', {
            method: 'GET'
        });

        const result = await res.json()
        if (res.ok) {
            categorias = result.categorias;

            const elemsCategorias = categorias.map(cat => {
                return `<h3 style="min-width: 160px; width: auto; padding: 10px 10px">
                            <a href="#" onclick="filtrarCursos('${cat.nombre}')">
                            ${cat.nombre.toUpperCase()}
                            </a></h3>`;
            });

            insertElementos('_cursos_botones', elemsCategorias)
        } else {
            alert(`Error: ${result.error}`)
        }
    } catch (err) {
        alert(`Error: ${err.message}`)
    }
}

let cursos;

async function loadCursos () {
    try {

        const datosPeticion = {
            tipoUsuario: document.cookie && document.cookie.split(';')[2].trim().split('=')[1]
        }
        const res = await fetch('http://localhost:3000/cursos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPeticion)
        });

        const result = await res.json()
        if (res.ok) {
            cursos = result.cursos;
            console.log('Cursos cargados:', cursos);
            mostrarCursos(cursos);

        } else {
            alert(`Error: ${result.error}`)
        }
    } catch (err) {
        alert(`Error: ${err.message}`)
    }
}

let misCursosIds;
let misFavoritosIds;
async function loadMisCursos () {
    try {

        const datosPeticion = { idUsuario: document.cookie.split(';')[0].trim().split('=')[1] }
        const res = await fetch('http://localhost:3000/cursos/mis-cursos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPeticion)
        });

        const result = await res.json()
        if (res.ok) {
            misCursosIds = result.cursos.map(curso => {
                return curso.curso_id
            });
            misFavoritosIds = result.cursos.filter(curso => curso.esfavorito).map(c => c.curso_id)

        } else {
            alert(`Error: ${result.error}`)
        }
    } catch (err) {
        alert(`Error: ${err.message}`)
    }
}

loadCategorias().then(res => console.log("Cargadas las categorias."));
if (document.cookie) {
    loadMisCursos().then(_ => console.log("Cargados mis cursos."))
}
loadCursos().then(res => console.log("Cargados los cursos."));

function filtrarCursos (tipo) {
    const categoriaId = categorias.filter(cat => cat.nombre === tipo)[0].id
    const filteredCursos = cursos.filter(curso => curso.categoria_id == categoriaId)
    mostrarCursos(filteredCursos);
}

function buscarCursos (palabra) {
    const filteredCursos = cursos.filter(curso => curso.titulo.toLowerCase().includes(palabra.toLowerCase()))
    mostrarCursos(filteredCursos);
}

document.getElementById('busc-form').addEventListener('submit',  (event) => {
    event.preventDefault()

    const minLargoRegex = /^[a-zA-Z0-9]{0,}$/;

    const palabra = document.getElementById('busqueda').value
    if (minLargoRegex.test(palabra)) {
        buscarCursos(palabra)
    } else {
        alert('Error: Busqueda con palabra muy corta o con caracteres no-alfanumericos.')
    }
})

if (document.cookie) {
    document.getElementById('to-mis-cursos').innerHTML = '<a href="html/3_login.html">Mis Cursos</a>'

    if (document.cookie.split(';')[2].trim().split('=')[1] === 'administrador') {
        document.getElementById('nombre-admin').innerHTML =
            `<a href="./html/5.html">${document.cookie.split(';')[1].trim().split('=')[1]}</a>`
    }

    document.getElementById('inicio-sesion-btn').style.display = 'none'
    document.getElementById('signup-sesion-btn').innerHTML = 'Cerrar Sesión'
}
else {
    document.getElementById('to-mis-cursos').style.display = 'none'
}

/*
<h3><a href="#" onclick="filtrarCursos('popular')">POPULARES</a></h3>
                <h3><a href="#" onclick="filtrarCursos('nuevo')">NUEVOS</a></h3>
                <h3><a href="#" onclick="filtrarCursos('basico')">BÁSICO</a></h3>
                <h3><a href="#" onclick="filtrarCursos('intermedio')">INTERMEDIO</a></h3>
                <h3><a href="#" onclick="filtrarCursos('avanzado')">AVANZADO</a></h3>
 */

