-- Migración para actualizar zona horaria a Buenos Aires
-- Ejecutar en Supabase SQL Editor

-- Actualizar todas las configuraciones existentes para usar zona horaria de Buenos Aires
UPDATE configuracion_empresa 
SET zona_horaria = 'America/Argentina/Buenos_Aires' 
WHERE zona_horaria = 'America/Bogota' OR zona_horaria IS NULL;

-- Actualizar moneda por defecto a ARS (Peso Argentino)
UPDATE configuracion_empresa 
SET moneda = 'ARS' 
WHERE moneda = 'COP' OR moneda IS NULL;

-- Verificar los cambios
SELECT id_empresa, zona_horaria, moneda, horario_apertura, horario_cierre 
FROM configuracion_empresa;

-- Configurar zona horaria a nivel de sesión para verificar
SET timezone = 'America/Argentina/Buenos_Aires';

-- Configurar zona horaria a nivel de base de datos
ALTER DATABASE postgres SET timezone = 'America/Argentina/Buenos_Aires';

-- Verificar la zona horaria actual
SELECT current_setting('timezone') as zona_horaria_actual;
SELECT NOW() as fecha_hora_actual_buenos_aires;

-- Verificar que las fechas se muestren correctamente
SELECT 
    'Fecha actual en Buenos Aires' as descripcion,
    NOW() AT TIME ZONE 'America/Argentina/Buenos_Aires' as fecha_argentina,
    NOW() as fecha_utc;

-- Actualizar todas las fechas existentes si es necesario
-- (Esto es opcional, solo si hay datos con zona horaria incorrecta)
-- UPDATE movimientos SET fecha_entrada = fecha_entrada AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires';
-- UPDATE movimientos SET fecha_salida = fecha_salida AT TIME ZONE 'UTC' AT TIME ZONE 'America/Argentina/Buenos_Aires' WHERE fecha_salida IS NOT NULL;
