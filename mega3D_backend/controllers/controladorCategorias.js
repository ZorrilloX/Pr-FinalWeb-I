/**
 * Módulo de handlers para las operaciones relacionadas con categorías:
 * 
 * - `crearCategoriaHandler(req, res)`: Maneja las solicitudes para crear una nueva categoría. Verifica que el usuario tenga el rol de 'administrador' antes de llamar a `crearCategoria`.
 * - `editarCategoriaHandler(req, res)`: Maneja las solicitudes para editar una categoría existente. Verifica que el usuario tenga el rol de 'administrador' antes de llamar a `editarCategoria`. Establece el ID de la categoría a partir de los parámetros de la solicitud.
 * - `borrarCategoriaHandler(req, res)`: Maneja las solicitudes para borrar una categoría. Verifica que el usuario tenga el rol de 'administrador' antes de llamar a `borrarCategoria`. Establece el ID de la categoría a partir de los parámetros de la solicitud.
 * 
 * Utiliza funciones del modelo `modeloCategoria` para interactuar con la base de datos.
 */

const { crearCategoria,
    editarCategoria,
    borrarCategoria
} = require('../models/modeloCategoria');

const crearCategoriaHandler = async (req, res) => {

    try {

	if (req.body.tipoUsuario !== 'administrador') {
	    throw new Error('Tipo de usuario invalido');
	}

	const data = await crearCategoria(req);
	return res.status(200).send({ success: true, data });
    }
    catch (err) {
	return res.status(400).send({ 
	    msg: 'Error en crearCategoria.', 
	    error: err.message });
    }
}

const editarCategoriaHandler = async (req, res) => {

    try {

	if (req.body.tipoUsuario !== 'administrador') {
	    throw new Error('Tipo de usuario invalido');
	}

	req.body.idCategoria = req.params.id;

	const data = await editarCategoria(req);
	return res.status(200).send({ success: true, data });
    }
    catch (err) {
	return res.status(400).send({ 
	    msg: 'Error en editarCategoria.', 
	    error: err.message });
    }
}

const borrarCategoriaHandler = async (req, res) => {

    try {

	if (req.body.tipoUsuario !== 'administrador') {
	    throw new Error('Tipo de usuario invalido');
	}

	req.body.idCategoria = req.params.id;

	const data = await borrarCategoria(req);
	return res.status(200).send({ success: true, data });
    }
    catch (err) {
	return res.status(400).send({ 
	    msg: 'Error en borrarCategoria.', 
	    error: err.message });
    }
}


module.exports = {
    crearCategoriaHandler,
    editarCategoriaHandler,
    borrarCategoriaHandler,
}
