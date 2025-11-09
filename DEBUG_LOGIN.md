# 🔍 Debug del Error 500 en Login

## Problema
El login en Railway está dando error 500 después de configurar Supabase.

## Posibles Causas

### 1. ❌ Tabla `login_attempts` no existe en Supabase
El código de login intenta insertar en `login_attempts` pero esta tabla puede no existir en Supabase.

### 2. ❌ Diferencias en el esquema de base de datos
- MySQL usa `CURRENT_TIMESTAMP`
- PostgreSQL necesita `NOW()`

### 3. ❌ Campo `contraseña` vs `password`
Verificar que el campo se llame igual en ambas bases de datos.

## 🔧 Solución Rápida

### Opción 1: Ver Logs en Railway

1. Ve a Railway → Tu servicio
2. Click en **"Deployments"**
3. Click en el último deployment
4. Busca el error exacto en los logs

### Opción 2: Verificar Tablas en Supabase

Ve a Supabase → Table Editor y verifica que existan:
- ✅ `empresas`
- ✅ `usuarios`
- ✅ `configuracion_empresa`
- ❓ `login_attempts` (puede faltar)

### Opción 3: Crear Tabla Faltante

Si `login_attempts` no existe, ejecuta en Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS login_attempts (
    id_intento SERIAL PRIMARY KEY,
    id_empresa INTEGER REFERENCES empresas(id_empresa),
    usuario_login VARCHAR(50),
    exitoso BOOLEAN DEFAULT false,
    ip_address VARCHAR(45),
    fecha_intento TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_login_attempts_empresa ON login_attempts(id_empresa);
CREATE INDEX idx_login_attempts_fecha ON login_attempts(fecha_intento);
```

## 🎯 Siguiente Paso

**Copia el error exacto de los logs de Railway** y lo revisamos juntos.

Para ver los logs:
1. Railway → laplayita → Deployments
2. Click en el deployment activo
3. Scroll hasta encontrar el error rojo
4. Copia el mensaje completo
