const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middleware/auth');

// Obtener tarifas activas por tipo para la empresa
router.get('/current', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM tarifas WHERE id_empresa = ? AND activa = TRUE ORDER BY tipo_vehiculo`,
            [req.user.id_empresa]
        );
        res.json({ success: true, data: rows });
    } catch (e) {
        console.error('Error obteniendo tarifas activas:', e);
        res.status(500).json({ success: false, message: 'Error al obtener tarifas' });
    }
});

// Obtener todas las tarifas (activas e inactivas) para administración
router.get('/all', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT id_tarifa, tipo_vehiculo, valor_minuto, valor_hora, valor_dia_completo,
                    modo_cobro, paso_minutos_a_horas, paso_horas_a_dias, redondeo_horas, redondeo_dias,
                    fecha_vigencia_desde, fecha_vigencia_hasta, activa
             FROM tarifas 
             WHERE id_empresa = ? 
             ORDER BY tipo_vehiculo, fecha_vigencia_desde DESC`,
            [req.user.id_empresa]
        );
        res.json({ success: true, data: rows });
    } catch (e) {
        console.error('Error obteniendo todas las tarifas:', e);
        res.status(500).json({ success: false, message: 'Error al obtener tarifas' });
    }
});

// Obtener una tarifa específica por ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM tarifas WHERE id_tarifa = ? AND id_empresa = ?`,
            [req.params.id, req.user.id_empresa]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Tarifa no encontrada' });
        }
        
        res.json({ success: true, data: rows[0] });
    } catch (e) {
        console.error('Error obteniendo tarifa:', e);
        res.status(500).json({ success: false, message: 'Error al obtener la tarifa' });
    }
});

// Actualizar/crear nueva vigencia de tarifa por tipo
router.put('/', verifyToken, async (req, res) => {
    try {
        let {
            tipo_vehiculo,
            valor_minuto,
            valor_hora,
            valor_dia_completo,
            modo_cobro = 'mixto',
            paso_minutos_a_horas = 0,
            paso_horas_a_dias = 0,
            redondeo_horas = 'arriba',
            redondeo_dias = 'arriba'
        } = req.body;

        if (!tipo_vehiculo) {
            return res.status(400).json({ success: false, message: 'tipo_vehiculo es requerido' });
        }

        // Normalizar segun modo
        valor_minuto = Number(valor_minuto||0);
        valor_hora = Number(valor_hora||0);
        valor_dia_completo = Number(valor_dia_completo||0);
        if (modo_cobro === 'minuto') {
            if (valor_minuto <= 0) return res.status(400).json({success:false,message:'Debe definir valor por minuto > 0'});
            valor_hora = 0; valor_dia_completo = 0; paso_minutos_a_horas = 0; paso_horas_a_dias = 0;
        } else if (modo_cobro === 'hora') {
            if (valor_hora <= 0) return res.status(400).json({success:false,message:'Debe definir valor por hora > 0'});
            valor_minuto = 0; valor_dia_completo = 0; paso_minutos_a_horas = 0; paso_horas_a_dias = 0;
        } else if (modo_cobro === 'dia') {
            if (valor_dia_completo <= 0) return res.status(400).json({success:false,message:'Debe definir valor por día > 0'});
            valor_minuto = 0; valor_hora = 0; paso_minutos_a_horas = 0; paso_horas_a_dias = 0;
        } else { // mixto
            if (valor_minuto <= 0 || valor_hora <= 0 || valor_dia_completo <= 0) {
                return res.status(400).json({success:false,message:'En modo mixto todos los valores deben ser > 0'});
            }
        }

        // Usar transacciones con el adaptador PostgreSQL
        try {
            await pool.query('BEGIN');
            
            // Desactivar vigencia actual de ese tipo
            await pool.query(
                `UPDATE tarifas SET activa = FALSE, fecha_vigencia_hasta = CURRENT_TIMESTAMP
                 WHERE id_empresa = ? AND tipo_vehiculo = ? AND activa = TRUE`,
                [req.user.id_empresa, tipo_vehiculo]
            );
            
            // Insertar nueva
            const [ins] = await pool.query(
                `INSERT INTO tarifas (
                    id_empresa, tipo_vehiculo, valor_hora, valor_minuto, valor_dia_completo,
                    fecha_vigencia_desde, activa, modo_cobro, paso_minutos_a_horas, paso_horas_a_dias,
                    redondeo_horas, redondeo_dias
                ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, TRUE, ?, ?, ?, ?, ?)`,
                [
                    req.user.id_empresa,
                    tipo_vehiculo,
                    valor_hora,
                    valor_minuto,
                    valor_dia_completo,
                    modo_cobro,
                    paso_minutos_a_horas,
                    paso_horas_a_dias,
                    redondeo_horas,
                    redondeo_dias
                ]
            );
            
            await pool.query('COMMIT');
            res.json({ success: true, id_tarifa: ins.insertId, message: 'Tarifa actualizada' });
        } catch (e) {
            await pool.query('ROLLBACK');
            throw e;
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: 'Error al guardar la tarifa' });
    }
});

