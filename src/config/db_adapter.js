const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión a Supabase (PostgreSQL)
const pool = new Pool({
    host: process.env.SUPABASE_DB_HOST,
    port: process.env.SUPABASE_DB_PORT || 5432,
    database: process.env.SUPABASE_DB_NAME,
    user: process.env.SUPABASE_DB_USER,
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    // Configurar zona horaria para Buenos Aires
    options: '-c timezone=America/Argentina/Buenos_Aires'
});

// Función para convertir queries MySQL a PostgreSQL
function convertMySQLToPostgreSQL(query, params) {
    let convertedQuery = query;
    
    // Convertir parámetros ? a $1, $2, etc.
    let paramIndex = 1;
    convertedQuery = convertedQuery.replace(/\?/g, () => `$${paramIndex++}`);
    
    // Agregar RETURNING para INSERT statements que no lo tengan
    if (convertedQuery.trim().toUpperCase().startsWith('INSERT') && 
        !convertedQuery.toUpperCase().includes('RETURNING')) {
        
        // Detectar la tabla para determinar qué ID devolver
        const tableMatch = convertedQuery.match(/INSERT\s+INTO\s+(\w+)/i);
        if (tableMatch) {
            const tableName = tableMatch[1];
            let idField = 'id';
            
            // Mapear nombres de tabla a sus campos ID
            const tableIdMap = {
                'empresas': 'id_empresa',
                'usuarios': 'id_usuario',
                'vehiculos': 'id_vehiculo',
                'movimientos': 'id_movimiento',
                'pagos': 'id_pago',
                'tarifas': 'id_tarifa',
                'turnos': 'id_turno',
                'configuracion_empresa': 'id_configuracion',
                'login_attempts': 'id_intento'
            };
            
            idField = tableIdMap[tableName] || 'id';
            convertedQuery += ` RETURNING ${idField}`;
        }
    }
    
    // Convertir funciones de fecha MySQL a PostgreSQL
    convertedQuery = convertedQuery.replace(
        /DATE_SUB\(NOW\(\),\s*INTERVAL\s+(\d+)\s+MINUTE\)/gi,
        "NOW() - INTERVAL '$1 minutes'"
    );
    
    convertedQuery = convertedQuery.replace(
        /DATE_SUB\(NOW\(\),\s*INTERVAL\s+(\d+)\s+HOUR\)/gi,
        "NOW() - INTERVAL '$1 hours'"
    );
    
    convertedQuery = convertedQuery.replace(
        /DATE_SUB\(NOW\(\),\s*INTERVAL\s+(\d+)\s+DAY\)/gi,
        "NOW() - INTERVAL '$1 days'"
    );
    
    // Convertir LIMIT con OFFSET
    convertedQuery = convertedQuery.replace(
        /LIMIT\s+(\d+),\s*(\d+)/gi,
        'LIMIT $2 OFFSET $1'
    );
    
    // Convertir comillas dobles por simples en strings
    convertedQuery = convertedQuery.replace(/"([^"]+)"/g, "'$1'");
    
    // Convertir COALESCE con NULL
    convertedQuery = convertedQuery.replace(/COALESCE\(([^,]+),\s*NOW\(\)\)/gi, 'COALESCE($1, NOW())');
    
    // Convertir TIMESTAMPDIFF de MySQL a PostgreSQL
    // TIMESTAMPDIFF(MINUTE, start, end) -> EXTRACT(EPOCH FROM (end - start))/60
    convertedQuery = convertedQuery.replace(
        /TIMESTAMPDIFF\(MINUTE,\s*([^,]+),\s*CURRENT_TIMESTAMP\)/gi,
        "FLOOR(EXTRACT(EPOCH FROM (NOW() AT TIME ZONE 'America/Argentina/Buenos_Aires' - $1))/60)"
    );
    
    convertedQuery = convertedQuery.replace(
        /TIMESTAMPDIFF\(MINUTE,\s*([^,]+),\s*([^)]+)\)/gi,
        'FLOOR(EXTRACT(EPOCH FROM ($2 - $1))/60)'
    );
    
    convertedQuery = convertedQuery.replace(
        /TIMESTAMPDIFF\(HOUR,\s*([^,]+),\s*([^)]+)\)/gi,
        'FLOOR(EXTRACT(EPOCH FROM ($2 - $1))/3600)'
    );
    
    convertedQuery = convertedQuery.replace(
        /TIMESTAMPDIFF\(DAY,\s*([^,]+),\s*([^)]+)\)/gi,
        'FLOOR(EXTRACT(EPOCH FROM ($2 - $1))/86400)'
    );
    
    convertedQuery = convertedQuery.replace(
        /TIMESTAMPDIFF\(SECOND,\s*([^,]+),\s*([^)]+)\)/gi,
        'FLOOR(EXTRACT(EPOCH FROM ($2 - $1)))'
    );
    
    // Convertir CURRENT_TIMESTAMP a NOW() con zona horaria argentina
    convertedQuery = convertedQuery.replace(/CURRENT_TIMESTAMP/g, "NOW() AT TIME ZONE 'America/Argentina/Buenos_Aires'");
    
    return { query: convertedQuery, params };
}

