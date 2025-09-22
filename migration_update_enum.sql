-- Migración para actualizar el ENUM vehiculo_type
-- Ejecutar en Supabase SQL Editor

-- Paso 1: Agregar los nuevos valores al ENUM existente
ALTER TYPE vehiculo_type ADD VALUE IF NOT EXISTS 'auto';
ALTER TYPE vehiculo_type ADD VALUE IF NOT EXISTS 'camioneta';

-- Paso 2: Actualizar los datos existentes
UPDATE vehiculos SET tipo = 'auto' WHERE tipo = 'carro';
UPDATE vehiculos SET tipo = 'camioneta' WHERE tipo = 'moto';
UPDATE vehiculos SET tipo = 'moto' WHERE tipo = 'bici';

-- Paso 3: Actualizar las tarifas existentes
UPDATE tarifas SET tipo_vehiculo = 'auto' WHERE tipo_vehiculo = 'carro';
UPDATE tarifas SET tipo_vehiculo = 'camioneta' WHERE tipo_vehiculo = 'moto';
UPDATE tarifas SET tipo_vehiculo = 'moto' WHERE tipo_vehiculo = 'bici';

-- Paso 4: Actualizar movimientos existentes (si los hay)
-- Esto se hace a través de la tabla vehiculos, no directamente

-- Verificar los cambios
SELECT DISTINCT tipo FROM vehiculos;
SELECT DISTINCT tipo_vehiculo FROM tarifas;

-- Mostrar los valores del ENUM
SELECT enumlabel FROM pg_enum WHERE enumtypid = (
    SELECT oid FROM pg_type WHERE typname = 'vehiculo_type'
) ORDER BY enumsortorder;
