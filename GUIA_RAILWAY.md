# 🚂 Guía de Despliegue del Backend en Railway

## ¿Por qué Railway?

- ✅ **Gratis** para empezar ($5 de crédito mensual)
- ✅ Soporta **Node.js + PostgreSQL**
- ✅ Despliegue automático desde Git
- ✅ Base de datos incluida
- ✅ Variables de entorno fáciles de configurar

## 📋 Pasos para Desplegar

### 1. Crear Cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Click en **"Start a New Project"**
3. Inicia sesión con GitHub

### 2. Crear Nuevo Proyecto

1. Click en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Conecta tu repositorio
4. Railway detectará automáticamente que es un proyecto Node.js

### 3. Agregar Base de Datos PostgreSQL

1. En tu proyecto, click en **"+ New"**
2. Selecciona **"Database"** → **"Add PostgreSQL"**
3. Railway creará automáticamente la base de datos
4. Las variables de entorno se configuran automáticamente

### 4. Configurar Variables de Entorno

Railway ya configura automáticamente:
- `DATABASE_URL` - URL de conexión a PostgreSQL

Pero debes agregar manualmente:

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=tu-secret-super-seguro-aqui
```

**Pasos:**
1. Click en tu servicio Node.js
2. Ve a **"Variables"**
3. Agrega cada variable
4. Click en **"Deploy"**

### 5. Configurar el Start Command

Railway debería detectar automáticamente el comando, pero si no:

1. Click en **"Settings"**
2. En **"Start Command"** pon: `node src/server.js`
3. Guarda los cambios

### 6. Obtener la URL del Backend

1. Ve a **"Settings"** de tu servicio
2. En **"Domains"** verás algo como: `tu-proyecto.up.railway.app`
3. **Copia esta URL** - la necesitarás para Vercel

### 7. Migrar la Base de Datos

Conecta a la base de datos de Railway y ejecuta el schema:

**Opción A: Desde Railway Dashboard**
1. Click en tu base de datos PostgreSQL
2. Ve a **"Data"** → **"Query"**
3. Copia y pega el contenido de `schema.sql`
4. Ejecuta

**Opción B: Desde tu máquina local**
```bash
# Railway te da la URL de conexión en las variables
psql "postgresql://usuario:password@host:puerto/database" < schema.sql
```

### 8. Configurar CORS

Edita tu archivo `src/server.js` para permitir el dominio de Vercel:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://laplayita.vercel.app',
    'http://localhost:3001' // Para desarrollo
  ],
  credentials: true
}));
```

### 9. Actualizar Vercel

Ahora configura la variable en Vercel:

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. **Settings** → **Environment Variables**
3. Agrega:
   - **Key:** `NEXT_PUBLIC_BACKEND_URL`
   - **Value:** `https://tu-proyecto.up.railway.app` (sin trailing slash)
4. **Redeploy** tu proyecto

## 🎯 Estructura Final

```
Landing (Vercel)
└── laplayita.vercel.app
    ├── / (página principal)
    ├── /dashboard → Redirige a ↓
    └── /registro → Redirige a ↓

Backend (Railway)
└── tu-proyecto.up.railway.app
    ├── /index.html (sistema de gestión)
    ├── /registro.html (formulario)
    ├── /api/* (endpoints)
    └── PostgreSQL Database
```

## ✅ Verificación

Después del despliegue, verifica:

1. **Backend funciona:**
   - Visita `https://tu-proyecto.up.railway.app/index.html`
   - Deberías ver el login del sistema

2. **Landing redirige correctamente:**
   - Visita `https://laplayita.vercel.app/dashboard`
   - Debería redirigir al backend

3. **Base de datos conectada:**
   - Intenta hacer login en el sistema
   - Verifica que los datos se guarden

## 💰 Costos

Railway ofrece:
- **$5 USD de crédito mensual GRATIS**
- Suficiente para:
  - 1 servicio Node.js pequeño
  - 1 base de datos PostgreSQL pequeña
  - Tráfico moderado

Si necesitas más, los planes pagos empiezan en $5/mes.

## 🆘 Problemas Comunes

### "Application failed to respond"
- Verifica que el `PORT` esté configurado correctamente
- Railway asigna el puerto automáticamente, usa: `process.env.PORT || 3000`

### "Database connection failed"
- Verifica que `DATABASE_URL` esté en las variables
- Railway la configura automáticamente al agregar PostgreSQL

### "CORS error"
- Agrega el dominio de Vercel al array de `cors.origin`
- Redespliega el backend

## 📞 Soporte

- Documentación: [docs.railway.app](https://docs.railway.app)
- Discord: [railway.app/discord](https://railway.app/discord)
- Twitter: [@Railway](https://twitter.com/Railway)

## 🎉 ¡Listo!

Una vez desplegado en Railway:
1. Copia la URL de Railway
2. Configúrala en Vercel como `NEXT_PUBLIC_BACKEND_URL`
3. Redespliega Vercel
4. ¡Tu sistema estará 100% funcional! 🚀
