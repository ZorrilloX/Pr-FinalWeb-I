/**
 * Módulo de funciones para manejar cursos y lecciones en la base de datos:
 * 
 * - `leccionesParcial(curso_id)`: Obtiene las lecciones básicas (sin descripción completa) para un curso.
 * - `leccionesCompleto(curso_id)`: Obtiene las lecciones completas (con todos los detalles) para un curso.
 * - `obtenerCategorias()`: Obtiene todas las categorías disponibles.
 * - `obtenerCursos(req)`: Obtiene todos los cursos, y dependiendo del tipo de usuario, agrega las lecciones correspondientes.
 * - `obtenerCurso(req)`: Obtiene un curso específico y sus lecciones, con detalles dependiendo del tipo de usuario.
 * - `obtenerMisCursos(req)`: Obtiene los cursos a los que un usuario está matriculado y las lecciones con el estado de vista.
 * - `matricularCurso(req)`: Matricula a un usuario en un curso.
 * - `actualizarCurso(req)`: Actualiza el estado de favorito y visto de un curso para un usuario.
 * - `crearCurso(req)`: Crea un nuevo curso.
 * - `editarCurso(req)`: Actualiza los detalles de un curso.
 * - `borrarCurso(req)`: Elimina un curso y todas las lecciones asociadas.
 * 
 * Utiliza un cliente de conexión a la base de datos PostgreSQL desde el módulo `clienteDB`, y se apoya en funciones de `modeloLeccion` para manejar lecciones.
 */

const pool = require('../utilidades/clienteDB');
const { borrarLeccion } = require('./modeloLeccion');


const leccionesParcial = async (curso_id) => {

    const client = await pool.connect();

    const lecciones = await client
	.query(`SELECT 
	    id, 
	    titulo, 
	    imgportada, 
	    orden 
	    FROM lession
	    WHERE curso_id = ${curso_id};`)
	.then(res => res.rows);
    
    client.release();
    return lecciones;
}

const leccionesCompleto = async (curso_id) => {

    const client = await pool.connect();

    const lecciones = await client
	.query(`SELECT 
	    id, 
	    titulo, 
	    descripcion, 
	    tipo, 
	    imgportada, 
	    linkvideo, 
	    orden 
	    FROM lession
	    WHERE curso_id = ${curso_id};`)
	.then(res => res.rows);
    
    client.release();
    return lecciones;
}


const obtenerCategorias = async () => {
    
    const client = await pool.connect();

    const categorias = await client
	.query(`SELECT * FROM categoria;`)
	.then(res => res.rows);

    client.release();
    return categorias;
}

const obtenerCursos = async (req) => {

    const client = await pool.connect();

    const cursos = await client
	.query(`SELECT 
	    id, 
	    titulo, 
	    profesional, 
	    descripcion, 
	    imgportada, 
	    linkvideo, 
	    categoria_id 
	    FROM curso;`)
	.then(res => res.rows);
    client.release();
    if (!req.body.tipoUsuario || req.body.tipoUsuario === 'normal') {
	for (const curso of cursos) {
	    
	    const lecciones = await leccionesParcial(curso.id);

	    curso.lecciones = lecciones;
	}
    }
    if (req.body.tipoUsuario === "administrador") {
	for (const curso of cursos) {
	    
	    const lecciones = await leccionesCompleto(curso.id);

	    curso.lecciones = lecciones;
	}
    }
	

    return cursos;
}


const obtenerCurso = async (req) => {

    const client = await pool.connect();

    const curso = await client
	.query(`SELECT  
	    titulo, 
	    profesional, 
	    descripcion, 
	    imgportada, 
	    linkvideo, 
	    categoria_id 
	    FROM curso
	    WHERE id=${req.body.idCurso};`)
	.then(res => res.rows);
    client.release();
    curso[0].id = req.body.idCurso;
	
    if (!req.body.tipoUsuario || req.body.tipoUsuario === "normal") {

	const lecciones = await leccionesParcial(curso[0].id);

	curso[0].lecciones = lecciones;
    }
    if (req.body.tipoUsuario === "administrador") {
	
	const lecciones = await leccionesCompleto(curso[0].id);

	curso[0].lecciones = lecciones;
    }
	
	/*
	if (!req.body.tipoUsuario || req.body.tipoUsuario === 'normal' || req.body.tipoUsuario === 'administrador') {
		const lecciones = await leccionesParcial(curso[0].id);
		curso[0].lecciones = lecciones;
	}
	*/
    return curso[0];
}

