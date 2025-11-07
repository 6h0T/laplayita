const pool = require('../config/db');

/**
 * Middleware para verificar el estado de suscripción de la empresa
 * Bloquea el acceso si la prueba expiró o la cuenta está suspendida
 */
async function checkSubscription(req, res, next) {
  try {
    const idEmpresa = req.user.id_empresa;

    // Obtener estado de la empresa
    const [empresa] = await pool.query(
      `SELECT estado_suscripcion, fecha_expiracion, nombre 
       FROM empresas WHERE id_empresa = ?`,
      [idEmpresa]
    );

    if (empresa.length === 0) {
      return res.status(403).json({ 
        success: false,
        error: 'Empresa no encontrada',
        bloqueado: true
      });
    }

    const { estado_suscripcion, fecha_expiracion, nombre } = empresa[0];

    // Si está activa (pagada), permitir acceso sin restricciones
    if (estado_suscripcion === 'active') {
      req.suscripcionActiva = true;
      return next();
    }

    // Si está expirada o suspendida, bloquear acceso
    if (estado_suscripcion === 'expired' || estado_suscripcion === 'suspended') {
      return res.status(403).json({ 
        success: false,
        error: 'Suscripción expirada',
        mensaje: 'Tu período de prueba ha terminado. Contáctanos para activar tu cuenta y seguir usando el sistema.',
        estado: estado_suscripcion,
        bloqueado: true,
        contacto: {
          email: 'info@laplayita.com',
          whatsapp: '+54 9 261 123-4567'
        }
      });
    }

    // Si está en trial, verificar si ya expiró
    if (estado_suscripcion === 'trial') {
      const ahora = new Date();
      const expiracion = new Date(fecha_expiracion);

      // Si ya expiró, actualizar estado y bloquear
      if (ahora > expiracion) {
        await pool.query(
          'UPDATE empresas SET estado_suscripcion = ? WHERE id_empresa = ?',
          ['expired', idEmpresa]
        );

        console.log(`⏰ Prueba expirada para empresa: ${nombre} (ID: ${idEmpresa})`);

        return res.status(403).json({ 
          success: false,
          error: 'Período de prueba finalizado',
          mensaje: 'Tu prueba de 7 días ha terminado. Contáctanos para continuar usando el sistema.',
          estado: 'expired',
          bloqueado: true,
          contacto: {
            email: 'info@laplayita.com',
            whatsapp: '+54 9 261 123-4567'
          }
        });
      }

      // Aún en período válido, calcular días restantes
      const diasRestantes = Math.ceil((expiracion - ahora) / (1000 * 60 * 60 * 24));
      req.diasRestantes = diasRestantes;
      req.enPrueba = true;
      
      // Agregar header con días restantes
      res.setHeader('X-Dias-Restantes', diasRestantes);
      
      return next();
    }

    // Estado desconocido, bloquear por seguridad
    return res.status(403).json({ 
      success: false,
      error: 'Estado de suscripción inválido',
      bloqueado: true
    });

  } catch (error) {
    console.error('❌ Error verificando suscripción:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error al verificar suscripción',
      mensaje: 'Hubo un problema al verificar tu cuenta. Por favor intenta nuevamente.'
    });
  }
}

module.exports = checkSubscription;
