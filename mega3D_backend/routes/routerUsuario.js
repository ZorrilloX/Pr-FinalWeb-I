const express = require('express');
const router = express.Router();

const { loginUsuarioHandler,
        signupUsuarioHandler,
} = require('../controllers/controladorUsuario');


router.post('/login', loginUsuarioHandler);
router.post('/sign-up', signupUsuarioHandler);


module.exports = router;
