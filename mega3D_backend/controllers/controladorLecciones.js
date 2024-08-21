/**
 * Módulo de handlers para las operaciones de lecciones:
 * 
 * - `marcarVistaHandler(req, res)`: Maneja las solicitudes para marcar una lección como vista. Establece el ID de la lección a partir de los parámetros de la solicitud y llama a `marcarVista`.
 * - `crearLeccionHandler(req, res)`: Maneja las solicitudes para crear una nueva lección. Verifica que el usuario tenga el rol de 'administrador' antes de llamar a `crearLeccion`.
 * - `editarLeccionHandler(req, res)`: Maneja las solicitudes para editar una lección existente. Verifica que el usuario tenga el rol de 'administrador' antes de llamar a `editarLeccion`.
 * - `borrarLeccionHandler(req, res)`: Maneja las solicitudes para borrar una lección. Verifica que el usuario tenga el rol de 'administrador' antes de llamar a `borrarLeccion`.
 * 
 * Utiliza funciones del modelo `modeloLeccion` para interactuar con la base de datos.
 */

const { marcarVista,
    crearLeccion,
    editarLeccion,
    borrarLeccion } = require('../models/modeloLeccion');


const marcarVistaHandler = async (req, res) => {

    try {

	req.body.idLeccion = req.params.id;
	const data = await marcarVista(req);

	return res.status(200).send({ success: true, data });
    }
    catch (err) {
	return res.status(400).send({ 
	    msg: 'Error en llamado a marcarVista.', 
	    error: err.message });
    }
}

const crearLeccionHandler = async (req, res) => {
    try {

	if (req.body.tipoUsuario !== 'administrador') {
	    throw new Error('Rol de usuario invalido.')
	}

	const data = await crearLeccion(req);

	return res.status(200).send({ success: true, data });
    }
    catch (err) {
	return res.status(400).send({ 
	    msg: 'Error en llamado a crearLeccion.', 
	    error: err.message });
    }
}

const editarLeccionHandler = async (req, res) => {

    try {

	if (req.body.tipoUsuario !== 'administrador') {
	    throw new Error('Rol de usuario invalido.')
	}

	req.body.idLeccion = req.params.id;
	const data = await editarLeccion(req);

	return res.status(200).send({ success: true, data });
    }
    catch (err) {
	return res.status(400).send({ 
	    msg: 'Error en llamado a editarLeccion.', 
	    error: err.message });
    }
}

const borrarLeccionHandler = async (req, res) => {

    try {

	if (req.body.tipoUsuario !== 'administrador') {
	    throw new Error('Rol de usuario invalido.')
	}

	req.body.idLeccion = req.params.id;
	const data = await borrarLeccion(req);

	return res.status(200).send({ success: true, data }); 
    }
    catch (err) {
	return res.status(400).send({ 
	    msg: 'Error en llamado a borrarLeccion.', 
	    error: err.message });
    }
}



module.exports = {
    marcarVistaHandler,
    crearLeccionHandler,
    editarLeccionHandler,
    borrarLeccionHandler
}
