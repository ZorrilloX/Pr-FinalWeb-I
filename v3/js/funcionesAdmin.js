/**
 * Este archivo contiene funciones para gestionar cursos, lecciones y categorías:
 * 
 * - `curso-portada`: Permite la carga y vista previa de la portada del curso.
 * - `crear-curso-form`: Envía los datos para crear o actualizar un curso.
 * - `crear-leccion-form`: Envía los datos para crear o actualizar una lección.
 * - `categoria-portada`: Habilita o deshabilita el botón para crear una categoría.
 * - `crear-categoria-form`: Envía los datos para crear o actualizar una categoría.
 * - Funciones `limpiarCurso`, `limpiarLeccion`, `limpiarCategoria`: Limpian los formularios y restablecen el estado.
 * - Funciones `ocultarElem`, `mostrarElem`: Ocultan o muestran elementos HTML.
 * - `insertElementos`: Inserta HTML en un elemento especificado.
 * - Funciones `editLeccion`, `editCurso`, `editCategoria`: Cargan los datos para editar lecciones, cursos o categorías.
 * - Funciones `eliminarCurso`, `eliminarLeccion`, `eliminarCategoria`: Eliminan cursos, lecciones o categorías y actualizan la vista.
 * - `cambiarOrdenLecc`: Cambia el orden de una lección y actualiza la vista.
 * - `selectCurso`: Muestra las lecciones de un curso seleccionado.
 * - `loadCategorias`: Carga y muestra las categorías desde el servidor.
 */

let cursos;
let curso;
let categorias;
let categoria;
let leccion;

