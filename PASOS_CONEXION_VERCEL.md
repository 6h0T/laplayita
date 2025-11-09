# 🔗 Conectar Vercel con Railway

## ✅ Pasos a Seguir

### 1. Obtener URL de Railway

1. Ve a [railway.app](https://railway.app)
2. Abre tu proyecto
3. Click en tu servicio Node.js
4. Ve a **Settings** → **Domains**
5. Copia la URL completa (ejemplo: `https://laplayita-backend.up.railway.app`)

### 2. Configurar Variable en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Selecciona tu proyecto **laplayita**
3. Click en **Settings** (arriba)
4. En el menú lateral, click en **Environment Variables**
5. Click en **Add New**

**Configura así:**
```
Key:   NEXT_PUBLIC_BACKEND_URL
Value: https://tu-proyecto.up.railway.app
```

⚠️ **IMPORTANTE:** 
- NO pongas `/` al final de la URL
- Debe empezar con `https://`
- Debe ser la URL exacta de Railway

6. En **Environments to apply**, selecciona:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

7. Click en **Save**

### 3. Redesplegar Vercel

Después de agregar la variable, debes redesplegar:

**Opción A: Desde el Dashboard**
1. Ve a **Deployments** (arriba)
2. Busca el último deployment exitoso
3. Click en los 3 puntos `...` a la derecha
4. Click en **Redeploy**
5. Confirma con **Redeploy**

**Opción B: Hacer un Push a Git**
```bash
# Si tienes Git configurado
git add .
git commit -m "Configurar conexión con Railway"
git push
```

### 4. Verificar que Funciona

Una vez redespliegado:

1. **Verifica el landing:**
   - Ve a `https://laplayita.vercel.app`
   - La página debe cargar normalmente

2. **Prueba la redirección al dashboard:**
   - Click en cualquier botón "Acceder al Sistema"
   - O ve directamente a: `https://laplayita.vercel.app/dashboard`
   - Deberías ser redirigido a: `https://tu-proyecto.up.railway.app/index.html`
   - Deberías ver el login del sistema

3. **Prueba la redirección al registro:**
   - Click en "Prueba Gratis por 7 Días"
   - O ve a: `https://laplayita.vercel.app/registro`
   - Deberías ser redirigido a: `https://tu-proyecto.up.railway.app/registro.html`
   - Deberías ver el formulario de registro

### 5. Probar el Sistema Completo

1. **Registra una empresa de prueba:**
   - Ve a `/registro`
   - Completa el formulario
   - Verifica que te redirige al login

2. **Haz login:**
   - Ingresa con las credenciales creadas
   - Deberías acceder al dashboard

3. **Prueba funcionalidades:**
   - Registra un vehículo
   - Registra entrada/salida
   - Verifica que todo funciona

## 🐛 Solución de Problemas

### Error: "Redirigiendo a localhost"
**Causa:** La variable `NEXT_PUBLIC_BACKEND_URL` no está configurada o no se aplicó.

**Solución:**
1. Verifica que la variable esté en Vercel
2. Asegúrate de haber redespliegado
3. Limpia caché del navegador (Ctrl + Shift + R)

### Error: "Cannot GET /index.html"
**Causa:** El backend en Railway no está corriendo o la URL es incorrecta.

**Solución:**
1. Ve a Railway y verifica que el servicio esté "Running" (verde)
2. Verifica los logs en Railway por errores
3. Prueba acceder directamente a la URL de Railway

### Error: "CORS policy"
**Causa:** El backend no permite el dominio de Vercel.

**Solución:**
Ya lo configuramos en `server.js`, pero verifica que el despliegue en Railway tenga el código actualizado.

### Error: "Database connection failed"
**Causa:** La base de datos no está conectada o no tiene las tablas.

**Solución:**
1. Ve a Railway → PostgreSQL
2. Click en **Data** → **Query**
3. Ejecuta el contenido de `schema.sql`

## ✅ Checklist Final

- [ ] URL de Railway obtenida
- [ ] Variable `NEXT_PUBLIC_BACKEND_URL` agregada en Vercel
- [ ] Vercel redespliegado
- [ ] Landing carga correctamente
- [ ] `/dashboard` redirige al backend
- [ ] `/registro` redirige al backend
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Sistema completo operativo

## 🎉 ¡Listo!

Si todos los pasos funcionan, tu sistema está 100% desplegado y operativo:

- **Landing:** `https://laplayita.vercel.app`
- **Sistema:** `https://tu-proyecto.up.railway.app`
- **Base de Datos:** PostgreSQL en Railway

## 📞 Siguiente Paso

Una vez que todo funcione, considera:
1. Configurar un dominio personalizado (opcional)
2. Configurar backups automáticos de la DB
3. Monitorear logs y métricas
4. ¡Empezar a usar el sistema! 🚀
