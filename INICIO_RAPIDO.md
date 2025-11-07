# 🚀 Inicio Rápido - La Playita

Guía rápida para iniciar tanto el sistema de parqueadero como la landing page.

## 📋 Requisitos Previos

- Node.js 18+ instalado
- PostgreSQL 12+ instalado y corriendo
- Git (opcional)

## 🎯 Opción 1: Iniciar Todo el Sistema

### 1. Sistema de Parqueadero (Backend + Frontend)

```bash
# En la raíz del proyecto
npm install
node crear_usuario_ejemplo.js
npm run dev
```

**URL:** http://localhost:3000

**Credenciales por defecto:**
- Número de Cliente: `000000001`
- Usuario: `admin`
- Contraseña: `admin123`

### 2. Landing Page (Next.js)

```bash
# En otra terminal
cd landing
npm install
npm run dev
```

**URL:** http://localhost:3001

---

## 🔧 Configuración Inicial

### Base de Datos PostgreSQL

1. Crear base de datos:
```sql
CREATE DATABASE parqueadero;
```

2. Configurar `.env` en la raíz:
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

3. Ejecutar migraciones (si es necesario):
```bash
# Aplicar schema
psql -U postgres -d parqueadero -f schema_supabase.sql
```

---

## 📦 Estructura de Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Sistema Principal | 3000 | http://localhost:3000 |
| Landing Page | 3001 | http://localhost:3001 |
| PostgreSQL | 5432 | localhost:5432 |

---

## 🎨 Flujo de Trabajo Recomendado

### Para Desarrollo:

1. **Terminal 1** - Sistema Principal:
```bash
npm run dev
```

2. **Terminal 2** - Landing Page:
```bash
cd landing
npm run dev
```

### Para Producción:

1. **Sistema Principal:**
```bash
npm start
```

2. **Landing Page:**
```bash
cd landing
npm run build
npm start
```

---

## 🔍 Verificación Rápida

### Sistema Principal
- ✅ Accede a http://localhost:3000
- ✅ Deberías ver la página de login
- ✅ Inicia sesión con las credenciales por defecto

### Landing Page
- ✅ Accede a http://localhost:3001
- ✅ Deberías ver la landing moderna
- ✅ Los botones "Acceder al Sistema" redirigen a :3000

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port already in use"
```bash
# Cambiar puerto en package.json o .env
# O matar el proceso:
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### Error de Base de Datos
```bash
# Verificar que PostgreSQL esté corriendo
# Windows:
services.msc (buscar PostgreSQL)

# Linux/Mac:
sudo systemctl status postgresql
```

---

## 📚 Documentación Adicional

- [README Principal](README.md) - Documentación completa del sistema
- [README Landing](landing/README.md) - Documentación de la landing page
- [Análisis del Proyecto](ANALISIS_PROYECTO.md) - Análisis técnico detallado

---

## 🎯 Próximos Pasos

1. ✅ Personalizar colores y logo en la landing
2. ✅ Configurar tarifas en el sistema
3. ✅ Crear usuarios adicionales
4. ✅ Probar flujo completo de ingreso/salida
5. ✅ Configurar backup de base de datos

---

## 💡 Tips Útiles

- **Hot Reload:** Ambos proyectos tienen hot reload activado
- **Logs:** Revisa la consola para errores
- **Database:** Usa pgAdmin o DBeaver para gestionar PostgreSQL
- **API:** El sistema expone API REST en `/api/*`

---

¿Necesitas ayuda? Revisa la documentación completa en [README.md](README.md)
