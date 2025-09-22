# 🏖️ La Playita - Sistema de Gestión para Playas de Estacionamiento

Sistema de gestión para playas de estacionamiento moderno y completo desarrollado con Node.js + Express y PostgreSQL. Diseñado especialmente para "La Playita" con una interfaz amigable y colores pastel.

## ✨ Características

- 🚗 **Gestión completa de vehículos** - Registro, edición y control de estado
- 🔐 **Autenticación segura** - JWT con control de intentos fallidos
- 💰 **Sistema de tarifas flexible** - Minuto, hora, día y mixto
- 📊 **Dashboard interactivo** - Estadísticas en tiempo real
- 🎫 **Tickets de salida** - Comprobantes automáticos con logo
- 📈 **Reportes completos** - KPIs, exportación a Excel
- 🎨 **Interfaz moderna** - Diseño pastel amigable con logo personalizado
- 🔄 **Turnos de caja** - Control de apertura/cierre
- 🏢 **Multi-empresa** - Soporte para múltiples playas de estacionamiento

## 🛠️ Requisitos

- Node.js 18+ y npm
- PostgreSQL 12+ (migrado desde MySQL/MariaDB)

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/TU_USUARIO/sistema-playas-estacionamiento-la-playita.git
   cd sistema-playas-estacionamiento-la-playita
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar PostgreSQL**
   - Crear base de datos `parqueadero`
   - Ejecutar migración: `node migration_timezone_argentina.sql`

4. **Configurar variables de entorno** (`.env`):
   ```env
   PORT=3000
   JWT_SECRET=tu_secreto_jwt_super_seguro
   
   # PostgreSQL
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=tu_password
   DB_NAME=parqueadero
   DB_PORT=5432
   ```

5. **Crear usuario inicial**
   ```bash
   node crear_usuario_ejemplo.js
   ```
   
   Esto creará:
   - 🏢 Empresa: "La Playita"
   - 👤 Usuario: `admin` / Contraseña: `admin123`
   - 🔢 Número Cliente: `000000001`

### Ejecución
- Desarrollo (con recarga si usa nodemon):
  ```bash
  npm run dev
  ```
- Producción:
  ```bash
  npm start
  ```
El servidor sirve la UI desde `public/` y expone la API bajo `/api/*`.

Página principal: `GET /` -> `public/index.html`

### Estructura del proyecto
```
src/
  server.js            # Configura Express, CORS, JSON y rutas, sirve /public
  config/db.js         # Pool MySQL/MariaDB usando mysql2/promise
  middleware/
    auth.js            # Verifica JWT en Authorization: Bearer <token>
    requireAdmin.js    # Exige rol admin
    validateLogin.js   # Valida payload de login
  routes/
    auth.js            # POST /api/auth/login
    vehiculos.js       # CRUD + historial, scoping por empresa
    movimientos.js     # Ingreso, salida (cálculo), factura/detalle
    tarifas.js         # Consulta y actualización de vigencias
    reportes.js        # KPIs, series, tablas, exportaciones a Excel
    dashboard.js       # Estadísticas del tablero
    turnos.js          # Apertura/cierre, resumen y detalle
    empresa.js         # Perfil y configuración de empresa, logo BLOB
public/
  index.html           # Landing/login
  admin/*.html         # Vistas de administración/operación
  js/*.js, css/*.css   # Recursos de UI
schema.sql             # Esquema, vistas, procedimiento y datos seed
```

### Autenticación
- Login: `POST /api/auth/login`
  - Body: `{ empresa: <NIT>, usuario: <string>, password: <string> }`
  - Valida intentos fallidos por ventana de 15 minutos y guarda auditoría en `login_attempts`.
  - Respuesta exitosa: `{ success, data: { token, ... }, message }`.
- Para acceder al resto de endpoints, incluya el header `Authorization: Bearer <token>`.

### Variables de entorno
- `PORT`: Puerto del servidor (default 3000)
- `JWT_SECRET`: Secreto para firmar/verificar JWT
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Conexión a la BD

### Endpoints principales (resumen)
- Vehículos `/api/vehiculos` (requiere token)
  - `GET /` listar por empresa
  - `GET /:id` obtener detalle
  - `GET /:id/historial` historial de movimientos + pagos
  - `POST /` crear
  - `PUT /:id` actualizar
  - `DELETE /:id` eliminar (si no tiene movimiento activo)
- Movimientos `/api/movimientos` (requiere token)
  - `POST /ingreso` registrar ingreso (auto-crea vehículo si no existe)
  - `POST /salida` registrar salida, calcula total y opcionalmente registra pago
  - `GET /detalle/:id` detalle
  - `GET /factura/:id` factura completa (para reimpresión)
- Tarifas `/api/tarifas` (requiere token; actualización típica para admin)
  - `GET /current` tarifas activas por tipo
  - `PUT /` crear nueva vigencia (desactiva la anterior del tipo)
- Reportes `/api/reportes` (requiere token)
  - `GET /kpis` KPIs del periodo
  - `GET /ingresos-por-dia` serie temporal total o por método
  - `GET /ingresos-por-metodo` distribución por método
  - `GET /movimientos` tabla paginada/filtrada
  - `GET /movimientos-ajustados` tabla con columnas por método prorrateadas
  - `GET /turnos` cierres de turno
  - `GET /turnos/export/xlsx` y `GET /export/xlsx` exportaciones a Excel
- Dashboard `/api/dashboard/stats` (requiere token)
- Turnos `/api/turnos` (requiere token)
  - `GET /actual` turno abierto
  - `GET /resumen` totales desde la apertura
  - `POST /abrir` abrir turno
  - `POST /cerrar` cerrar turno con totales del usuario
- Empresa `/api/empresa` (requiere token; admin para cambios)
  - `GET /me` datos de empresa
  - `GET /config` configuración operativa
  - `PUT /` actualizar datos básicos (admin)
  - `PUT /config` actualizar configuración (admin)
  - `GET /logo` devuelve logo (BLOB)
  - `POST /logo` subir logo (admin). Form field: `logo`

### Flujo típico de uso
1. Ejecutar `schema.sql` en MariaDB/MySQL.
2. Iniciar el servidor con `.env` configurado.
3. Ingresar con NIT de la empresa (seed) y usuario `admin`.
4. Ajustar tarifas según política (minuto/hora/día/mixto).
5. Registrar ingresos/salidas y pagos.
6. Consultar dashboard y reportes, exportar a Excel.
7. Abrir/cerrar turnos para control de caja.

### Scripts npm
- `npm start`: inicia servidor en `PORT`
- `npm run dev`: inicia con nodemon

### Notas
- `public/uploads/` (si existía en versiones previas) está ignorado; actualmente el logo se almacena como BLOB.
- Asegúrese de configurar `JWT_SECRET` en producción.

## 📸 Capturas de Pantalla

### 🏖️ Página de Login
- Logo circular del auto sonriente de "La Playita"
- Colores pastel suaves y modernos
- Interfaz amigable y responsive

### 📊 Dashboard
- Sidebar con gradiente azul pastel
- Estadísticas en tiempo real
- Logo circular en navegación

### 🚗 Gestión de Vehículos
- Estados: En parqueadero, Disponible, Desactivado
- Filtros avanzados
- Historial completo

## 🎨 Diseño

- **Paleta de colores**: Azul pastel (#7986cb, #5c6bc0)
- **Logo**: Auto naranja sonriente en contenedor circular
- **Tipografía**: Poppins (Google Fonts)
- **Framework**: Bootstrap 5.3

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu-email@ejemplo.com

---

⭐ ¡Dale una estrella si te gusta este proyecto!


