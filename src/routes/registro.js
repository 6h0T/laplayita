const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

router.post('/', async (req, res) => {
  const { 
    nombre_empresa, 
    nombre_contacto, 
    email, 
    usuario,
    telefono, 
    password 
  } = req.body;

  // Log para debugging
  console.log('📝 Datos recibidos en registro:', {
    nombre_empresa,
    nombre_contacto,
    email,
    usuario,
    telefono: telefono ? 'presente' : 'ausente',
    password: password ? 'presente' : 'ausente'
  });

  try {
    // Validar datos requeridos
    if (!nombre_empresa || !email || !usuario || !password || !nombre_contacto) {
      console.log('❌ Validación fallida - campos faltantes:', {
        nombre_empresa: !!nombre_empresa,
        email: !!email,
        usuario: !!usuario,
        password: !!password,
        nombre_contacto: !!nombre_contacto
      });
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan datos requeridos: nombre_empresa, email, usuario, password y nombre_contacto son obligatorios' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'El formato del email no es válido' 
      });
    }

    // Validar formato de usuario
    const usuarioRegex = /^[a-zA-Z0-9._-]+$/;
    if (!usuarioRegex.test(usuario)) {
      return res.status(400).json({ 
        success: false, 
        message: 'El usuario solo puede contener letras, números, puntos, guiones y guiones bajos' 
      });
    }

    if (usuario.length < 3) {
      return res.status(400).json({ 
        success: false, 
        message: 'El usuario debe tener al menos 3 caracteres' 
      });
    }

    // Verificar si el email ya existe
    const [existenteEmail] = await pool.query(
      'SELECT id_empresa FROM empresas WHERE email = ?',
      [email]
    );

    if (existenteEmail.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'El email ya está registrado. Por favor usa otro email.' 
      });
    }

    // Verificar si el usuario ya existe
    const [existenteUsuario] = await pool.query(
      'SELECT id_usuario FROM usuarios WHERE usuario_login = ?',
      [usuario]
    );

    if (existenteUsuario.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'El usuario ya está registrado. Por favor usa otro usuario.' 
      });
    }

    // Generar número de cliente único (formato: CLI + timestamp)
    const numero_cliente = 'CLI' + Date.now().toString().slice(-6);

    // Calcular fecha de expiración (7 días desde ahora)
    const fecha_expiracion = new Date();
    fecha_expiracion.setDate(fecha_expiracion.getDate() + 7);

    // Crear empresa con estado trial
    const [empresaResult] = await pool.query(`
      INSERT INTO empresas (
        nombre, numero_cliente, email, telefono, 
        plan, activa, estado_suscripcion, 
        fecha_registro, fecha_expiracion, origen_registro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)
    `, [
      nombre_empresa, 
      numero_cliente, 
      email, 
      telefono || null, 
      'basico', 
      true, 
      'trial', 
      fecha_expiracion,
      'landing'
    ]);

    const id_empresa = empresaResult.insertId;

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario admin para la empresa
    await pool.query(`
      INSERT INTO usuarios (
        id_empresa, nombre, usuario_login, contraseña, rol, activo
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [id_empresa, nombre_contacto, usuario, hashedPassword, 'admin', true]);

    // Crear configuración por defecto
    await pool.query(`
      INSERT INTO configuracion_empresa (
        id_empresa, capacidad_total_carros, capacidad_total_motos, 
        capacidad_total_bicicletas, zona_horaria, moneda
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [id_empresa, 50, 30, 20, 'America/Argentina/Buenos_Aires', 'ARS']);

    // Crear tarifas por defecto
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
      `, [id_empresa, tarifa.tipo, tarifa.minuto, tarifa.hora, tarifa.dia, true, 'mixto']);
    }

    console.log('✅ Nueva empresa registrada:', {
      id_empresa,
      nombre: nombre_empresa,
      email,
      numero_cliente,
      estado: 'trial'
    });

    // Respuesta exitosa
    res.json({
      success: true,
      message: '¡Registro exitoso! Tienes 7 días de prueba gratis.',
      data: {
        numero_cliente,
        usuario,
        email,
        nombre_empresa,
        dias_prueba: 7,
        fecha_expiracion: fecha_expiracion.toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al procesar el registro. Por favor intenta nuevamente.' 
    });
  }
});

module.exports = router;
