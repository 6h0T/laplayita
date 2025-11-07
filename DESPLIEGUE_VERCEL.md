# 🚀 Guía de Despliegue en Vercel

## ✅ Configuración Completada

Ya se creó el archivo `vercel.json` que configura Vercel para servir la landing de Next.js como página principal.

## 📋 Pasos para Desplegar

### **1. Conectar con Vercel**

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Add New Project"
3. Importa tu repositorio de GitHub/GitLab/Bitbucket
4. O sube la carpeta manualmente

### **2. Configuración del Proyecto en Vercel**

Cuando Vercel te pida configuración, usa estos valores:

**Framework Preset:** Next.js

**Root Directory:** `landing` (⚠️ IMPORTANTE)

**Build Command:** `npm run build` (ya está configurado)

**Output Directory:** `.next` (ya está configurado)

**Install Command:** `npm install` (ya está configurado)

### **3. Variables de Entorno (Opcional)**

Si necesitas variables de entorno, agrégalas en Vercel:

- `NEXT_PUBLIC_API_URL` → URL de tu backend (si lo despliegas separado)
- Otras variables que necesites

### **4. Desplegar**

Haz clic en **"Deploy"** y espera unos minutos.

Vercel te dará una URL como: `https://tu-proyecto.vercel.app`

---

## 🌐 Configurar Dominio Personalizado

### **Opción 1: Dominio Propio**

1. Ve a "Settings" → "Domains" en tu proyecto de Vercel
2. Agrega tu dominio: `laplayita.com`
3. Configura los DNS según las instrucciones de Vercel
4. Espera la propagación (puede tomar hasta 24 horas)

### **Opción 2: Subdominio de Vercel**

Vercel te da un dominio gratis: `tu-proyecto.vercel.app`

---

## 📁 Estructura del Proyecto

```
Parqueadero - GRATUITA/
├── landing/                 ← Landing de Next.js (se despliega en Vercel)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .next/              ← Build generado
├── src/                    ← Backend Express (desplegar en Railway/Render)
├── public/                 ← Sistema de gestión HTML
├── vercel.json            ← Configuración de Vercel
└── package.json
```

---

## 🔄 Despliegue Automático

Vercel se conecta con tu repositorio Git y despliega automáticamente cuando:

- Haces push a la rama `main` o `master`
- Creas un Pull Request (preview deployment)

---

## 🎯 URLs Finales

Después del despliegue:

- **Landing:** `https://laplayita.com` (o tu dominio)
- **Backend:** Despliega el backend en Railway/Render
  - Ejemplo: `https://api.laplayita.com`

---

## 🔧 Configuración Avanzada

### **Redirecciones**

Si necesitas redirecciones, agrégalas en `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

### **Headers Personalizados**

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

---

## ✅ Checklist de Despliegue

- [x] Build de la landing completado (`npm run build`)
- [x] Archivo `vercel.json` creado
- [ ] Repositorio en GitHub/GitLab
- [ ] Proyecto creado en Vercel
- [ ] Root Directory configurado como `landing`
- [ ] Despliegue exitoso
- [ ] Dominio personalizado configurado (opcional)
- [ ] Variables de entorno configuradas (si es necesario)
- [ ] Backend desplegado en Railway/Render
- [ ] URLs de API actualizadas en el frontend

---

## 🆘 Solución de Problemas

### **Error: "No Next.js build found"**
- Verifica que el Root Directory sea `landing`
- Asegúrate de que existe la carpeta `.next` después del build

### **Error: "Module not found"**
- Ejecuta `npm install` en la carpeta `landing`
- Verifica que todas las dependencias estén en `package.json`

### **La página no carga**
- Revisa los logs en Vercel Dashboard
- Verifica que el build se completó sin errores

### **Estilos no se cargan**
- Verifica que Tailwind CSS esté configurado correctamente
- Asegúrate de que `globals.css` se importa en `layout.tsx`

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel Dashboard
2. Consulta la documentación: [vercel.com/docs](https://vercel.com/docs)
3. Contacta al soporte de Vercel (muy rápido y útil)

---

## 🎉 ¡Listo!

Tu landing estará disponible en:
- `https://tu-proyecto.vercel.app` (Vercel)
- `https://laplayita.com` (tu dominio personalizado)

Las métricas de Vercel Analytics y Speed Insights se activarán automáticamente.
