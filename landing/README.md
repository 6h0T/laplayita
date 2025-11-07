# 🏖️ La Playita - Landing Page

Landing page moderna y responsive para el sistema de gestión de estacionamiento "La Playita".

## 🚀 Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Lucide React** - Iconos modernos

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Modo desarrollo (puerto 3001)
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start
```

## 🎨 Características

- ✅ Diseño moderno con gradientes pastel
- ✅ Totalmente responsive
- ✅ Optimizado para SEO
- ✅ Componentes reutilizables
- ✅ Navegación suave con scroll
- ✅ Integración con sistema principal (puerto 3000)

## 📁 Estructura

```
landing/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Layout principal
│   │   ├── page.tsx         # Página home
│   │   └── globals.css      # Estilos globales
│   └── components/
│       ├── Navbar.tsx       # Barra de navegación
│       ├── Hero.tsx         # Sección hero
│       ├── Features.tsx     # Características
│       ├── Benefits.tsx     # Beneficios
│       ├── Pricing.tsx      # Planes y precios
│       ├── CTA.tsx          # Call to action
│       └── Footer.tsx       # Pie de página
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## 🌐 Puertos

- **Landing Page**: http://localhost:3001
- **Sistema Principal**: http://localhost:3000

## 🎨 Paleta de Colores

- **Primary**: #7986cb (Azul pastel)
- **Secondary**: #5c6bc0 (Azul oscuro)
- **Accent Orange**: #ffab91
- **Accent Pink**: #f48fb1

## 📝 Secciones

1. **Hero** - Presentación principal con CTA
2. **Features** - 8 características principales
3. **Benefits** - Beneficios con estadísticas
4. **Pricing** - 3 planes (Básico, Profesional, Empresarial)
5. **CTA** - Llamado a la acción final
6. **Footer** - Información de contacto y enlaces

## 🔗 Integración

La landing page está diseñada para funcionar independientemente del sistema principal. Los botones de "Acceder al Sistema" redirigen a `http://localhost:3000`.

## 📱 Responsive

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚢 Deployment

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
.next
```

## 📄 Licencia

Propiedad de La Playita - Sistema de Gestión de Estacionamiento
