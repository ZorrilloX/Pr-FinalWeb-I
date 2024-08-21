/**
 * Configuración de conexión a la base de datos PostgreSQL utilizando el módulo `pg`:
 * 
 * - Crea una instancia de `Pool` para gestionar conexiones a la base de datos.
 * - Configura la conexión con parámetros: usuario, host, base de datos, contraseña y puerto.
 * - Exporta la instancia del pool para ser utilizada en otros módulos.
 */

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'root',
    port: 5432,
});

module.exports = pool;
