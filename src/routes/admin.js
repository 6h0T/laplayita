const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

/**
 * Listar todas las empresas con su estado de suscripción
 * GET /api/admin/empresas
 */
router.get('/empresas', auth, requireAdmin, async (req, res) => {
  try {
    const { estado } = req.query; // Filtro opcional por estado

    let query = `
      SELECT 
        e.id_empresa,
        e.nombre,
        e.email,
        e.telefono,
        e.numero_cliente,
        e.estado_suscripcion,
        e.fecha_registro,
        e.fecha_expiracion,
        e.origen_registro,
        e.plan,
        e.activa,
        COUNT(DISTINCT u.id_usuario) as total_usuarios,
        COUNT(DISTINCT v.id_vehiculo) as total_vehiculos
      FROM empresas e
      LEFT JOIN usuarios u ON e.id_empresa = u.id_empresa
      LEFT JOIN vehiculos v ON e.id_empresa = v.id_empresa
    `;

    const params = [];

    // Filtrar por estado si se especifica
    if (estado) {
      query += ' WHERE e.estado_suscripcion = ?';
      params.push(estado);
    }

    query += `
      GROUP BY e.id_empresa
      ORDER BY e.fecha_registro DESC
    `;

    const [empresas] = await pool.query(query, params);

    // Calcular días restantes para cada empresa en trial
    const empresasConDias = empresas.map(empresa => {
      let diasRestantes = null;
      
      if (empresa.estado_suscripcion === 'trial' && empresa.fecha_expiracion) {
        const ahora = new Date();
        const expiracion = new Date(empresa.fecha_expiracion);
        diasRestantes = Math.ceil((expiracion - ahora) / (1000 * 60 * 60 * 24));
        diasRestantes = Math.max(0, diasRestantes);
      }

      return {
        ...empresa,
        diasRestantes
      };
    });

    res.json({
      success: true,
      total: empresasConDias.length,
      empresas: empresasConDias
    });

  } catch (error) {
    console.error('❌ Error obteniendo empresas:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener empresas' 
    });
  }
});

/**
 * Listar empresas pendientes de activación (trial o expired)
 * GET /api/admin/empresas-pendientes
 */
router.get('/empresas-pendientes', auth, requireAdmin, async (req, res) => {
  try {
    const [empresas] = await pool.query(`
      SELECT 
        e.id_empresa,
        e.nombre,
        e.email,
        e.telefono,
        e.numero_cliente,
        e.estado_suscripcion,
        e.fecha_registro,
        e.fecha_expiracion,
        e.origen_registro,
        COUNT(DISTINCT u.id_usuario) as total_usuarios
      FROM empresas e
      LEFT JOIN usuarios u ON e.id_empresa = u.id_empresa
      WHERE e.estado_suscripcion IN ('trial', 'expired')
      GROUP BY e.id_empresa
      ORDER BY e.fecha_registro DESC
    `);

    // Calcular días restantes
    const empresasConDias = empresas.map(empresa => {
      let diasRestantes = null;
      
      if (empresa.estado_suscripcion === 'trial' && empresa.fecha_expiracion) {
        const ahora = new Date();
        const expiracion = new Date(empresa.fecha_expiracion);
        diasRestantes = Math.ceil((expiracion - ahora) / (1000 * 60 * 60 * 24));
        diasRestantes = Math.max(0, diasRestantes);
      }

      return {
        ...empresa,
        diasRestantes
      };
    });

    res.json({
      success: true,
      total: empresasConDias.length,
      empresas: empresasConDias
    });

  } catch (error) {
    console.error('❌ Error obteniendo empresas pendientes:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener empresas pendientes' 
    });
  }
});

/**
 * Activar empresa (después de recibir el pago)
 * POST /api/admin/activar-empresa/:id
 */
router.post('/activar-empresa/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la empresa existe
    const [empresa] = await pool.query(
      'SELECT nombre, email, estado_suscripcion FROM empresas WHERE id_empresa = ?',
      [id]
    );

    if (empresa.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Empresa no encontrada' 
      });
    }

    // Activar empresa (quitar fecha de expiración)
    await pool.query(`
      UPDATE empresas 
      SET estado_suscripcion = 'active',
          fecha_expiracion = NULL
      WHERE id_empresa = ?
    `, [id]);

    console.log(`✅ Empresa activada: ${empresa[0].nombre} (${empresa[0].email})`);

    res.json({ 
      success: true, 
      message: `Empresa "${empresa[0].nombre}" activada correctamente`,
      empresa: {
        id: id,
        nombre: empresa[0].nombre,
        email: empresa[0].email,
        estadoAnterior: empresa[0].estado_suscripcion,
        estadoNuevo: 'active'
      }
    });

  } catch (error) {
    console.error('❌ Error activando empresa:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al activar empresa' 
    });
  }
});

/**
 * Suspender empresa
 * POST /api/admin/suspender-empresa/:id
 */
router.post('/suspender-empresa/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    // Verificar que la empresa existe
    const [empresa] = await pool.query(
      'SELECT nombre, email FROM empresas WHERE id_empresa = ?',
      [id]
    );

    if (empresa.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Empresa no encontrada' 
      });
    }

    // Suspender empresa
    await pool.query(`
      UPDATE empresas 
      SET estado_suscripcion = 'suspended'
      WHERE id_empresa = ?
    `, [id]);

    console.log(`⚠️ Empresa suspendida: ${empresa[0].nombre} - Motivo: ${motivo || 'No especificado'}`);

    res.json({ 
      success: true, 
      message: `Empresa "${empresa[0].nombre}" suspendida correctamente`,
      empresa: {
        id: id,
        nombre: empresa[0].nombre,
        email: empresa[0].email,
        motivo: motivo || null
      }
    });

  } catch (error) {
    console.error('❌ Error suspendiendo empresa:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al suspender empresa' 
    });
  }
});

/**
 * Extender período de prueba
 * POST /api/admin/extender-prueba/:id
 */
router.post('/extender-prueba/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { dias } = req.body; // Días adicionales a agregar

    if (!dias || dias <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Debe especificar un número válido de días' 
      });
    }

    // Obtener empresa
    const [empresa] = await pool.query(
      'SELECT nombre, fecha_expiracion FROM empresas WHERE id_empresa = ?',
      [id]
    );

    if (empresa.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Empresa no encontrada' 
      });
    }

    // Calcular nueva fecha de expiración
    const fechaBase = empresa[0].fecha_expiracion ? new Date(empresa[0].fecha_expiracion) : new Date();
    fechaBase.setDate(fechaBase.getDate() + parseInt(dias));

    // Actualizar
    await pool.query(`
      UPDATE empresas 
      SET fecha_expiracion = ?,
          estado_suscripcion = 'trial'
      WHERE id_empresa = ?
    `, [fechaBase, id]);

    console.log(`⏰ Prueba extendida: ${empresa[0].nombre} - ${dias} días adicionales`);

    res.json({ 
      success: true, 
      message: `Período de prueba extendido por ${dias} días`,
      nuevaFechaExpiracion: fechaBase
    });

  } catch (error) {
    console.error('❌ Error extendiendo prueba:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al extender período de prueba' 
    });
  }
});

module.exports = router;
