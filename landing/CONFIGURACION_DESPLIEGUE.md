# 🚀 Configuración de Despliegue - La Playita

## Problema Resuelto

El landing en Next.js ahora tiene rutas intermedias (`/dashboard` y `/registro`) que redirigen al sistema de gestión desplegado en el backend.

## 📋 Configuración Requerida

### 1. Variable de Entorno en Vercel

Debes configurar la siguiente variable de entorno en tu proyecto de Vercel:

**Variable:** `NEXT_PUBLIC_BACKEND_URL`  
**Valor:** URL donde está desplegado tu backend Express con el sistema de gestión

**Ejemplos:**
- `https://api.laplayita.com`
- `https://tu-proyecto.railway.app`
- `https://tu-proyecto.render.com`

### 2. Pasos en Vercel Dashboard

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Click en **Settings** → **Environment Variables**
3. Agrega:
   - **Key:** `NEXT_PUBLIC_BACKEND_URL`
   - **Value:** La URL de tu backend (sin trailing slash)
   - **Environments:** Production, Preview, Development
4. Click en **Save**
5. Ve a **Deployments** y haz **Redeploy** del último deployment

## 🔄 Flujo de Redirección

### Antes (❌ No funcionaba)
```
Landing → /index.html (404 en Vercel)
Landing → /registro.html (404 en Vercel)
```

### Ahora (✅ Funciona)
```
Landing → /dashboard → Redirige a: {BACKEND_URL}/index.html
Landing → /registro → Redirige a: {BACKEND_URL}/registro.html
```

## 📁 Archivos Creados

1. **`/src/app/dashboard/page.tsx`** - Página de redirección al sistema de gestión
2. **`/src/app/registro/page.tsx`** - Página de redirección al formulario de registro
3. **`.env.example`** - Ejemplo de variables de entorno

## 🔗 Enlaces Actualizados

Todos los CTAs ahora apuntan a rutas de Next.js:

- **Hero:** `/registro`
- **Pricing:** `/dashboard`
- **Navbar:** `/dashboard` (desktop y mobile)
- **Footer:** `/dashboard`

## 🎯 Despliegue del Backend

Debes desplegar el backend Express (carpeta raíz del proyecto) en alguna de estas plataformas:

### Opción 1: Railway
```bash
# Instala Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializa proyecto
railway init

# Despliega
railway up
```

### Opción 2: Render
1. Crea una cuenta en [render.com](https://render.com)
2. Click en **New** → **Web Service**
3. Conecta tu repositorio
4. Configura:
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
   - **Environment:** Node
5. Agrega las variables de entorno necesarias (DB, etc.)
6. Click en **Create Web Service**

### Opción 3: Heroku
```bash
# Login
heroku login

# Crea app
heroku create tu-app-name

# Despliega
git push heroku main
```

## ✅ Checklist Final

- [ ] Backend desplegado y funcionando
- [ ] Variable `NEXT_PUBLIC_BACKEND_URL` configurada en Vercel
- [ ] Redespliegue realizado en Vercel
- [ ] Probar `/dashboard` en producción
- [ ] Probar `/registro` en producción
- [ ] Verificar que redirige correctamente al backend

## 🆘 Solución de Problemas

### Error: "Redirigiendo a localhost"
- Verifica que `NEXT_PUBLIC_BACKEND_URL` esté configurada en Vercel
- Asegúrate de haber redespliegado después de agregar la variable

### Error: "Cannot GET /index.html"
- El backend no está desplegado o la URL es incorrecta
- Verifica que el backend esté corriendo y accesible

### Error: CORS
- Configura CORS en tu backend Express para permitir el dominio de Vercel
```javascript
app.use(cors({
  origin: ['https://laplayita.vercel.app', 'https://tu-dominio.com']
}));
```

## 📞 Próximos Pasos

1. Despliega el backend en Railway/Render/Heroku
2. Obtén la URL del backend desplegado
3. Configura `NEXT_PUBLIC_BACKEND_URL` en Vercel
4. Redespliega el landing
5. ¡Listo! 🎉
