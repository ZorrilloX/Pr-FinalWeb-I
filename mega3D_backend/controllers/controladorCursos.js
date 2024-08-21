/**
 * Módulo de handlers para las operaciones relacionadas con cursos:
 * 
 * - `obtenerCursosHandler(req, res)`: Maneja las solicitudes para obtener la lista de cursos. Llama a `obtenerCursos` y devuelve los cursos.
 * - `obtenerCursoHandler(req, res)`: Maneja las solicitudes para obtener los detalles de un curso específico. Establece el ID del curso a partir de los parámetros de la solicitud y llama a `obtenerCurso`.
 * - `obtenerCategoriasHandler(req, res)`: Maneja las solicitudes para obtener la lista de categorías disponibles. Llama a `obtenerCategorias` y devuelve las categorías.
 * - `obtenerMisCursosHandler(req, res)`: Maneja las solicitudes para obtener los cursos en los que el usuario está matriculado. Llama a `obtenerMisCursos` y devuelve los cursos.
 * - `matricularCursoHandler(req, res)`: Maneja las solicitudes para matricular a un usuario en un curso. Establece el ID del curso a partir de los parámetros de la solicitud y llama a `matricularCurso`.
 * - `actualizarCursoHandler(req, res)`: Maneja las solicitudes para actualizar la información de un curso en el que el usuario está matriculado. Establece el ID del curso a partir de los parámetros de la solicitud y llama a `actualizarCurso`.
 * - `crearCursoHandler(req, res)`: Maneja las solicitudes para crear un nuevo curso. Verifica que el usuario tenga el rol de 'administrador' antes de llamar a `crearCurso`.
 * - `editarCursoHandler(req, res)`: Maneja las solicitudes para editar un curso existente. Verifica que el usuario tenga el rol de 'administrador' antes de llamar a `editarCurso`. Establece el ID del curso a partir de los parámetros de la solicitud.
 * - `borrarCursoHandler(req, res)`: Maneja las solicitudes para borrar un curso. Verifica que el usuario tenga el rol de 'administrador' antes de llamar a `borrarCurso`. Establece el ID del curso a partir de los parámetros de la solicitud.
 * 
 * Utiliza funciones del modelo `modeloCurso` para interactuar con la base de datos.
 */

const { obtenerCursos, 
    obtenerCurso, 
    obtenerCategorias, 
    obtenerMisCursos, 
    matricularCurso, 
    actualizarCurso, 
    crearCurso, 
    editarCurso, 
    borrarCurso } = require('../models/modeloCurso');


const obtenerCursosHandler = async (req, res) => {
    
    try {

	const cursos = await obtenerCursos(req);

	return res.status(200).send({ cursos });
    }
    catch (err) {
	return res.status(400).send({ error: err.message });
    }

}

const obtenerCursoHandler = async (req, res) => {

    try {

	req.body.idCurso = req.params.id;
	const curso = await obtenerCurso(req);

	return res.status(200).send({ curso });
    }
    catch (err) {
	return res.status(400).send({ error: err.message });
    }
}

const obtenerCategoriasHandler = async (req, res) => {

    try {
	
	const categorias = await obtenerCategorias();

	return res.status(200).send({ categorias });
    }
    catch (err) {
	return res.status(400).send({ error: err.message });
    }
}

const obtenerMisCursosHandler = async (req, res) => {

    try {
	
	const misCursos = await obtenerMisCursos(req);

	return res.status(200).send({ cursos: misCursos });
    }
    catch (err) {
	return res.status(400).send({ error: err.message });
    }
}

const matricularCursoHandler = async (req, res) => {

    try {

	req.body.idCurso = req.params.id;
	const data = await matricularCurso(req);

	return res.status(200).send({ success: true, data });
    }
    catch (err) {
	return res.status(400).send({ error: err.message });
    }
}

const actualizarCursoHandler = async (req, res) => {

    try {

	req.body.idCurso = req.params.id;
	const data = await actualizarCurso(req);

	return res.status(200).send({ success: true, data });
    }
    catch (err) {
	return res.status(400).send({ error: err.message });
    }
}

const crearCursoHandler = async (req, res) => {

    try {

	if (req.body.tipoUsuario !== 'administrador') {
	    throw new Error('Rol de usuario invalido.');
	}

	const data = await crearCurso(req);

	return res.status(200).send({ success: true, data });
    }
    catch (err) {
	return res.status(400).send({ error: err.message });
    }
}

const editarCursoHandler = async (req, res) => {

    try {

	if (req.body.tipoUsuario !== 'administrador') {
	    throw new Error('Rol de usuario invalido.');
	}

	req.body.idCurso = req.params.id;
	const data = await editarCurso(req);

	return res.status(200).send({ success: true, data });
    }
    catch (err) {
	return res.status(400).send({ error: err.message });
    }
}

const borrarCursoHandler = async (req, res) => {

    try {

	if (req.body.tipoUsuario !== 'administrador') {
	    throw new Error('Rol de usuario invalido.');
	}

	req.body.idCurso = req.params.id;
	const data = await borrarCurso(req);

	return res.status(200).send({ success: true, data });
    }
    catch (err) {
	return res.status(400).send({ error: err.message });
    }
}


module.exports = {
    obtenerCursosHandler,
    obtenerCursoHandler,
    obtenerCategoriasHandler,
    obtenerMisCursosHandler,
    matricularCursoHandler,
    actualizarCursoHandler,
    crearCursoHandler,
    editarCursoHandler,
    borrarCursoHandler,
}
