const express = require('express');
const router = express.Router();

const { crearCategoriaHandler,
    editarCategoriaHandler,
    borrarCategoriaHandler,
} = require('../controllers/controladorCategorias');


router.post('/crear', crearCategoriaHandler);
router.put('/editar/:id', editarCategoriaHandler);
router.delete('/borrar/:id', borrarCategoriaHandler);


module.exports = router;
