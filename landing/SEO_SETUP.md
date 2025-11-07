# Configuración de SEO y Métricas - La Playita Landing

## 📦 Instalación de Dependencias

Para instalar las métricas de Vercel, ejecuta:

```bash
npm install @vercel/analytics @vercel/speed-insights
```

O si usas yarn:

```bash
yarn add @vercel/analytics @vercel/speed-insights
```

## 🤖 Archivos de SEO Configurados

### 1. **robots.txt** (`/public/robots.txt`)
- ✅ Permite el rastreo de todos los bots
- ✅ Incluye referencia al sitemap
- ✅ Configurado con crawl-delay de 1 segundo

### 2. **sitemap.ts** (`/src/app/sitemap.ts`)
- ✅ Sitemap dinámico generado automáticamente
- ✅ Incluye todas las páginas principales
- ✅ Prioridades y frecuencias de actualización configuradas
- ✅ URLs:
  - Página principal (prioridad 1.0)
  - Secciones: inicio, características, beneficios, planes
  - Páginas legales: términos, privacidad, cookies

### 3. **Metadata Mejorado** (`/src/app/layout.tsx`)
- ✅ **SEO básico**: título, descripción, keywords
- ✅ **Open Graph**: para compartir en redes sociales
- ✅ **Twitter Cards**: optimizado para Twitter/X
- ✅ **Robots**: configuración para indexación
- ✅ **Favicons**: todos los tamaños configurados
- ✅ **Manifest**: PWA configurado

## 📊 Métricas de Vercel

### Analytics
Rastrea:
- Visitas a la página
- Páginas vistas
- Usuarios únicos
- Conversiones personalizadas

### Speed Insights
Mide:
- Core Web Vitals (LCP, FID, CLS)
- Rendimiento en dispositivos reales
- Puntuación de velocidad

## 🚀 Despliegue en Vercel

1. **Conecta tu repositorio** a Vercel
2. **Las métricas se activan automáticamente** al desplegar
3. **Accede al dashboard** en vercel.com para ver estadísticas

## 🔍 Verificación de Google Search Console

1. Ve a [Google Search Console](https://search.google.com/search-console)
2. Agrega tu propiedad (dominio o URL)
3. Copia el código de verificación
4. Reemplaza `'google-site-verification-code'` en `layout.tsx` línea 73

## 📈 Monitoreo

### URLs importantes para verificar:
- **Sitemap**: `https://laplayita.com/sitemap.xml`
- **Robots**: `https://laplayita.com/robots.txt`
- **Analytics**: Panel de Vercel
- **Search Console**: Google Search Console

## ✅ Checklist Post-Despliegue

- [ ] Instalar dependencias: `npm install`
- [ ] Verificar build: `npm run build`
- [ ] Desplegar en Vercel
- [ ] Verificar sitemap.xml funciona
- [ ] Verificar robots.txt funciona
- [ ] Configurar Google Search Console
- [ ] Enviar sitemap a Google Search Console
- [ ] Verificar métricas en dashboard de Vercel
- [ ] Probar Open Graph con [OpenGraph.xyz](https://www.opengraph.xyz/)
- [ ] Probar Twitter Cards con [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## 🎯 Optimizaciones SEO Implementadas

1. **Metadata completo** con Open Graph y Twitter Cards
2. **Sitemap XML** dinámico
3. **Robots.txt** optimizado
4. **URLs semánticas** con anclas (#inicio, #caracteristicas, etc.)
5. **Imágenes optimizadas** con alt text
6. **Responsive design** para todos los dispositivos
7. **Core Web Vitals** optimizados
8. **Métricas en tiempo real** con Vercel Analytics

## 📝 Notas

- Los errores de TypeScript sobre los módulos de Vercel desaparecerán después de ejecutar `npm install`
- Las métricas solo funcionan en producción (no en desarrollo local)
- El sitemap se genera automáticamente en cada build
- Actualiza la URL base en `sitemap.ts` si cambias el dominio
