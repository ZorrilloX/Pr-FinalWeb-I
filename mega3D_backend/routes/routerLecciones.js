const express = require('express');
const router = express.Router();

const { marcarVistaHandler,
    crearLeccionHandler, 
    editarLeccionHandler, 
    borrarLeccionHandler } = require('../controllers/controladorLecciones');


router.post('/marcar-vista/:id', marcarVistaHandler);

router.post('/crear', crearLeccionHandler);
router.put('/editar/:id', editarLeccionHandler);
router.delete('/borrar/:id', borrarLeccionHandler);


module.exports = router;
