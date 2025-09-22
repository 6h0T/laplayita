-- Migración completa para recrear el ENUM vehiculo_type manejando vistas
-- Ejecutar en Supabase SQL Editor

-- Paso 1: Guardar la definición de las vistas que dependen de la columna tipo
-- Primero vamos a ver qué vistas existen
SELECT schemaname, viewname, definition 
FROM pg_views 
WHERE schemaname = 'public' 
AND (definition ILIKE '%tipo%' OR definition ILIKE '%vehiculo%');

-- Paso 2: Eliminar las vistas que dependen de la columna tipo
-- (Necesitamos hacer esto manualmente después de ver cuáles son)
DROP VIEW IF EXISTS v_movimientos_activos CASCADE;

-- Paso 3: Crear el nuevo ENUM con los valores correctos
CREATE TYPE vehiculo_type_new AS ENUM ('auto', 'camioneta', 'moto');

-- Paso 4: Actualizar la tabla vehiculos
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

-- Paso 5: Actualizar la tabla tarifas
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

-- Paso 6: Eliminar el ENUM antiguo y renombrar el nuevo
DROP TYPE vehiculo_type;
ALTER TYPE vehiculo_type_new RENAME TO vehiculo_type;

-- Paso 7: Recrear la vista v_movimientos_activos (si existía)
-- Nota: Ajusta esta definición según la vista original
CREATE OR REPLACE VIEW v_movimientos_activos AS
SELECT 
    m.id_movimiento,
    m.id_empresa,
    m.id_vehiculo,
    v.placa,
    v.tipo,
    v.color,
    m.fecha_entrada,
    m.id_tarifa,
    t.tipo_vehiculo,
    t.valor_hora,
    t.valor_minuto,
    m.id_usuario_entrada
FROM movimientos m
JOIN vehiculos v ON m.id_vehiculo = v.id_vehiculo
JOIN tarifas t ON m.id_tarifa = t.id_tarifa
WHERE m.fecha_salida IS NULL
AND m.estado = 'activo';

-- Paso 8: Verificar los cambios
SELECT DISTINCT tipo FROM vehiculos;
SELECT DISTINCT tipo_vehiculo FROM tarifas;

-- Paso 9: Mostrar los valores del ENUM actualizado
SELECT enumlabel FROM pg_enum WHERE enumtypid = (
    SELECT oid FROM pg_type WHERE typname = 'vehiculo_type'
) ORDER BY enumsortorder;
