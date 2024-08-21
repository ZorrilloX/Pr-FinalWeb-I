/**
 * Este archivo gestiona la visualización y actualización de cursos del usuario:
 * 
 * - `insertElementos`: Inserta HTML en un elemento con una clase específica.
 * - `mostrarCursos`: Muestra una lista de cursos con detalles como título, progreso y descripción.
 * - `cursoCompletado`: Marca un curso como completado y actualiza la base de datos.
 * - `loadMisCursos`: Carga los cursos del usuario desde el servidor y calcula el progreso.
 * - Configura la vista según el estado de la sesión del usuario, mostrando enlaces y botones apropiados.
 */

let misCursos;

function insertElementos(className, htmlStrings) {
    const parentElement = document.querySelector(`.${className}`);

    // Join all HTML strings into a single string and set it as innerHTML
    parentElement.innerHTML = [ "<h3>Tus cursos:</h3>", ...htmlStrings].join('');
}

function mostrarCursos (cursos) {
    const cursosElem = cursos.map(curso => {
        cursoCompletado(curso.curso_id)
        return `<div class="curso">
                    <img src="../img/cursosPortadas/${curso.imgportada}" alt="Curso ${curso.titulo}">
                    <div class="curso-detalle">
                        
                        <h3><a class="_c_v_title" href="2_curso_data.html?id=${curso.curso_id}">
                            ${Number(curso.progreso) === 1 ? curso.titulo + " - <i>COMPLETADO</i>" : curso.titulo}
                        </a></h3>
                        <p>${curso.descripcion}</p>                 
                        <div class="barra-progreso">
                            <div class="progreso" style="width: ${Math.round(curso.progreso * 100)}%" ></div>
                        </div>
                        <p class="_c_v_user" style="color: #007bff">Progreso: ${Math.round(curso.progreso * 100)}%</p>
                    </div>
                </div>`;
    });
    insertElementos("tus-cursos", cursosElem)
}

async function cursoCompletado(cursoId) {
    try {

        const curso = misCursos.filter(c => c.curso_id == cursoId)[0]

        const datosPeticion = {
            idUsuario: document.cookie.split(';')[0].trim().split('=')[1],
            esFavorito: curso.esfavorito,
            visto: true,
        }
        await fetch(`http://localhost:3000/cursos/actualizar-curso/${cursoId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPeticion)
        });
    } catch (err) {
        alert(`Error: ${err}`)
    }
}

async function loadMisCursos () {
    try {

        const datosPeticion = {
            idUsuario: document.cookie.split(';')[0].trim().split('=')[1]
        }
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

            if (!misCursos.length) {
                alert('Parece que aun no tienes cursos matriculados.\n¡Vamos al inicio para que veas el catálogo de cursos!')
                window.location.assign('/index.html')
                return
            }

            misCursos.forEach(curso => {
                let countLeccVistas = 0;
                curso.lecciones.forEach(leccion => {
                    if (leccion.vista) {
                        countLeccVistas += 1;
                    }
                });
                curso.progreso = curso.lecciones.length ? countLeccVistas / curso.lecciones.length : 0;
            });

            mostrarCursos(misCursos)
        } else {
            alert(`Error: ${result.error}`)
        }
    } catch (err) {
        alert(`Error: ${err.message}`)
    }
}

if (document.cookie) {
    loadMisCursos().then(_ => console.log("Cargados mis cursos."))

    document.getElementById('to-mis-cursos').innerHTML = '<a href="/html/3_login.html">Mis Cursos</a>'

    document.getElementById('inicio-sesion-btn').style.display = 'none'
    document.getElementById('signup-sesion-btn').innerHTML = 'Cerrar Sesión'

    if (document.cookie.split(';')[2].trim().split('=')[1] === 'administrador') {
        document.getElementById('nombre-admin').innerHTML =
            `<a href="/html/5.html">${document.cookie.split(';')[1].trim().split('=')[1]}</a>`
    }
}
else {
    window.location.assign('/html/inicia_sesion.html')
}

/*
<div class="barra-progreso">
    <div class="progreso"></div>
</div>
<button class="continuar-lession"><a href="nextSeccion();">continuar lession</a></button>
<h2>¡Desbloque tu creatividad y domina el arte del diseño 3D!</h2>
 */