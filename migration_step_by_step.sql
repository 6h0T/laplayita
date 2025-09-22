-- PASO 1: Ejecutar primero para identificar vistas
-- Ejecutar en Supabase SQL Editor

SELECT schemaname, viewname, definition 
FROM pg_views 
WHERE schemaname = 'public' 
AND (definition ILIKE '%tipo%' OR definition ILIKE '%vehiculo%');

-- DESPUÉS DE VER LAS VISTAS, EJECUTAR LOS SIGUIENTES PASOS UNO POR UNO:

-- PASO 2: Eliminar vistas que dependen de la columna tipo
-- (Ejecutar solo si existe la vista)
-- DROP VIEW IF EXISTS v_movimientos_activos CASCADE;

-- PASO 3: Agregar nuevos valores al ENUM existente
-- ALTER TYPE vehiculo_type ADD VALUE IF NOT EXISTS 'auto';
-- ALTER TYPE vehiculo_type ADD VALUE IF NOT EXISTS 'camioneta';

-- PASO 4: Actualizar datos existentes en vehiculos
-- UPDATE vehiculos SET tipo = 'auto' WHERE tipo = 'carro';
-- UPDATE vehiculos SET tipo = 'camioneta' WHERE tipo = 'moto';  
-- UPDATE vehiculos SET tipo = 'moto' WHERE tipo = 'bici';

-- PASO 5: Actualizar datos existentes en tarifas
-- UPDATE tarifas SET tipo_vehiculo = 'auto' WHERE tipo_vehiculo = 'carro';
-- UPDATE tarifas SET tipo_vehiculo = 'camioneta' WHERE tipo_vehiculo = 'moto';
-- UPDATE tarifas SET tipo_vehiculo = 'moto' WHERE tipo_vehiculo = 'bici';

-- PASO 6: Recrear las vistas eliminadas (ajustar según la definición original)
-- CREATE OR REPLACE VIEW v_movimientos_activos AS ...

-- PASO 7: Verificar cambios
-- SELECT DISTINCT tipo FROM vehiculos;
-- SELECT DISTINCT tipo_vehiculo FROM tarifas;
