const express = require('express');
const router = express.Router();

const { obtenerCursosHandler,
    obtenerCursoHandler,
    obtenerCategoriasHandler,
    obtenerMisCursosHandler,
    matricularCursoHandler,
    actualizarCursoHandler,
    crearCursoHandler,
    editarCursoHandler,
    borrarCursoHandler } = require('../controllers/controladorCursos');

// metodos para uso del administrador
router.post('/crear', crearCursoHandler);
router.put('/editar/:id', editarCursoHandler);
router.delete('/borrar/:id', borrarCursoHandler);

router.get('/categorias', obtenerCategoriasHandler);
router.post('/mis-cursos', obtenerMisCursosHandler);
router.post('/matricular-curso/:id', matricularCursoHandler);
router.post('/actualizar-curso/:id', actualizarCursoHandler);
router.post('/:id', obtenerCursoHandler);
router.post('/', obtenerCursosHandler);


module.exports = router;
