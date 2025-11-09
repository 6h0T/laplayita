# 🏗️ Arquitectura del Sistema La Playita

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                         USUARIO                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              LANDING PAGE (Next.js)                          │
│              https://laplayita.vercel.app                    │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Home    │  │ Features │  │ Pricing  │  │   CTA    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  Rutas de Redirección:                                      │
│  • /dashboard  → Redirige al backend                        │
│  • /registro   → Redirige al backend                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Redirección
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           BACKEND EXPRESS (Node.js)                          │
│           https://tu-proyecto.up.railway.app                 │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Archivos HTML Estáticos                            │   │
│  │  • /index.html (Login)                              │   │
│  │  • /registro.html (Registro)                        │   │
│  │  • /admin/dashboard.html (Dashboard)                │   │
│  │  • /admin/vehiculos.html (Gestión)                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API REST                                           │   │
│  │  • /api/auth (Autenticación)                        │   │
│  │  • /api/vehiculos (CRUD Vehículos)                  │   │
│  │  • /api/movimientos (Ingresos/Salidas)              │   │
│  │  • /api/dashboard (Estadísticas)                    │   │
│  │  • /api/reportes (Reportes)                         │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Conexión DB
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              BASE DE DATOS PostgreSQL                        │
│              (Railway Database)                              │
│                                                              │
│  Tablas:                                                     │
│  • empresas                                                  │
│  • usuarios                                                  │
│  • vehiculos                                                 │
│  • movimientos                                               │
│  • tarifas                                                   │
│  • turnos                                                    │
│  • suscripciones                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Usuario

### 1️⃣ Usuario visita el Landing
```
Usuario → https://laplayita.vercel.app
         ↓
    Ve la landing page con información del producto
```

### 2️⃣ Usuario hace click en "Prueba Gratis"
```
Click en CTA → /registro
              ↓
    Redirección automática
              ↓
    https://tu-proyecto.up.railway.app/registro.html
              ↓
    Formulario de registro
```

### 3️⃣ Usuario se registra
```
Completa formulario → POST /api/registro
                     ↓
                Guarda en PostgreSQL
                     ↓
                Redirige a /index.html
```

### 4️⃣ Usuario accede al sistema
```
Login → POST /api/auth/login
       ↓
   Recibe JWT Token
       ↓
   Accede al dashboard
       ↓
   Gestiona vehículos, reportes, etc.
```

## 🌐 Dominios y URLs

| Componente | Dominio | Descripción |
|------------|---------|-------------|
| **Landing** | `laplayita.vercel.app` | Página de marketing (Next.js) |
| **Backend** | `tu-proyecto.up.railway.app` | Sistema de gestión + API |
| **Database** | Internal Railway URL | PostgreSQL (no expuesta públicamente) |

## 🔐 Seguridad

### Landing (Vercel)
- ✅ HTTPS automático
- ✅ Sin datos sensibles
- ✅ Solo redirecciones

### Backend (Railway)
- ✅ HTTPS automático
- ✅ JWT para autenticación
- ✅ CORS configurado
- ✅ Variables de entorno seguras
- ✅ Base de datos privada

## 📦 Tecnologías

### Frontend (Landing)
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **Dominio:** laplayita.vercel.app

### Backend
- **Runtime:** Node.js + Express
- **Database:** PostgreSQL
- **Auth:** JWT (JSON Web Tokens)
- **Hosting:** Railway
- **Dominio:** tu-proyecto.up.railway.app

### Base de Datos
- **Motor:** PostgreSQL 15
- **Hosting:** Railway
- **Backup:** Automático por Railway

## 💰 Costos Estimados

| Servicio | Plan | Costo Mensual |
|----------|------|---------------|
| **Vercel** | Hobby | **GRATIS** |
| **Railway** | Starter | **$5 USD** (incluye $5 de crédito gratis) |
| **Total** | | **~$0-5 USD/mes** |

## 🚀 Despliegue

### Landing (Ya desplegado)
- ✅ Vercel
- ✅ Dominio: laplayita.vercel.app
- ✅ Auto-deploy desde Git

### Backend (Por desplegar)
1. Crear proyecto en Railway
2. Conectar repositorio
3. Agregar PostgreSQL
4. Configurar variables de entorno
5. Desplegar

### Configuración Final
1. Obtener URL de Railway
2. Configurar en Vercel: `NEXT_PUBLIC_BACKEND_URL`
3. Redeploy en Vercel
4. ✅ Sistema completo funcionando

## 📝 Variables de Entorno

### Vercel (Landing)
```env
NEXT_PUBLIC_BACKEND_URL=https://tu-proyecto.up.railway.app
```

### Railway (Backend)
```env
DATABASE_URL=postgresql://... (auto-configurado por Railway)
PORT=3000 (auto-configurado por Railway)
JWT_SECRET=tu-secret-super-seguro
NODE_ENV=production
```

## ✅ Ventajas de esta Arquitectura

1. **Separación de Responsabilidades**
   - Landing para marketing
   - Backend para lógica de negocio

2. **Escalabilidad**
   - Cada componente puede escalar independientemente
   - Fácil agregar más servicios

3. **Seguridad**
   - Base de datos no expuesta públicamente
   - CORS configurado correctamente
   - JWT para autenticación

4. **Mantenimiento**
   - Despliegues independientes
   - Rollback fácil si algo falla
   - Logs separados por servicio

5. **Costo-Efectivo**
   - Vercel gratis para landing
   - Railway $5/mes para backend + DB
   - Sin costos ocultos

## 🎯 Próximos Pasos

1. [ ] Desplegar backend en Railway
2. [ ] Configurar variable en Vercel
3. [ ] Probar flujo completo
4. [ ] ¡Lanzar! 🚀
