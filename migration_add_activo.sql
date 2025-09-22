-- Migración para agregar campo 'activo' a la tabla vehiculos
-- Ejecutar en Supabase SQL Editor

-- Agregar la columna activo con valor por defecto TRUE
ALTER TABLE vehiculos ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE;

-- Actualizar todos los registros existentes para que sean activos
UPDATE vehiculos SET activo = TRUE WHERE activo IS NULL;

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'vehiculos' AND column_name = 'activo';