document.getElementById('curso-portada').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview-portada').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById('crear-curso-form').addEventListener('submit', async (event) => {
    event.preventDefault()

    try {

        if (!document.getElementById('curso-portada').files[0]) {
            throw new Error('Se debe subir una portada para el curso.')
        }
        const filename = document.getElementById('curso-portada').files[0].name
        const titulo = document.getElementById('nombre-curso').value
        const nombreCategoria = document.getElementById('categoria-curso').value
        const profesional = document.getElementById('profesional').value
        const descripcion = document.getElementById('descripcion').value
        const linkVideo = ''

        const datosPeticion = {
            titulo,
            idCategoria: categorias.filter(cat => cat.nombre === nombreCategoria)[0].id,
            profesional,
            descripcion: descripcion,
            linkVideo,
            imgPortada: filename,
            tipoUsuario: document.cookie.split(';')[2].trim().split('=')[1]
        }

        let path;
        let metodo;
        if (curso) {
            path = `http://localhost:3000/cursos/editar/${curso.id}`
            metodo = 'PUT'
        }
        else {
            path = 'http://localhost:3000/cursos/crear'
            metodo = 'POST'
        }

        const minStringRegex = /^.{10,500}$/;

        if (!(titulo.length > 10 && titulo.length < 100)
            || !(profesional.length >10 && profesional.length < 200)
            || !(descripcion.length > 10 && descripcion.length < 500)
            ){
            throw new Error('Muy pocos caracteres ingresados en los campos de texto.')
        }

        const res = await fetch(path, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPeticion)
        });

        const result = await res.json();
        if (res.ok) {
            //alert('Proceso de curso exitoso.')
            window.location.assign("../html/5.html")
        } else {
            alert(`Error: ${result.message}`)
        }
    } catch (err) {
        alert(`Error: ${err.message}`)
    }
})
document.getElementById('crear-leccion-form').addEventListener('submit', async (event) => {
    event.preventDefault()

    if (curso) {
        const youtubeLink = document.getElementById('leccion-portada').value
        const titulo = document.getElementById('nombre-leccion').value
        const tipo = document.getElementById('tipo-leccion').value === 'video' ? 'video' : 'texto'
        let orden;
        if (leccion) {
            orden = leccion.orden
        }
        else if (!curso.lecciones.length) {
            orden = 1
        }
        else if (curso.lecciones.length === 1) {
            orden = 2
        }
        else {
            orden = curso.lecciones.reduce((prevLec, currLec) => {
                return prevLec.orden > currLec.orden ? prevLec : currLec;
            }).orden + 1
        }
        const subtitulo = document.getElementById('subtitulo').value
        // Obtener el contenido del campo de descripción directamente
        let descripcion = document.getElementById('contenido').value;

        // Reemplazar saltos de línea por <br>
        descripcion = descripcion.replace(/\n/g, '<br>');

        // Reemplazar **texto** por <strong>texto</strong>
        descripcion = descripcion.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        const idCurso = curso.id;
        const imgPortada = ''

        const ytLinkRegex = /^https:\/\/www.youtube.com\/watch\?v=(.*)$/;


        const datosPeticion = {
            titulo,
            tipo,
            orden,
            descripcion: '<h3>' + subtitulo + '</h3>' + descripcion,
            linkVideo: youtubeLink.trim()? youtubeLink.match(ytLinkRegex)[1]:"",
            idCurso,
            imgPortada,
            tipoUsuario: document.cookie.split(';')[2].trim().split('=')[1]
        }

        try {
            // const minStringRegex = /^.{10,500}$/;

            if (!(titulo.length > 10 && titulo.length < 70) 
                || !(subtitulo.length > 10 && subtitulo.length < 100)) {
                throw new Error('Muy pocos caracteres ingresados en los campos de texto.')
            }
            if (youtubeLink.trim() && !youtubeLink.match(ytLinkRegex)) {
                throw new Error('Enlace de YouTube invalido.')
            }

            let path;
            let metodo;
            if (leccion) {
                path = `http://localhost:3000/lecciones/editar/${leccion.id}`
                metodo = 'PUT'
            }
            else {
                path = 'http://localhost:3000/lecciones/crear'
                metodo = 'POST'
            }

            const res = await fetch(path, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosPeticion)
            });

            const result = await res.json();
            if (res.ok) {
                //alert('Proceso de leccion exitoso.')
                window.location.assign("../html/5.html")
            } else {
                alert(`Error: ${result.message}`)
            }
        } catch (err) {
            alert(`Error: ${err.message}`)
        }
    }
})
document.getElementById('categoria-portada').addEventListener('input', () => {

    if (document.getElementById('categoria-portada').value.trim() !== '') {
        document.getElementById('btn-crear-categoria').disabled = false;
        document.getElementById('btn-crear-categoria').style.backgroundColor = '#4CAF50';
    } else {
        document.getElementById('btn-crear-categoria').disabled = true;
        document.getElementById('btn-crear-categoria').style.backgroundColor = '#adadad';
    }
});
document.getElementById('crear-categoria-form').addEventListener('submit', async (event) => {
    event.preventDefault()

    const nombre = document.getElementById('categoria-portada').value.toLowerCase();

    const minStringRegex = /^.{3,50}$/;

    if (!minStringRegex.test(nombre)) {
        throw new Error('Muy pocos caracteres ingresados en los campos de texto.')
    }

    try {

        const datosPeticion = {
            nombre,
            tipoUsuario: document.cookie.split(';')[2].trim().split('=')[1]
        }

        let path;
        let method;
        if (!categoria) {
            path = 'http://localhost:3000/categorias/crear'
            method = 'POST'
        }
        else {
            path = `http://localhost:3000/categorias/editar/${categoria.id}`
            method = 'PUT'
        }

        const res = await fetch(path, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPeticion)
        });

        if (res.ok) {
            alert("Categoria procesada exitosamente.")
            window.location.reload()
        }
    } catch (err) {
        alert(`Error: ${err.message}`)
    }
});

