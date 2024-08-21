/**
 * Módulo de funciones para manejar categorías en la base de datos:
 * 
 * - `crearCategoria(req)`: Crea una nueva categoría con el nombre proporcionado en el cuerpo de la solicitud.
 * - `editarCategoria(req)`: Actualiza el nombre de una categoría existente identificada por `idCategoria`.
 * - `borrarCategoria(req)`: Elimina una categoría si no está asociada a ningún curso. Si existen cursos con la categoría, lanza un error.
 * 
 * Utiliza un cliente de conexión a la base de datos PostgreSQL desde el módulo `clienteDB`.
 */

const pool = require('../utilidades/clienteDB');


const crearCategoria = async (req) => {

    const client = await pool.connect();
    const result = await client
	.query(`INSERT INTO 
	    categoria(nombre) 
	    VALUES('${req.body.nombre}');`);
    client.release();

    return { command: result.command, rowCount: result.rowCount };
}

const editarCategoria = async (req) => {

    const client = await pool.connect();
    const result = await client
	.query(`UPDATE categoria 
	    SET nombre = '${req.body.nombre}' 
	    WHERE id = ${req.body.idCategoria};`);
    client.release();

    return { command: result.command, rowCount: result.rowCount };
}

const borrarCategoria = async (req) => {

    const clientCursosCat = await pool.connect();
    const resultCambio = await clientCursosCat
	.query(`SELECT id 
	    FROM curso 
	    WHERE categoria_id = ${req.body.idCategoria};`);
    clientCursosCat.release();

    if (resultCambio.length) {
	throw new Error('Operación no válida, existen cursos con dicha categoría.');
    }

    const client = await pool.connect();
    const result = await client
	.query(`DELETE FROM categoria WHERE id = ${req.body.idCategoria};`);
    client.release();

    return { command: result.command, rowCount: result.rowCount };
}


module.exports = {
    crearCategoria,
    editarCategoria,
    borrarCategoria,
}