// Configurar zona horaria al inicializar la conexión
pool.on('connect', (client) => {
    client.query("SET timezone = 'America/Argentina/Buenos_Aires'");
});

// Adaptador que simula el comportamiento de MySQL
const mysqlAdapter = {
    async query(sql, params = []) {
        try {
            const { query: convertedQuery, params: convertedParams } = convertMySQLToPostgreSQL(sql, params);
            
            console.log('Original Query:', sql);
            console.log('Converted Query:', convertedQuery);
            console.log('Params:', convertedParams);
            
            const result = await pool.query(convertedQuery, convertedParams);
            
            // Simular el comportamiento de MySQL que devuelve [rows, fields]
            // Para mantener compatibilidad con el código existente
            const mysqlLikeResult = [result.rows, result.fields];
            
            // Agregar propiedades adicionales que MySQL incluye
            // Para INSERT, buscar el ID en la primera fila si existe
            let insertId = null;
            if (convertedQuery.trim().toUpperCase().startsWith('INSERT') && result.rows.length > 0) {
                // Buscar cualquier campo que termine en 'id' o sea 'id'
                const firstRow = result.rows[0];
                const idField = Object.keys(firstRow).find(key => 
                    key === 'id' || key.endsWith('_id') || key.includes('id')
                );
                insertId = idField ? firstRow[idField] : null;
            }
            
            // Agregar propiedades tanto al array como al primer elemento para compatibilidad
            mysqlLikeResult.insertId = insertId;
            mysqlLikeResult.affectedRows = result.rowCount || 0;
            mysqlLikeResult.changedRows = result.rowCount || 0;
            
            // También agregar al primer elemento del array para compatibilidad con código que usa [result]
            if (mysqlLikeResult[0]) {
                mysqlLikeResult[0].insertId = insertId;
                mysqlLikeResult[0].affectedRows = result.rowCount || 0;
                mysqlLikeResult[0].changedRows = result.rowCount || 0;
            }
            
            // Log para debugging
            if (convertedQuery.trim().toUpperCase().startsWith('INSERT')) {
                console.log('INSERT Result - insertId:', insertId);
                console.log('INSERT Result - first row:', result.rows[0]);
            }
            
            return mysqlLikeResult;
            
        } catch (error) {
            console.error('Database query error:', error);
            console.error('Original SQL:', sql);
            console.error('Params:', params);
            throw error;
        }
    },
    
    // Método directo para PostgreSQL (sin conversión)
    async queryDirect(sql, params = []) {
        return await pool.query(sql, params);
    },
    
    // Función de prueba de conexión
    async testConnection() {
        try {
            const result = await pool.query('SELECT NOW() as current_time');
            console.log('✅ Supabase connection successful:', result.rows[0].current_time);
            return true;
        } catch (error) {
            console.error('❌ Supabase connection failed:', error.message);
            return false;
        }
    },
    
    // Cerrar pool
    async end() {
        await pool.end();
    }
};

// Eventos del pool
pool.on('connect', (client) => {
    console.log('New client connected to Supabase');
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = mysqlAdapter;
