/**
 * Este archivo maneja la carga y visualización de un curso específico y sus lecciones:
 * 
 * - `insertElementos`: Inserta una lista de cadenas HTML en un elemento con una clase específica.
 * - `obtenerQueryParams`: Extrae parámetros de la URL y los devuelve como un objeto.
 * - `loadCategorias`: Obtiene la lista de categorías de cursos desde el servidor.
 * - `loadMisCursos`: Obtiene la lista de cursos del usuario desde el servidor y guarda sus IDs.
 * - `loadCurso`: Carga los detalles de un curso específico, muestra el progreso del curso, las lecciones disponibles y actualiza la interfaz según si el usuario está logueado o no.
 * 
 * También configura la vista de acuerdo al estado de la sesión del usuario y los parámetros de la URL.
 */

function insertElementos(className, htmlStrings) {
    const parentElement = document.querySelector(`.${className}`);

    // Join all HTML strings into a single string and set it as innerHTML
    parentElement.innerHTML = htmlStrings.join('');
}

function obtenerQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const queryParams = {};
    for (const [key, value] of params.entries()) {
        queryParams[key] = value;
    }
    return queryParams;
}

let categorias;

async function loadCategorias() {
    try {
        const res = await fetch('http://localhost:3000/cursos/categorias/', {
            method: 'GET'
        });

        const result = await res.json()
        if (res.ok) {
            categorias = result.categorias;
        } else {
            alert(`Error: ${result.error}`)
        }
    } catch (err) {
        alert(`Error: ${err.message}`)
    }
}

let misCursosIds;
let misCursos;
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
            misCursos = result.cursos;
            misCursosIds = result.cursos.map(curso => {
                return curso.curso_id
            });
        } else {
            alert(`Error: ${result.error}`)
        }
    } catch (err) {
        alert(`Error: ${err.message}`)
    }
}

let curso;