const obtenerMisCursos = async (req) => {

    const client = await pool.connect();

    const misCursos = await client
	.query(`SELECT 
	    curso.id AS curso_id, 
	    mi_curso.id AS mi_curso_id, 
	    titulo, 
	    profesional, 
	    descripcion, 
	    imgportada, 
	    linkvideo, 
	    categoria_id, 
	    esfavorito, 
	    visto 
	    FROM curso JOIN mi_curso 
	    ON curso.id = mi_curso.curso_id 
	    WHERE mi_curso.usuario_id = ${req.body.idUsuario};`)
	.then(res => res.rows);
    client.release();

    for (const curso of misCursos) {
	const lecciones = await leccionesCompleto(curso.curso_id);

	for (const leccion of lecciones) {

	    const clientMisLecc = await pool.connect();
		const qr = `SELECT 
		    vista 
		    FROM mi_lession 
		    WHERE lession_id = ${leccion.id} 
		    AND mi_curso_id = ${curso.mi_curso_id};`
	    const datosLeccionVista = await clientMisLecc
		.query(qr)
		.then(res => res.rows);
	    clientMisLecc.release();

	    if (datosLeccionVista[0]) {
		leccion.vista = datosLeccionVista[0].vista;
	    }
	}

	curso.lecciones = lecciones;
    }

    return misCursos;
}

const matricularCurso = async (req) => {

    const client = await pool.connect();

    const result = await client
	.query(`INSERT INTO 
	    mi_curso(usuario_id, curso_id, esfavorito, visto) 
	    values(${req.body.idUsuario}, ${req.body.idCurso}, FALSE, FALSE);`);

    client.release();
    return { command: result.command, rowCount: result.rowCount };
}

const actualizarCurso = async (req) => {

    const client = await pool.connect();

    const result = await client
	.query(`UPDATE mi_curso 
	    SET esfavorito=${req.body.esFavorito}, visto=${req.body.visto} 
	    WHERE usuario_id=${req.body.idUsuario} AND curso_id=${req.body.idCurso};`);

    client.release();
    return { command: result.command, rowCount: result.rowCount };
}

const crearCurso = async (req) => {

    const client = await pool.connect();

    const result = await client
	.query(`INSERT INTO
	    curso(
		profesional, 
		titulo, 
		descripcion, 
		imgportada, 
		linkvideo, 
		categoria_id) 
	    values(
		'${req.body.profesional}', 
		'${req.body.titulo}', 
		'${req.body.descripcion}', 
		'${req.body.imgPortada}', 
		'${req.body.linkVideo}', 
		${req.body.idCategoria});`);

    client.release();
    return { command: result.command, rowCount: result.rowCount };
}

const editarCurso = async (req) => {

    const client = await pool.connect();

    const result = await client
	.query(`UPDATE curso 
	    SET profesional = '${req.body.profesional}', 
	    titulo = '${req.body.titulo}', 
	    descripcion = '${req.body.descripcion}', 
	    imgportada = '${req.body.imgPortada}', 
	    linkvideo = '${req.body.linkVideo}', 
	    categoria_id = ${req.body.idCategoria} 
	    WHERE id = ${req.body.idCurso};`);

    client.release();
    return { command: result.command, rowCount: result.rowCount };
}

const borrarCurso = async (req) => {

    let rowCounter = 0;
    
    // borrado de lecciones asociadas
    const reqObjectIds = req.body.idLecciones.map(id => {
	return { body : { idLeccion: id, idCurso: req.body.idCurso } };
    });
    for (const reqObj of reqObjectIds) {
	const res = await borrarLeccion(reqObj);
	rowCounter += Number(res.rowCount);
    }

    const clientMisCursos = await pool.connect();
    const resultCursos = await clientMisCursos
	.query(`DELETE FROM 
	    mi_curso 
	    WHERE curso_id = ${req.body.idCurso};`);
    clientMisCursos.release();
    rowCounter += Number(resultCursos.rowCount);
    
    const client = await pool.connect();
    const result = await client
	.query(`DELETE FROM 
	    curso 
	    WHERE id = ${req.body.idCurso};`);
    client.release();

    return { command: result.command, 
	rowCount: Number(result.rowCount) + rowCounter };
}


module.exports = {
    obtenerCursos,
    obtenerCurso,
    obtenerCategorias,
    obtenerMisCursos,
    matricularCurso,
    actualizarCurso,
    crearCurso,
    editarCurso,
    borrarCurso,
}
