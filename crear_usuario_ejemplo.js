// Script para crear un usuario de ejemplo
// Ejecutar con: node crear_usuario_ejemplo.js

const bcrypt = require('bcryptjs');
const pool = require('./src/config/db');

async function crearUsuarioEjemplo() {
    try {
        // 1. Crear empresa
        const empresaResult = await pool.query(`
            INSERT INTO empresas (nombre, numero_cliente, direccion, telefono, email, plan, activa)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            'Nicolas Maida',
            '000000001',
            'Calle Falsa 123, Mendoza',
            '+54 261 1234567',
            'admin@laplayita.com',
            'basico',
            true
        ]);

        const idEmpresa = empresaResult.insertId;
        console.log('✅ Empresa creada con ID:', idEmpresa);

        // 2. Encriptar contraseña
        const contraseñaPlana = 'admin123';
        const contraseñaEncriptada = await bcrypt.hash(contraseñaPlana, 10);

        // 3. Crear usuario administrador
        const [usuario] = await pool.query(`
            INSERT INTO usuarios (id_empresa, nombre, usuario_login, contraseña, rol, activo) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            idEmpresa,
            'MaidaN',
            'admin',      // ← USUARIO
            contraseñaEncriptada,  // ← CONTRASEÑA ENCRIPTADA
            'admin',
            true
        ]);

        console.log('✅ Usuario creado con ID:', usuario.insertId);

        // 4. Crear configuración de empresa
        await pool.query(`
            INSERT INTO configuracion_empresa (
                id_empresa, 
                capacidad_total_carros, 
                capacidad_total_motos, 
                capacidad_total_bicicletas,
                zona_horaria,
                moneda
            ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
            idEmpresa,
            50,  // Capacidad autos
            30,  // Capacidad camionetas  
            20,  // Capacidad motos
            'America/Argentina/Buenos_Aires',
            'ARS'
        ]);

        console.log('✅ Configuración creada');

        // 5. Crear tarifas básicas
        const tiposVehiculo = ['auto', 'camioneta', 'moto'];
        const tarifas = [
            { tipo: 'auto', minuto: 50, hora: 2000, dia: 16000 },
            { tipo: 'camioneta', minuto: 60, hora: 2500, dia: 18000 },
            { tipo: 'moto', minuto: 30, hora: 1500, dia: 10000 }
        ];

        for (const tarifa of tarifas) {
            await pool.query(`
                INSERT INTO tarifas (
                    id_empresa, tipo_vehiculo, valor_minuto, valor_hora, 
                    valor_dia_completo, activa, fecha_vigencia_desde, modo_cobro
                ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
            `, [
                idEmpresa,
                tarifa.tipo,
                tarifa.minuto,
                tarifa.hora,
                tarifa.dia,
                true,
                'mixto'
            ]);
        }

        console.log('✅ Tarifas creadas');

        console.log('\n🎉 USUARIO CREADO EXITOSAMENTE!');
        console.log('🏖️ SISTEMA DE PLAYAS DE ESTACIONAMIENTO "LA PLAYITA"');
        console.log('📋 DATOS DE LOGIN:');
        console.log('   Número de Cliente: 000000001');
        console.log('   Usuario: admin');
        console.log('   Contraseña: admin123');
        console.log('\n🌐 Accede en: http://localhost:3000');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        process.exit();
    }
}

crearUsuarioEjemplo();