function limpiarCurso () {
    ocultarElem('btn-nueva-leccion')

    document.getElementById('curso-portada').files[0] = undefined;
    document.getElementById('nombre-curso').value = ''
    document.getElementById('categoria-curso').value = ''
    document.getElementById('profesional').value = ''
    document.getElementById('descripcion').value = ''

    curso = undefined;
}
function limpiarLeccion () {
    ocultarElem('crear-leccion')

    document.getElementById('leccion-portada').value = '';
    document.getElementById('nombre-leccion').value = ''
    document.getElementById('tipo-leccion').value = 'video'
    document.getElementById('contenido').innerHTML = ''
    document.getElementById('subtitulo').value = ''
    let ordenNewValue;
    if (!curso.lecciones.length) {
        ordenNewValue = '1'
    }
    else if (curso.lecciones.length === 1) {
        ordenNewValue = '2'
    }
    else {
        ordenNewValue = curso.lecciones.reduce((prevLec, currLec) => {
            return prevLec.orden > currLec.orden ? prevLec : currLec;
        }).orden + 1
    }
    document.getElementById('orden-lecc-label').innerHTML = `Orden: ${ordenNewValue}`
    leccion = undefined;
}
function limpiarCategoria () {
    ocultarElem('crear-categoria')

    document.getElementById('categoria-portada').value = ''
    document.getElementById('btn-crear-categoria').innerHTML = 'Añadir Categoría'
    document.getElementById('btn-crear-categoria').disabled = true
    document.getElementById('btn-crear-categoria').style.backgroundColor = '#adadad';

    categoria = undefined;
}

function ocultarElem(elementID) {
    document.getElementById(elementID).style.display = 'none';
}
function mostrarElem(elementID) {
    document.getElementById(elementID).style.display = 'block';
}
ocultarElem('btn-nueva-leccion')

function insertElementos(elemId, htmlStrings) {
    const parentElement = document.getElementById(elemId);

    parentElement.innerHTML = htmlStrings.join('');
}

function editLeccion (leccionId) {

    leccion = curso.lecciones.filter(lecc => lecc.id == leccionId)[0]

    if (leccion.tipo === 'video') {
        document.getElementById('leccion-portada').value = `https://www.youtube.com/watch?v=${leccion.linkvideo}`;
    }
    console.log('editando leccion id: ',leccion.id);
    document.getElementById('nombre-leccion').value = leccion.titulo
    document.getElementById('tipo-leccion').value = leccion.tipo === 'texto' ? 'blog' : 'video'
    const descRegexMatch = leccion.descripcion.match(/<h3>(.*)<\/h3>(.*)/)
    document.getElementById('subtitulo').value = descRegexMatch[1]
    // Obtener el contenido del campo de descripción directamente
    let descripcion = descRegexMatch[2];

    // Reemplazar <br> por saltos de línea, strong>texto</strong> por **texto**
    descripcion = descripcion.replace(/<br>/g, '\n');
    descripcion = descripcion.replace(/<strong>(.*?)<\/strong>/g, '**$1**');

    document.getElementById('contenido').value = descripcion;
    //document.getElementById('contenido').innerHTML = descRegexMatch[2]
    document.getElementById('orden-lecc-label').innerHTML = `Orden: ${leccion.orden}`

    document.getElementById('btn-nueva-leccion').click()
}

