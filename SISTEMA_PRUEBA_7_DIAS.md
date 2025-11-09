# 🎯 Sistema de Prueba de 7 Días - La Playita

## ✅ Sistema Completamente Implementado

El sistema de prueba de 7 días ya está funcionando automáticamente.

---

## 📊 Cómo Funciona

### 1. **Registro del Usuario**

Cuando un usuario se registra en `/registro`:

```javascript
// Se calcula automáticamente
fecha_expiracion = HOY + 7 días
estado_suscripcion = 'trial'
```

**Ejemplo:**
- Registro: 9 de noviembre 2025
- Expiración: 16 de noviembre 2025 23:59:59

### 2. **Contador en Tiempo Real**

El banner muestra días restantes calculados en tiempo real:

```javascript
diasRestantes = Math.ceil((fecha_expiracion - HOY) / (1000 * 60 * 60 * 24))
```

**Se actualiza:**
- ✅ Cada vez que el usuario carga una página
- ✅ Cada vez que hace una petición al API
- ✅ Automáticamente sin intervención manual

### 3. **Bloqueo Automático**

El middleware `checkSubscription` verifica en **cada petición**:

```
Usuario hace petición
    ↓
Middleware verifica estado
    ↓
¿fecha_expiracion < HOY?
    ↓
SÍ → Bloquea acceso (403)
    - Actualiza estado a "expired"
    - Muestra mensaje de contacto
    ↓
NO → Permite acceso
    - Muestra días restantes
```

---

## 🔒 Rutas Protegidas

Estas rutas verifican automáticamente la suscripción:

- ✅ `/api/vehiculos` - Gestión de vehículos
- ✅ `/api/movimientos` - Entradas/salidas
- ✅ `/api/dashboard` - Dashboard principal
- ✅ `/api/reportes` - Reportes
- ✅ `/api/turnos` - Gestión de turnos
- ✅ `/api/pagos` - Gestión de pagos

**Rutas sin verificación** (acceso siempre):
- `/api/auth/login` - Login
- `/api/registro` - Registro
- `/api/suscripcion/estado` - Ver estado

---

## 🎨 Banner de Días Restantes

### Ubicación
- Aparece en la parte superior del dashboard
- No tapa el sidebar
- Se puede cerrar con la X

### Estados del Banner

**1. Más de 3 días restantes (Azul/Morado)**
```
⏰ Te quedan 5 días de prueba gratis
```

**2. 3 días o menos (Rojo/Rosa - Urgente)**
```
⚠️ Te quedan 2 días de prueba gratis
```

**3. Expirado (No se muestra banner, se bloquea)**
```
❌ Acceso bloqueado
Mensaje: "Tu prueba de 7 días ha terminado"
```

---

## 📅 Estados de Suscripción

### `trial` - Período de Prueba
- Duración: 7 días desde el registro
- Acceso completo al sistema
- Banner visible con días restantes

### `active` - Suscripción Activa (Pagada)
- Sin límite de tiempo
- Sin banner de prueba
- Acceso completo

### `expired` - Expirada
- **Acceso bloqueado automáticamente**
- Mensaje: "Contáctanos para activar tu cuenta"
- No puede usar el sistema

### `suspended` - Suspendida
- Bloqueada manualmente por admin
- Similar a expired

---

## 🔧 Configuración en Supabase

### Tabla `empresas`

```sql
CREATE TABLE empresas (
    id_empresa SERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    email VARCHAR(255),
    estado_suscripcion VARCHAR(20) DEFAULT 'trial',
    fecha_expiracion TIMESTAMP,
    fecha_registro TIMESTAMP DEFAULT NOW(),
    activa BOOLEAN DEFAULT true
);
```

### Campos Importantes

- **`fecha_expiracion`**: Fecha exacta de expiración (automática)
- **`estado_suscripcion`**: `trial`, `active`, `expired`, `suspended`
- **`fecha_registro`**: Fecha de creación de la cuenta

---

## 🚀 Flujo Completo

### Día 1 (Registro)
```
Usuario se registra
↓
fecha_expiracion = HOY + 7 días
estado = 'trial'
↓
Banner: "⏰ Te quedan 7 días de prueba gratis"
```

### Día 5 (Durante la prueba)
```
Usuario ingresa al dashboard
↓
Middleware calcula: 7 - 5 = 2 días restantes
↓
Banner: "⚠️ Te quedan 2 días de prueba gratis"
```

### Día 8 (Expirado)
```
Usuario intenta ingresar
↓
Middleware detecta: HOY > fecha_expiracion
↓
Actualiza estado a 'expired'
↓
Bloquea acceso (403)
↓
Mensaje: "Tu prueba ha terminado. Contáctanos."
```

---

## 📞 Contacto al Expirar

Cuando la prueba expira, se muestra:

```json
{
  "success": false,
  "error": "Período de prueba finalizado",
  "mensaje": "Tu prueba de 7 días ha terminado. Contáctanos para continuar.",
  "bloqueado": true,
  "contacto": {
    "email": "laplayitaestacionamiento@gmail.com",
    "whatsapp": "+54 9 261 123-4567"
  }
}
```

---

## ✅ Ventajas del Sistema

1. **Automático**: No requiere intervención manual
2. **Tiempo Real**: Calcula días exactos en cada petición
3. **Seguro**: Bloquea automáticamente al expirar
4. **Transparente**: Usuario siempre ve días restantes
5. **Flexible**: Fácil cambiar de trial a active

---

## 🔄 Activar Suscripción Pagada

Para convertir una cuenta de prueba a pagada:

```sql
UPDATE empresas 
SET 
    estado_suscripcion = 'active',
    fecha_expiracion = NULL,
    plan = 'premium'
WHERE id_empresa = [ID];
```

Después de esto:
- ✅ Sin límite de tiempo
- ✅ Sin banner de prueba
- ✅ Acceso completo permanente

---

## 📊 Monitoreo

### Ver Empresas en Prueba

```sql
SELECT 
    nombre,
    email,
    fecha_registro,
    fecha_expiracion,
    EXTRACT(DAY FROM (fecha_expiracion - NOW())) as dias_restantes
FROM empresas
WHERE estado_suscripcion = 'trial'
ORDER BY fecha_expiracion ASC;
```

### Ver Empresas Expiradas

```sql
SELECT 
    nombre,
    email,
    fecha_expiracion
FROM empresas
WHERE estado_suscripcion = 'expired'
ORDER BY fecha_expiracion DESC;
```

---

## ✨ Resumen

- ✅ **Registro**: Automático 7 días de prueba
- ✅ **Contador**: Tiempo real, actualizado en cada carga
- ✅ **Banner**: Visible con días restantes
- ✅ **Bloqueo**: Automático al expirar
- ✅ **Mensaje**: Contacto para activar

**Todo funciona sin intervención manual** 🎉