// Editar una tarifa específica (sin crear nueva vigencia)
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const {
            valor_minuto,
            valor_hora,
            valor_dia_completo,
            modo_cobro,
            paso_minutos_a_horas,
            paso_horas_a_dias,
            redondeo_horas,
            redondeo_dias
        } = req.body;

        // Verificar que la tarifa existe y pertenece a la empresa
        const [existing] = await pool.query(
            'SELECT * FROM tarifas WHERE id_tarifa = ? AND id_empresa = ?',
            [req.params.id, req.user.id_empresa]
        );

        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Tarifa no encontrada' });
        }

        // Actualizar la tarifa
        await pool.query(
            `UPDATE tarifas SET 
                valor_minuto = ?, valor_hora = ?, valor_dia_completo = ?,
                modo_cobro = ?, paso_minutos_a_horas = ?, paso_horas_a_dias = ?,
                redondeo_horas = ?, redondeo_dias = ?
             WHERE id_tarifa = ? AND id_empresa = ?`,
            [
                Number(valor_minuto || 0),
                Number(valor_hora || 0),
                Number(valor_dia_completo || 0),
                modo_cobro || 'mixto',
                Number(paso_minutos_a_horas || 0),
                Number(paso_horas_a_dias || 0),
                redondeo_horas || 'arriba',
                redondeo_dias || 'arriba',
                req.params.id,
                req.user.id_empresa
            ]
        );

        res.json({ success: true, message: 'Tarifa actualizada exitosamente' });
    } catch (e) {
        console.error('Error editando tarifa:', e);
        res.status(500).json({ success: false, message: 'Error al editar la tarifa' });
    }
});

// Activar/Desactivar una tarifa específica
router.patch('/:id/toggle', verifyToken, async (req, res) => {
    try {
        const { activa } = req.body;

        // Verificar que la tarifa existe y pertenece a la empresa
        const [existing] = await pool.query(
            'SELECT * FROM tarifas WHERE id_tarifa = ? AND id_empresa = ?',
            [req.params.id, req.user.id_empresa]
        );

        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Tarifa no encontrada' });
        }

        // Si se está activando, desactivar otras del mismo tipo
        if (activa) {
            await pool.query(
                'UPDATE tarifas SET activa = FALSE WHERE id_empresa = ? AND tipo_vehiculo = ? AND activa = TRUE',
                [req.user.id_empresa, existing[0].tipo_vehiculo]
            );
        }

        // Actualizar el estado de la tarifa
        await pool.query(
            `UPDATE tarifas SET 
                activa = ?, 
                fecha_vigencia_hasta = ${activa ? 'NULL' : 'CURRENT_TIMESTAMP'}
             WHERE id_tarifa = ? AND id_empresa = ?`,
            [activa, req.params.id, req.user.id_empresa]
        );

        const mensaje = activa ? 'Tarifa activada exitosamente' : 'Tarifa desactivada exitosamente';
        res.json({ success: true, message: mensaje });
    } catch (e) {
        console.error('Error cambiando estado de tarifa:', e);
        res.status(500).json({ success: false, message: 'Error al cambiar el estado de la tarifa' });
    }
});

module.exports = router;