function editCurso (cursoId){

    curso = cursos.filter(c => c.id == cursoId)[0]
    console.log(curso);
    const archivoFalso = new File([""], curso.imgportada, { type: "image/*" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(archivoFalso);
    document.getElementById('curso-portada').files = dataTransfer.files;
        //document.getElementsByClassName('.cont_portada img').value= dataTransfer.files;
    document.getElementById('preview-portada').src=`../img/cursosPortadas/${curso.imgportada}`;
    document.getElementById('nombre-curso').value = curso.titulo
    document.getElementById('categoria-curso').value = categorias.filter(cat => cat.id == curso.categoria_id)[0].nombre
    document.getElementById('profesional').value = curso.profesional
    document.getElementById('descripcion').value = curso.descripcion

    //document.getElementById('btn-nuevo-curso').click()
    mostrarElem('crear-curso');
}
function editCategoria (categoriaId) {
    categoria = categorias.filter(cat => cat.id == categoriaId)[0]

    document.getElementById('btn-crear-categoria').innerHTML = 'Editar Categoría'
    document.getElementById('btn-crear-categoria').disabled = false
    document.getElementById('btn-crear-categoria').style.backgroundColor = '#4CAF50';
    document.getElementById('categoria-portada').value = categoria.nombre
}

async function eliminarCurso (cursoId) {

    const cursoDel = cursos.filter(c => c.id == cursoId)[0]
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el curso "${cursoDel.titulo}"?`);
    if (confirmacion){
        try {
            const deleteBody = {
                tipoUsuario: document.cookie && document.cookie.split(';')[2].trim().split('=')[1],
                idLecciones: cursoDel.lecciones.map(lecc => lecc.id)
            }
            const res = await fetch(`http://localhost:3000/cursos/borrar/${cursoDel.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(deleteBody)
            });
    
            const result = await res.json();
            if (res.ok) {
                //alert('Eliminacion de curso exitosa.')
                window.location.assign("../html/5.html")
            } else {
                alert(`Error: ${result.message}`)
            }
        } catch (err) {
            alert(`Error: ${err.message}`)
        }
    }
}
async function eliminarLeccion (leccionId) {

    const leccionDel = curso.lecciones.filter(lecc => lecc.id == leccionId)[0]
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar la leccion "${leccionDel.titulo}"?`);
    if (confirmacion){
        try {

            const res = await fetch(`http://localhost:3000/lecciones/borrar/${leccionDel.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idCurso: curso.id,
                    tipoUsuario: document.cookie && document.cookie.split(';')[2].trim().split('=')[1]
                })
            });
    
            const result = await res.json();
            if (res.ok) {
                //alert('Eliminacion de leccion exitosa.')
                window.location.assign("../html/5.html")
            } else {
                alert(`Error: ${result.message}`)
            }
        } catch (err) {
            alert(`Error: ${err.message}`)
        }
    }
    
}
async function eliminarCategoria (categoriaId) {

    try {
        const res = await fetch(`http://localhost:3000/categorias/borrar/${categoriaId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tipoUsuario: document.cookie && document.cookie.split(';')[2].trim().split('=')[1]
            })
        });

        const result = await res.json();
        if (res.ok) {
            alert('Eliminacion de categoría exitosa.')
            window.location.assign("../html/5.html")
        } else {
            alert(`Error: ${result.message}`)
        }
    } catch (err) {
        alert(`Error: ${err.message}`)
    }
}

async function cambiarOrdenLecc (leccionId, direccion) {

    try {
        const leccToSwap = curso.lecciones.filter(lecc => lecc.id == leccionId)[0]

        let ordenToChange = leccToSwap.orden;
        if (direccion === 'arriba' && ordenToChange - 1 > 0) {
            ordenToChange -= 1
        }
        else if (direccion === 'abajo' && ordenToChange < curso.lecciones.length + 1) {
            ordenToChange += 1
        }
        else {
            return
        }

        const otraLeccion = curso.lecciones.filter(lecc => lecc.orden == ordenToChange)[0]

        leccToSwap.orden = ordenToChange

        if (direccion === 'arriba') {
            otraLeccion.orden += 1
        }
        else {
            otraLeccion.orden -= 1
        }

        const res1 = await fetch(`http://localhost:3000/lecciones/editar/${leccToSwap.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...leccToSwap,
                tipoUsuario: document.cookie && document.cookie.split(';')[2].trim().split('=')[1]})
        });

        const result1 = await res1.json();
        if (res1.ok) {
            //alert(`Actualización de leccion ${leccToSwap.id} exitosa.`)
        } else {
            alert(`Error: ${result1.message}`)
        }

        const res2 = await fetch(`http://localhost:3000/lecciones/editar/${otraLeccion.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...otraLeccion,
                tipoUsuario: document.cookie && document.cookie.split(';')[2].trim().split('=')[1]
            })
        });

        const result2 = await res2.json();
        if (res2.ok) {
            //alert(`Actualización de leccion ${otraLeccion.id} exitosa.`)
            window.location.assign("../html/5.html")
        } else {
            alert(`Error: ${result2.message}`)
        }
    } catch (err) {
        alert(`Error: ${err.message}`)
    }
}

function selectCurso (cursoId) {

    curso = cursos.filter(c => c.id == cursoId)[0]

    let ordenNewValue;
    if (!curso.lecciones.length) {
        ordenNewValue = '1'
    }
    else if (curso.lecciones.length === 1) {
        ordenNewValue = '2'
    }
    else {
        ordenNewValue = curso.lecciones.reduce((prevLec, currLec) => {
            return prevLec.orden > currLec.orden ? prevLec : currLec;
        }).orden
    }
    document.getElementById('orden-lecc-label').innerHTML = 'Orden: ' + ordenNewValue

    const cursoElem = `<tr">
                            <td>${curso.id}</td>
                            <td class="curso-info" >
                                <img src="../img/cursosPortadas/${curso.imgportada}" alt="Curso ${curso.id}">
                                <span>${curso.titulo}</span>
                            </td>
                            <td>${curso.profesional}</td>
                            <td>
                                <button onclick="eliminarCurso(${curso.id})" class="crud-btn" 
                                    title="Eliminar" aria-label="Eliminar" style="background-color: #a33838">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button onclick="editCurso(${curso.id})" class="crud-btn" 
                                    title="Editar" aria-label="Leer" style="background-color: #4CAF50">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </td>
                        </tr>`

    insertElementos('dblclick-container', [cursoElem])

    if (curso.lecciones) {
        const elems = curso.lecciones
            .sort((a,b) => a.orden - b.orden)
            .map(lecc => {
                return `<tr>
                    <td>${lecc.orden}</td>
                    <td>${lecc.titulo}</td>
                    <td>${lecc.tipo}</td>
                    <td>
                        <button onclick="eliminarLeccion(${lecc.id})" class="crud-btn"
                                title="Eliminar" aria-label="Eliminar" style="background-color: #a33838">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        <button onclick="editLeccion(${lecc.id})" class="crud-btn"
                                title="Editar" aria-label="Leer" style="background-color: #4CAF50">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="cambiarOrdenLecc(${lecc.id}, 'arriba')" class="crud-btn"
                                title="Subir" aria-label="Leer" style="background-color: #007bff">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <button onclick="cambiarOrdenLecc(${lecc.id}, 'abajo')" class="crud-btn"
                                title="Bajar" aria-label="Leer" style="background-color: #007bff">
                            <i class="fas fa-arrow-down"></i>
                        </button>
                    </td>
                </tr>`
            })

        insertElementos('lecciones-container', elems)

        mostrarElem('btn-nueva-leccion')
    }
}

async function loadCategorias () {

    try {

        const res = await fetch(`http://localhost:3000/cursos/categorias`, {
            method: 'GET'
        });

        const result = await res.json()
        if (res.ok) {
            categorias = result.categorias;

            let elemsCategorias = categorias.map(cat => {
                return `<option onclick="filtrarCursos('${cat.nombre}')" value="${cat.nombre}">${cat.nombre}</option>`;
            });
            insertElementos('categoria-curso', elemsCategorias)

            elemsCategorias = categorias.map(cat => {
                return `<tr>
                            <td>${cat.id}</td>
                            <td>${cat.nombre.toUpperCase()}</td>
                            <td>
                                <button onclick="event.preventDefault();eliminarCategoria(${cat.id})" class="crud-btn"
                                        title="Eliminar" aria-label="Eliminar" style="background-color: #a33838">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button onclick="event.preventDefault();editCategoria(${cat.id})" class="crud-btn"
                                        title="Editar" aria-label="Leer" style="background-color: #4CAF50">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </td>
                        </tr>`
            });
            insertElementos('click-categoria', elemsCategorias)

            elemsCategorias = categorias.map(cat => {
                return `<li onclick="filtrarCursos('${cat.nombre}')">${cat.nombre}</li>`
            })
            insertElementos('opciones-filtrado', [
                `<h1>Lista de<br>Categorias</h1><ul><li onclick="filtrarCursos('')">Todos</li>`,
                ...elemsCategorias,
                '</ul>'])
        }
    } catch (err) {
        alert(`Error: ${err.message}`)
    }
}

