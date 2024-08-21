/**
 * Este archivo maneja la carga y visualización de una lección específica de un curso:
 * 
 * - `obtenerQueryParams`: Extrae parámetros de la URL y los devuelve como un objeto.
 * - `marcarVistaLecc`: Marca una lección como vista y actualiza el estado en el servidor.
 * - `loadCurso`: Carga los detalles de un curso y una lección específica desde el servidor, y muestra el contenido adecuado en la página.
 * - Configura la vista según el estado de la sesión del usuario y los parámetros de la URL.
 */


let curso;
let leccion;

function obtenerQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const queryParams = {};
    for (const [key, value] of params.entries()) {
        queryParams[key] = value;
    }
    return queryParams;
}

async function marcarVistaLecc (miCursoId, leccionId) {

    try {

        const datosPeticion = { idMiCurso: miCursoId }
        const res = await fetch(`http://localhost:3000/lecciones/marcar-vista/${leccionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPeticion)
        });

        //const result = await res.json()
        if (res.ok) {
            console.log("Leccion marcada como vista.")
            window.location.reload()
        }
    } catch (err) {
        alert(`Error: ${err.message}`)
    }
}

async function loadCurso (params) {

    try {

        const datosPeticion = {
            idUsuario: document.cookie.split(';')[0].trim().split('=')[1]
        }
        const res = await fetch(`http://localhost:3000/cursos/mis-cursos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPeticion)
        });
        
        const result = await res.json()
        if (res.ok) {
            curso = result.cursos.filter(c => c.curso_id == params.curso)[0];
            leccion = curso.lecciones.filter(leccion => leccion.id == params.leccion)[0]

            console.log('params:', params.leccion);
            let elemGraf;
            if (leccion.tipo === 'texto') {
                elemGraf = `<img src="../img/cursosPortadas/${curso.imgportada}" alt="Curso de Introducción a Blender">`
            } else {
                elemGraf = `<iframe width="560" height="315" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                src="https://www.youtube.com/embed/${leccion.linkvideo}" allowfullscreen></iframe>`;

            }
            console.log('id:', leccion.id);
            console.log(leccion.linkvideo);
            console.log(leccion.orden);

            let infoVista;
            if (leccion.vista) {
                infoVista = `<p style="background-color: #007bff" class="enter-button"><a>Vista</a></p>`
            } else {
                infoVista = `<button style="background-color: green" class="enter-button">
                    <a href="#" onclick="marcarVistaLecc(${curso.mi_curso_id}, ${leccion.id})">Marcar Vista</a>
                    </button>`
            }

            const leccAnterior = curso.lecciones.filter(lecc => lecc.orden === leccion.orden - 1)[0] || leccion
            const leccSiguiente = curso.lecciones.filter(lecc => lecc.orden === leccion.orden + 1)[0] || leccion

            document.getElementById('mis-cursos-container').innerHTML
                = `<div class="curso-header">
                    <h2>Curso de Introducción a Blender</h2>
                </div>
                <div class="curso-contenido-principal">
                    <div class="curso-video-principal">
                        ${elemGraf}
                    </div>
                </div>
                <div style="margin-top: 5%" class="_c_v_cont_text">
                    <p>
                        ${leccion.descripcion}
                    </p>
                </div>
                <div style="width: 100%; display: flex; justify-content: space-evenly;" class="curso-info-principal">
                    ${infoVista}
                    <button class="enter-button"><a href="leccion.html?curso=${curso.curso_id}&leccion=${leccAnterior.id}">ATRAS</a></button>
                    <button class="enter-button"><a href="leccion.html?curso=${curso.curso_id}&leccion=${leccSiguiente.id}">SIGUIENTE</a></button>
                </div>
                <hr class="curso-raya">`;
        } else {
            alert(`Error: ${result.error}`)
        }
    } catch (err) {
        alert(`Error: ${err.message}`)
    }
}

const params = obtenerQueryParams();
if (document.cookie && params.curso && params.leccion) {
    loadCurso(params).then(_ => console.log("Curso cargado."))
}
else {
    window.location.assign('/index.html')
}

if (document.cookie) {
    document.getElementById('to-mis-cursos').innerHTML = '<a href="./3_login.html">Mis Cursos</a>'

    if (document.cookie.split(';')[2].trim().split('=')[1] === 'administrador') {
        document.getElementById('nombre-admin').innerHTML =
            `<a href="5.html">${document.cookie.split(';')[1].trim().split('=')[1]}</a>`
    }

    document.getElementById('inicio-sesion-btn').style.display = 'none'
    document.getElementById('signup-sesion-btn').innerHTML = 'Cerrar Sesión'
}
else {
    document.getElementById('to-mis-cursos').style.display = 'none'
}