async function loadCurso() {
    const params = obtenerQueryParams();
    //parametro para entrar por la seccion
    if (!params.id) {
        window.location.assign('/index.html')
        return
    }
    try {

        const datosPeticion = {
            tipoUsuario: document.cookie && document.cookie.split(';')[2].trim().split('=')[1]
        }
        const res = await fetch(`http://localhost:3000/cursos/${params.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPeticion)
        });


        const result = await res.json()
        if (res.ok) {
            console.log('Curso seleccionado:', result.curso);
        
            if (misCursos === undefined || misCursos.length === 0) { //compobacion si el usuario tiene cursos matriculados.

                curso = result.curso;
                document.getElementById('detalles-curso-img').style.width = '100%'
                document.getElementById('detalles-curso-img').innerHTML =
                    `<img src="../img/cursosPortadas/${curso.imgportada}" alt="portada - ${curso.titulo}">`
                document.getElementById('datos-progreso-container').style.display = 'none'
                document.getElementById('detalles-curso-descr').innerHTML =
                    `<h1>${curso.titulo}</h1>
                    <div class="curso-contenido">
                        <div class="curso-detalles">
                            <h3>Descripción</h3>
                            ${curso.descripcion}
                        </div>
                    </div>`
            }
            else {
                console.log('Mis cursos:', misCursos);
                misCursos.forEach(c => {
                    let countLeccVistas = 1;
                    c.lecciones.forEach(leccion => {
                        if (leccion.vista) {
                            countLeccVistas += 1;
                        }
                    });
                    c.progreso = c.lecciones.length ? countLeccVistas / c.lecciones.length : 0;
                });
                curso = misCursos.filter(c => c.curso_id == result.curso.id)[0];

                const leccionesVistas = curso.lecciones
                    .filter(lecc => lecc.vista);
                console.log('Lecciones vistas:', leccionesVistas);
                let lastLeccion;
                let elementoAvance;
                /*
                - si no tiene lecciones -> no muestra boton
                - si tiene una leccion -> ver si es vista y asignarla
                - si tiene lecciones pero no vistas -> primera leccion
                - si todas lecciones vistas -> no muestra boton
                - si tiene algunas lecciones vistas -> siguiente leccion
                 */
                if (!curso.lecciones.length) {
                    elementoAvance = ''
                }
                else if (curso.lecciones.length === 1) {
                    lastLeccion = !curso.lecciones[0].vista && (curso.lecciones[0]);
                    elementoAvance = (lastLeccion)
                        && `<button class="continuar-lession">
                            <a href="leccion.html?curso=${curso.curso_id}&leccion=${lastLeccion.id}">
                            Continuar Lección #${lastLeccion.orden}</a>
                        </button>`;
                }
                else if (!leccionesVistas.length) {
                    lastLeccion = curso.lecciones[0]
                    elementoAvance = (lastLeccion)
                        && `<button class="continuar-lession">
                            <a href="leccion.html?curso=${curso.curso_id}&leccion=${lastLeccion.id}">
                            Continuar Lección #${lastLeccion.orden}</a>
                        </button>`;
                }
                else if (leccionesVistas.length === curso.lecciones.length) {
                    elementoAvance = ''
                }
                else {
                    lastLeccion = leccionesVistas.reduce((prevLec, currLec) => {
                        return prevLec.orden > currLec.orden ? prevLec : currLec
                    })
                    const lastLeccionOrden = lastLeccion.orden
                    lastLeccion = (leccionesVistas
                            .filter(lecc => lecc.orden == Number(lastLeccionOrden + 1))[0])
                        || curso.lecciones[0]
                    elementoAvance = (lastLeccion)
                        && `<button class="continuar-lession">
                            <a href="leccion.html?curso=${curso.curso_id}&leccion=${lastLeccion.id}">
                            Continuar Lección #${lastLeccion.orden}</a>
                        </button>`;

                }

                document.getElementById('detalles-curso-img').innerHTML =
                    `<div class="titulo_video_pre">
                        <img src="../img/cursosPortadas/${curso.imgportada}" alt="imagen presentacion ${curso.titulo}">
                        <h2>${curso.titulo}</h2>
                        <h3>${curso.descripcion}</h3>
                    </div>`
                document.getElementById('datos-progreso-container').innerHTML =
                    `<h2>¿Qué tan lejos llegarás hoy?</h2>
                    <h3>Progreso:</h3>
                    <div class="barra-progreso">
                        <div style="width: ${(1 - (1 / 4)) * curso.progreso * 100}%" class="progreso"></div>
                    </div>
                    <h4>Por: "${curso.profesional}"</h4>
                    ${elementoAvance}`
            }

            const leccElems = curso.lecciones
            .sort((a, b) => a.orden - b.orden)
            .map(leccion => {
                let leccToShow;
                console.log('misCursosIds:', misCursosIds);
                console.log('curso.curso_id:', curso.curso_id);
                
                if (!misCursosIds || !misCursosIds.includes(Number(curso.curso_id))) {
                    leccToShow = `<h3>${leccion.titulo}</h3>`
                }
                else {
                    leccToShow = `<h3><a href="leccion.html?curso=${curso.id || curso.curso_id}&leccion=${leccion.id}">
                    ${leccion.titulo}</a></h3>`;
                }
                return `<li><img src="../img/cursosPortadas/${curso.imgportada}" alt="leccion ${leccion.orden}"/>${leccToShow}</li>`;
            });
        
            insertElementos('ul-lecciones', leccElems)
            console.log('Elementos de lecciones:', leccElems);
        } else {
            alert(`Error  2: ${result.error}`)
        }
    } catch (err) {
        alert(`Error   3: ${err.message}`)
    }
}


loadCategorias().then(res => console.log("Cargadas las categorias."));
if (document.cookie) {
    console.log("Usuario logeado. Cargando cursos...");

    document.getElementById('to-mis-cursos').innerHTML = '<a href="3_login.html">Mis Cursos</a>';

    loadMisCursos().then(_ => {
        console.log("Cargados mis cursos");
        loadCurso().then(res => console.log("Curso cargado."));
    });

    document.getElementById('inicio-sesion-btn').style.display = 'none';
    document.getElementById('signup-sesion-btn').innerHTML = 'Cerrar Sesión';

    if (document.cookie.split(';')[2].trim().split('=')[1] === 'administrador') {
        document.getElementById('nombre-admin').innerHTML =
            `<a href="5.html">${document.cookie.split(';')[1].trim().split('=')[1]}</a>`;
    }
} else {
    console.log("Usuario NO logeado. Cargando curso...");
    document.getElementById('to-mis-cursos').style.display = 'none';
    loadCurso().then(res => console.log("Curso cargado."));
}