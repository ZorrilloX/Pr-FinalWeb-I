/**
 * Módulo de funciones para manejar lecciones en la base de datos:
 * 
 * - `marcarVista(req)`: Marca una lección como vista para un curso específico.
 * - `crearLeccion(req)`: Crea una nueva lección en un curso.
 * - `editarLeccion(req)`: Actualiza los detalles de una lección existente.
 * - `borrarLeccion(req)`: Elimina una lección y ajusta el orden de las demás lecciones del curso.
 * 
 * Utiliza un cliente de conexión a la base de datos PostgreSQL desde el módulo `clienteDB`.
 */

const pool = require('../utilidades/clienteDB');


const marcarVista = async (req) => {

    const client = await pool.connect();

    const result = await client
	.query(`INSERT INTO 
	    mi_lession(
		mi_curso_id, 
		lession_id, 
		vista) 
	    VALUES(
		${req.body.idMiCurso}, 
		${req.body.idLeccion}, 
		TRUE);`);
    client.release();

    return { command: result.command, rowCount: result.rowCount };
}

const crearLeccion = async (req) => {

    const client = await pool.connect();

    const result = await client
	.query(`INSERT INTO 
	    lession(
		curso_id, 
		imgportada, 
		titulo, 
		descripcion, 
		orden, 
		tipo, 
		linkvideo) 
	    VALUES(
		${req.body.idCurso}, 
		'${req.body.imgPortada}', 
		'${req.body.titulo}', 
		'${req.body.descripcion}', 
		${req.body.orden}, 
		'${req.body.tipo}', 
		'${req.body.linkVideo}');`);

    client.release();
    return { command: result.command, rowCount: result.rowCount };
}

const editarLeccion = async (req) => {

    const client = await pool.connect();

    const result = await client
	.query(`UPDATE lession 
	    SET imgportada = '${req.body.imgPortada}', 
		titulo = '${req.body.titulo}', 
		descripcion = '${req.body.descripcion}', 
		orden = ${req.body.orden}, 
		tipo = '${req.body.tipo}', 
		linkvideo = '${req.body.linkVideo}' 
	    WHERE id = ${req.body.idLeccion};`);

    client.release();
    return { command: result.command, rowCount: result.rowCount };
}

const borrarLeccion = async (req) => {

    const clientMisLecciones = await pool.connect();
    const resultLecciones = await clientMisLecciones
	.query(`DELETE FROM 
	    mi_lession 
	    WHERE lession_id = ${req.body.idLeccion};`);
    clientMisLecciones.release();

    const clientOrden = await pool.connect();
    const resultCambOrden = await clientOrden
	.query(`UPDATE lession 
	    SET orden = orden - 1 
	    WHERE orden > (
		SELECT orden 
		FROM lession 
		WHERE id = ${req.body.idLeccion}
	    ) AND curso_id = ${req.body.idCurso};`);
    clientOrden.release();

    const client = await pool.connect();
    const result = await client
	.query(`DELETE FROM 
	    lession 
	    WHERE id = ${req.body.idLeccion};`);
    client.release();

    return { command: result.command, 
	rowCount: Number(result.rowCount) 
	    + Number(resultLecciones.rowCount)
	    + Number(resultCambOrden.rowCount)
    }
}


module.exports = {
    marcarVista,
    crearLeccion,
    editarLeccion,
    borrarLeccion
}
