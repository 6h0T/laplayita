# 🔧 Configuración de Supabase para La Playita

## ✅ Sistema Migrado a Next.js

Ahora todo el sistema está en Next.js:
- ✅ Landing page
- ✅ Registro de usuarios
- ✅ Login
- ✅ Conexión directa a Supabase

## 📋 Pasos para Configurar

### 1. Obtener Credenciales de Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Abre tu proyecto
3. Ve a **Settings** → **API**

Necesitas copiar:
- **Project URL** (ej: `https://xxxxx.supabase.co`)
- **anon public** key
- **service_role** key (secret)

### 2. Crear archivo .env.local

En la carpeta `landing/`, crea un archivo `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# JWT Secret
JWT_SECRET=27475a86665a3899d0859cd13bfdd8ff2a9764c8241caa33870a99ecde8f8da8c6c3f8deb6e0b635ca86bdb5c7d12355407b9aa2154f72a648595468b8367552
```

### 3. Configurar Variables en Vercel

1. Ve a [vercel.com](https://vercel.com) → Tu proyecto
2. **Settings** → **Environment Variables**
3. Agrega las mismas 4 variables del `.env.local`
4. Aplica a: Production, Preview, Development

### 4. Verificar Tablas en Supabase

Asegúrate de que tu base de datos Supabase tenga las tablas:
- `empresas`
- `usuarios`
- `configuracion_empresa`
- `tarifas`
- `vehiculos`
- `movimientos`
- etc.

Si no las tienes, ejecuta el schema SQL en Supabase.

## 🚀 Desplegar

```bash
# Commit y push
git add .
git commit -m "Migración completa a Next.js con Supabase"
git push
```

Vercel redesplegar automáticamente.

## 🎯 URLs Finales

- **Landing:** `https://laplayita.vercel.app`
- **Registro:** `https://laplayita.vercel.app/registro`
- **Login:** `https://laplayita.vercel.app/login`
- **Dashboard:** `https://laplayita.vercel.app/dashboard` (próximamente)

## ✅ Ventajas de esta Arquitectura

1. **Todo en un solo dominio** - No más redirecciones confusas
2. **Más rápido** - Next.js es más rápido que Express
3. **Más simple** - No necesitas Railway
4. **Más profesional** - Stack moderno (Next.js + Supabase)
5. **Gratis** - Vercel + Supabase tier gratuito

## 🗑️ Puedes Eliminar

Ya no necesitas:
- ❌ Railway (backend Express)
- ❌ Carpeta `/public` con HTML estáticos
- ❌ Carpeta `/src` con Express
- ❌ `server.js`

Todo ahora está en Next.js.

## 📝 Próximos Pasos

1. Configurar variables de entorno
2. Desplegar a Vercel
3. Probar registro y login
4. Migrar el dashboard a Next.js (siguiente fase)