function mostrarCursos (cursos) {
    const elems = cursos.map(curso => {
        return `<tr onclick="ocultarElem('seccion-cursos');mostrarElem('seccion-lecciones');selectCurso(${curso.id})">
                            <td>${curso.id}</td>
                            <td class="curso-info" >
                                <img src="../img/cursosPortadas/${curso.imgportada}" alt="Curso ${curso.id}">
                                <span>${curso.titulo}</span>
                            </td>
                            <td>${curso.profesional}</td>
                            <td>
                                <button onclick="eliminarCurso(${curso.id})" class="crud-btn" 
                                    title="Eliminar" aria-label="Eliminar" style="background-color: #a33838">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                                <button onclick="editCurso(${curso.id})" class="crud-btn" 
                                    title="Editar" aria-label="Leer" style="background-color: #4CAF50">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </td>
                        </tr>`
    })

    insertElementos('click-container', elems)
}

function filtrarCursos (tipo) {
    if (!tipo) {
        mostrarCursos(cursos);
    }
    else {
        const categoriaId = categorias.filter(cat => cat.nombre === tipo)[0].id
        const filteredCursos = cursos.filter(curso => curso.categoria_id == categoriaId)
        mostrarCursos(filteredCursos);
    }
}

function buscarCursos (palabra) {
    const filteredCursos = cursos.filter(curso => curso.titulo.toLowerCase().includes(palabra.toLowerCase()))
    mostrarCursos(filteredCursos);
}
document.getElementById('busc-admin-search').addEventListener('submit',  (event) => {
    event.preventDefault()

    const minLargoRegex = /^[a-zA-Z0-9]{3,}$/;

    const palabra = document.getElementById('search-bar-admin').value
    if (minLargoRegex.test(palabra)) {
        buscarCursos(palabra)
    } else {
        //alert('Error: Busqueda con palabra muy corta o con caracteres no-alfanumericos.')
        buscarCursos(palabra)
    }
})
// Carga las categorías desde el servidor y las muestra en los formularios y listas
async function loadCursos () {

    try {
        const datosPeticion = {
            tipoUsuario: document.cookie && document.cookie.split(';')[2].trim().split('=')[1]
        }

        const res = await fetch(`http://localhost:3000/cursos/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPeticion)
        });

        const result = await res.json()
        if (res.ok) {
            cursos = result.cursos;

            mostrarCursos(cursos)
        }
    } catch (err) {
        alert(`Error: ${err.message}`)
    }
}

if (!document.cookie) {
    alert('No ha iniciado sesión.');
    window.location.assign('/html/inicia_sesion.html')
}
if (document.cookie.split(';')[2].trim().split('=')[1] !== 'administrador') {
    alert('No tiene permisos necesarios, ingrese con una cuenta de adminstrador.');

    window.location.assign('/html/inicia_sesion.html')
}
else {
    document.getElementById('to-mis-cursos').innerHTML = '<a href=" 3_login.html">Mis Cursos</a>'

    document.getElementById('inicio-sesion-btn').style.display = 'none'
    document.getElementById('signup-sesion-btn').innerHTML = 'Cerrar Sesión'

    document.getElementById('nombre-admin').innerHTML =
        `<a href="5.html">${document.cookie.split(';')[1].trim().split('=')[1]}</a>`

    loadCategorias().then(_ => console.log("Cargadas las categorias."))
    loadCursos().then(_ => console.log("Cargados los cursos."))
}

/*
<option onclick="filtrarCursos('basico')" value="basico" >Básico</option>
                            <option onclick="filtrarCursos('intermedio')" value="intermedio">Intermedio</option>
                            <option onclick="filtrarCursos('avanzado')" value="avanzado">Avanzado</option>
                            <option onclick="filtrarCursos('nuevo')" value="nuevo" selected>Nuevo</option>
                            <option onclick="filtrarCursos('popular')" value="popular">Popular</option>
 */