const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

/**
 * Obtener el estado de suscripción de la empresa actual
 * GET /api/suscripcion/estado
 */
router.get('/estado', auth, async (req, res) => {
  try {
    const [empresa] = await pool.query(
      `SELECT 
        estado_suscripcion, 
        fecha_expiracion, 
        fecha_registro,
        nombre,
        email,
        plan
       FROM empresas 
       WHERE id_empresa = ?`,
      [req.user.id_empresa]
    );

    if (empresa.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Empresa no encontrada' 
      });
    }

    const { 
      estado_suscripcion, 
      fecha_expiracion, 
      fecha_registro,
      nombre,
      email,
      plan
    } = empresa[0];

    // Calcular días restantes si está en trial
    let diasRestantes = null;
    let horasRestantes = null;
    
    if (estado_suscripcion === 'trial' && fecha_expiracion) {
      const ahora = new Date();
      const expiracion = new Date(fecha_expiracion);
      const diffMs = expiracion - ahora;
      
      diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      horasRestantes = Math.ceil(diffMs / (1000 * 60 * 60));
      
      // No permitir valores negativos
      diasRestantes = Math.max(0, diasRestantes);
      horasRestantes = Math.max(0, horasRestantes);
    }

    // Determinar si puede usar el sistema
    const puedeUsar = estado_suscripcion === 'active' || 
                      (estado_suscripcion === 'trial' && diasRestantes > 0);

    res.json({
      success: true,
      data: {
        estado: estado_suscripcion,
        estadoTexto: getEstadoTexto(estado_suscripcion),
        diasRestantes,
        horasRestantes,
        fechaExpiracion: fecha_expiracion,
        fechaRegistro: fecha_registro,
        esActiva: estado_suscripcion === 'active',
        esTrial: estado_suscripcion === 'trial',
        estaExpirada: estado_suscripcion === 'expired' || estado_suscripcion === 'suspended',
        puedeUsar,
        empresa: {
          nombre,
          email,
          plan
        },
        contacto: {
          email: 'info@laplayita.com',
          whatsapp: '+54 9 261 123-4567'
        }
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo estado de suscripción:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener estado de suscripción' 
    });
  }
});

/**
 * Obtener texto descriptivo del estado
 */
function getEstadoTexto(estado) {
  const estados = {
    'trial': 'Período de prueba',
    'active': 'Activa',
    'expired': 'Expirada',
    'suspended': 'Suspendida'
  };
  return estados[estado] || 'Desconocido';
}

module.exports = router;
