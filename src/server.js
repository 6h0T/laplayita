const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Configurar zona horaria para Buenos Aires
process.env.TZ = 'America/Argentina/Buenos_Aires';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Importar middlewares de autenticación
const auth = require('./middleware/auth');
const checkSubscription = require('./middleware/checkSubscription');

// ===== RUTAS PÚBLICAS (sin autenticación) =====
app.use('/api/registro', require('./routes/registro'));
app.use('/api/auth', require('./routes/auth'));

// ===== RUTAS PROTEGIDAS CON VERIFICACIÓN DE SUSCRIPCIÓN =====
// Estas rutas requieren login Y que la suscripción esté activa
app.use('/api/vehiculos', auth, checkSubscription, require('./routes/vehiculos'));
app.use('/api/movimientos', auth, checkSubscription, require('./routes/movimientos'));
app.use('/api/dashboard', auth, checkSubscription, require('./routes/dashboard'));
app.use('/api/reportes', auth, checkSubscription, require('./routes/reportes'));
app.use('/api/turnos', auth, checkSubscription, require('./routes/turnos'));
app.use('/api/pagos', auth, checkSubscription, require('./routes/pagos'));

// ===== RUTAS PROTEGIDAS SIN VERIFICACIÓN DE SUSCRIPCIÓN =====
// Estas permiten ver info básica aunque la suscripción esté expirada
app.use('/api/empresa', auth, require('./routes/empresa'));
app.use('/api/tarifas', auth, require('./routes/tarifas'));
app.use('/api/usuarios', auth, require('./routes/usuarios'));
app.use('/api/suscripcion', auth, require('./routes/suscripcion'));

// ===== RUTAS DE ADMINISTRACIÓN =====
app.use('/api/admin', require('./routes/admin'));

// Rutas de vistas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/dashboard.html'));
});

app.get('/admin/vehiculos', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/vehiculos.html'));
});

app.get('/admin/usuarios', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/usuarios.html'));
});

app.get('/operador/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/dashboard.html'));
});

app.get('/operador/vehiculos', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/vehiculos.html'));
});

// Rutas espejo con sufijo .html para compatibilidad con enlaces relativos
app.get('/operador/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/dashboard.html'));
});
app.get('/operador/vehiculos.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/vehiculos.html'));
});
app.get('/operador/ingreso-salida.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/ingreso-salida.html'));
});
app.get('/operador/ingreso-salida', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/ingreso-salida.html'));
});

app.get('/admin/reportes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/reportes.html'));
});
app.get('/admin/reportes.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/reportes.html'));
});

app.get('/admin/configuracion', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/configuracion.html'));
});
app.get('/admin/configuracion.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/configuracion.html'));
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});