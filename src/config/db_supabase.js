const { Pool } = require('pg'); // PostgreSQL driver para Supabase
require('dotenv').config();

// Configuración de la conexión a Supabase (PostgreSQL)
const pool = new Pool({
    host: process.env.SUPABASE_DB_HOST,
    port: process.env.SUPABASE_DB_PORT || 5432,
    database: process.env.SUPABASE_DB_NAME,
    user: process.env.SUPABASE_DB_USER,
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false // Necesario para Supabase
    },
    max: 10, // Máximo número de conexiones en el pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Función helper para ejecutar queries con manejo de errores
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

// Función para establecer el contexto de empresa (para RLS)
const setCompanyContext = async (client, empresaId) => {
    try {
        await client.query(`SET app.current_empresa_id = '${empresaId}'`);
    } catch (error) {
        console.error('Error setting company context:', error);
        throw error;
    }
};

// Función para obtener un cliente del pool con contexto de empresa
const getClientWithContext = async (empresaId) => {
    const client = await pool.connect();
    if (empresaId) {
        await setCompanyContext(client, empresaId);
    }
    return client;
};

// Función para cerrar el pool de conexiones
const closePool = async () => {
    try {
        await pool.end();
        console.log('Database pool closed');
    } catch (error) {
        console.error('Error closing database pool:', error);
    }
};

// Manejo de eventos del pool
pool.on('connect', (client) => {
    console.log('New client connected to Supabase');
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Función de prueba de conexión
const testConnection = async () => {
    try {
        const result = await pool.query('SELECT NOW() as current_time');
        console.log('✅ Supabase connection successful:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('❌ Supabase connection failed:', error.message);
        return false;
    }
};

module.exports = {
    pool,
    query,
    setCompanyContext,
    getClientWithContext,
    closePool,
    testConnection
};
