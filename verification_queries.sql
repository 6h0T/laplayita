-- Consultas de verificación después de la migración
-- Ejecutar en Supabase SQL Editor para confirmar que todo está correcto

-- 1. Verificar los valores del ENUM vehiculo_type
SELECT enumlabel as "Tipos de Vehículo Disponibles"
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'vehiculo_type')
ORDER BY enumsortorder;

-- 2. Verificar tipos en la tabla vehiculos
SELECT DISTINCT tipo as "Tipos en Vehículos", COUNT(*) as "Cantidad"
FROM vehiculos 
GROUP BY tipo
ORDER BY tipo;

-- 3. Verificar tipos en la tabla tarifas
SELECT DISTINCT tipo_vehiculo as "Tipos en Tarifas", COUNT(*) as "Cantidad"
FROM tarifas 
GROUP BY tipo_vehiculo
ORDER BY tipo_vehiculo;

-- 4. Verificar que las tarifas tienen los tipos correctos
SELECT id_tarifa, tipo_vehiculo, valor_hora, valor_minuto, activa
FROM tarifas
ORDER BY tipo_vehiculo;

-- 5. Verificar estructura de la tabla vehiculos (incluyendo campo activo)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'vehiculos'
ORDER BY ordinal_position;
