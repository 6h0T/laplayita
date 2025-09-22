-- Migración completa para recrear el ENUM vehiculo_type
-- Ejecutar en Supabase SQL Editor

-- Paso 1: Crear el nuevo ENUM con los valores correctos
CREATE TYPE vehiculo_type_new AS ENUM ('auto', 'camioneta', 'moto');

-- Paso 2: Actualizar la tabla vehiculos
ALTER TABLE vehiculos 
ALTER COLUMN tipo TYPE vehiculo_type_new 
USING (
    CASE 
        WHEN tipo::text = 'carro' THEN 'auto'::vehiculo_type_new
        WHEN tipo::text = 'moto' THEN 'camioneta'::vehiculo_type_new
        WHEN tipo::text = 'bici' THEN 'moto'::vehiculo_type_new
        ELSE 'auto'::vehiculo_type_new
    END
);

-- Paso 3: Actualizar la tabla tarifas
ALTER TABLE tarifas 
ALTER COLUMN tipo_vehiculo TYPE vehiculo_type_new 
USING (
    CASE 
        WHEN tipo_vehiculo::text = 'carro' THEN 'auto'::vehiculo_type_new
        WHEN tipo_vehiculo::text = 'moto' THEN 'camioneta'::vehiculo_type_new
        WHEN tipo_vehiculo::text = 'bici' THEN 'moto'::vehiculo_type_new
        ELSE 'auto'::vehiculo_type_new
    END
);

-- Paso 4: Eliminar el ENUM antiguo y renombrar el nuevo
DROP TYPE vehiculo_type;
ALTER TYPE vehiculo_type_new RENAME TO vehiculo_type;

-- Paso 5: Verificar los cambios
SELECT DISTINCT tipo FROM vehiculos;
SELECT DISTINCT tipo_vehiculo FROM tarifas;

-- Paso 6: Mostrar los valores del ENUM actualizado
SELECT enumlabel FROM pg_enum WHERE enumtypid = (
    SELECT oid FROM pg_type WHERE typname = 'vehiculo_type'
) ORDER BY enumsortorder;
