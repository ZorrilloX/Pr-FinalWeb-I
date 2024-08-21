/**
 * Configuración del servidor Express para la aplicación Mega3D:
 * 
 * - Usa `cors` para permitir solicitudes desde ciertos orígenes y métodos HTTP.
 * - Configura middleware para parsear JSON.
 * - Define rutas para cursos, lecciones, usuarios y categorías utilizando routers importados.
 * - Inicia el servidor en el puerto 3000.
 */

const express = require('express');
const app = express();
const cors = require('cors');

const routerCursos = require('./routes/routerCursos');
const routerLecciones = require('./routes/routerLecciones');
const routerUsuario = require('./routes/routerUsuario');
const routerCategorias = require('./routes/routerCategorias');


const PORT = 3000;

const corsOptions = {
    origin: /^http:\/\/(localhost|127.0.0.\d{1,3}):{0,1}[\d]+$/,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}

app.use(cors(corsOptions));
app.use(express.json());


app.use('/cursos', routerCursos);
app.use('/lecciones', routerLecciones);
app.use('/usuarios', routerUsuario);
app.use('/categorias', routerCategorias);


app.listen(PORT, () => {
    console.log(`Servidor Mega3D escuchando en puerto: ${PORT}`);
});
