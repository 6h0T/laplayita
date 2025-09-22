-- Esquema de Base de Datos para Sistema de Parqueadero Multi-Empresa
-- Gestor: PostgreSQL (Supabase)
-- Migrado desde MariaDB/MySQL

-- Crear tipos ENUM personalizados para PostgreSQL
CREATE TYPE plan_type AS ENUM ('basico', 'premium', 'enterprise');
CREATE TYPE rol_type AS ENUM ('admin', 'operador');
CREATE TYPE vehiculo_type AS ENUM ('auto', 'camioneta', 'moto');
CREATE TYPE metodo_pago_type AS ENUM ('efectivo', 'tarjeta', 'QR');
CREATE TYPE modo_cobro_type AS ENUM ('minuto', 'hora', 'dia', 'mixto');
CREATE TYPE redondeo_type AS ENUM ('arriba', 'exacto');
CREATE TYPE estado_movimiento_type AS ENUM ('activo', 'finalizado');
CREATE TYPE estado_turno_type AS ENUM ('abierto', 'cerrado');

-- Tabla de Empresas
CREATE TABLE empresas (
    id_empresa SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    numero_cliente VARCHAR(9) NOT NULL UNIQUE,
    direccion VARCHAR(200),
    telefono VARCHAR(20),
    email VARCHAR(100),
    logo_url BYTEA, -- LONGBLOB → BYTEA en PostgreSQL
    activa BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento TIMESTAMP,
    plan plan_type NOT NULL
);

-- Tabla de Usuarios del Sistema
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    usuario_login VARCHAR(50) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol rol_type NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa),
    CONSTRAINT uq_usuario_empresa UNIQUE (usuario_login, id_empresa)
);

-- Tabla para registrar intentos de inicio de sesión
CREATE TABLE login_attempts (
    id_intento SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL,
    usuario_login VARCHAR(50) NOT NULL,
    exitoso BOOLEAN NOT NULL,
    ip_address INET NOT NULL, -- Mejor tipo para IPs en PostgreSQL
    fecha_intento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa)
);

-- Índices para login_attempts
CREATE INDEX idx_usuario_login ON login_attempts(usuario_login);
CREATE INDEX idx_ip_address ON login_attempts(ip_address);
CREATE INDEX idx_fecha_intento ON login_attempts(fecha_intento);

-- Tabla de Configuración por Empresa
CREATE TABLE configuracion_empresa (
    id_configuracion SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL,
    capacidad_total_carros INTEGER NOT NULL DEFAULT 50,
    capacidad_total_motos INTEGER NOT NULL DEFAULT 30,
    capacidad_total_bicicletas INTEGER NOT NULL DEFAULT 20,
    horario_apertura TIME DEFAULT '06:00:00',
    horario_cierre TIME DEFAULT '22:00:00',
    iva_porcentaje DECIMAL(5,2) DEFAULT 19.00,
    moneda VARCHAR(10) DEFAULT 'ARS',
    zona_horaria VARCHAR(50) DEFAULT 'America/Argentina/Buenos_Aires',
    operacion_24h BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa)
);

-- Tabla de Vehículos
CREATE TABLE vehiculos (
    id_vehiculo SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL,
    placa VARCHAR(10) NOT NULL,
    tipo vehiculo_type NOT NULL,
    color VARCHAR(30) NOT NULL,
    modelo VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa),
    CONSTRAINT uq_placa_empresa UNIQUE (placa, id_empresa)
);

-- Tabla de Tarifas
CREATE TABLE tarifas (
    id_tarifa SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL,
    tipo_vehiculo vehiculo_type NOT NULL,
    valor_hora DECIMAL(10,2) NOT NULL,
    valor_minuto DECIMAL(10,2) NOT NULL,
    valor_dia_completo DECIMAL(10,2) NOT NULL,
    fecha_vigencia_desde TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_vigencia_hasta TIMESTAMP,
    activa BOOLEAN DEFAULT TRUE,
    -- Configuración de cobro
    modo_cobro modo_cobro_type NOT NULL DEFAULT 'mixto',
    paso_minutos_a_horas INTEGER NOT NULL DEFAULT 0, -- 0 = sin paso
    paso_horas_a_dias INTEGER NOT NULL DEFAULT 0,   -- 0 = sin paso
    redondeo_horas redondeo_type NOT NULL DEFAULT 'arriba',
    redondeo_dias redondeo_type NOT NULL DEFAULT 'arriba',
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa),
    CONSTRAINT chk_valores_no_negativos CHECK (
        valor_hora >= 0 AND 
        valor_minuto >= 0 AND 
        valor_dia_completo >= 0
    )
);

-- Tabla de Entradas/Salidas (Movimientos)
CREATE TABLE movimientos (
    id_movimiento SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL,
    id_vehiculo INTEGER NOT NULL,
    fecha_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_salida TIMESTAMP,
    id_tarifa INTEGER NOT NULL,
    total_a_pagar DECIMAL(10,2),
    id_usuario_entrada INTEGER NOT NULL,
    id_usuario_salida INTEGER,
    estado estado_movimiento_type DEFAULT 'activo',
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo),
    FOREIGN KEY (id_tarifa) REFERENCES tarifas(id_tarifa),
    FOREIGN KEY (id_usuario_entrada) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_usuario_salida) REFERENCES usuarios(id_usuario),
    CONSTRAINT chk_fechas CHECK (fecha_salida IS NULL OR fecha_salida >= fecha_entrada)
);

-- Tabla de Pagos
CREATE TABLE pagos (
    id_pago SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL,
    id_movimiento INTEGER NOT NULL,
    metodo_pago metodo_pago_type NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    referencia_pago VARCHAR(100),
    id_usuario INTEGER NOT NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa),
    FOREIGN KEY (id_movimiento) REFERENCES movimientos(id_movimiento),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    CONSTRAINT chk_monto_positivo CHECK (monto > 0)
);

-- Tabla de Turnos de Caja por usuario
CREATE TABLE turnos (
    id_turno SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    fecha_apertura TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    base_inicial DECIMAL(12,2) NOT NULL,
    observacion_apertura VARCHAR(255),
    fecha_cierre TIMESTAMP,
    total_efectivo DECIMAL(12,2),
    total_tarjeta DECIMAL(12,2),
    total_qr DECIMAL(12,2),
    total_general DECIMAL(12,2),
    diferencia DECIMAL(12,2),
    observacion_cierre VARCHAR(255),
    estado estado_turno_type NOT NULL DEFAULT 'abierto',
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Índices para optimización de consultas
CREATE INDEX idx_empresa_vehiculo ON vehiculos(id_empresa, placa);
CREATE INDEX idx_empresa_movimientos ON movimientos(id_empresa, fecha_entrada);
CREATE INDEX idx_empresa_pagos ON pagos(id_empresa, fecha_pago);
CREATE INDEX idx_turno_activo ON turnos(id_empresa, id_usuario, estado);

-- Vista de movimientos activos por empresa
CREATE VIEW v_movimientos_activos AS
SELECT 
    m.id_movimiento,
    m.id_empresa,
    v.placa,
    v.tipo,
    m.fecha_entrada,
    (CURRENT_TIMESTAMP - m.fecha_entrada) as tiempo_transcurrido,
    u.nombre as registrado_por
FROM movimientos m
JOIN vehiculos v ON m.id_vehiculo = v.id_vehiculo
JOIN usuarios u ON m.id_usuario_entrada = u.id_usuario
WHERE m.fecha_salida IS NULL;

-- Vista de ingresos por día por empresa
CREATE VIEW v_ingresos_diarios AS
SELECT 
    p.id_empresa,
    DATE(p.fecha_pago) as fecha,
    p.metodo_pago,
    COUNT(*) as cantidad_pagos,
    SUM(p.monto) as total_ingresos
FROM pagos p
GROUP BY p.id_empresa, DATE(p.fecha_pago), p.metodo_pago;

-- Función para calcular el total a pagar (reemplaza el procedimiento almacenado)
CREATE OR REPLACE FUNCTION calcular_total_pagar(
    p_id_movimiento INTEGER,
    p_id_empresa INTEGER
) RETURNS DECIMAL(10,2) AS $$
DECLARE
    v_fecha_entrada TIMESTAMP;
    v_fecha_salida TIMESTAMP;
    v_valor_hora DECIMAL(10,2);
    v_valor_minuto DECIMAL(10,2);
    v_valor_dia DECIMAL(10,2);
    v_minutos INTEGER;
    v_dias INTEGER;
    v_horas INTEGER;
    v_minutos_restantes INTEGER;
    v_total DECIMAL(10,2);
BEGIN
    -- Obtener datos necesarios
    SELECT 
        m.fecha_entrada,
        COALESCE(m.fecha_salida, CURRENT_TIMESTAMP),
        t.valor_hora,
        t.valor_minuto,
        t.valor_dia_completo
    INTO 
        v_fecha_entrada,
        v_fecha_salida,
        v_valor_hora,
        v_valor_minuto,
        v_valor_dia
    FROM movimientos m
    JOIN tarifas t ON m.id_tarifa = t.id_tarifa
    WHERE m.id_movimiento = p_id_movimiento 
    AND m.id_empresa = p_id_empresa;
    
    -- Calcular diferencia en minutos
    v_minutos := EXTRACT(EPOCH FROM (v_fecha_salida - v_fecha_entrada)) / 60;
    
    -- Calcular días, horas y minutos
    v_dias := FLOOR(v_minutos / (24 * 60));
    v_minutos_restantes := v_minutos % (24 * 60);
    v_horas := FLOOR(v_minutos_restantes / 60);
    v_minutos_restantes := v_minutos_restantes % 60;
    
    -- Calcular total
    v_total := (v_dias * v_valor_dia) + 
               (v_horas * v_valor_hora) + 
               (v_minutos_restantes * v_valor_minuto);
    
    RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- Insertar empresa de ejemplo
INSERT INTO empresas (nombre, numero_cliente, direccion, telefono, email, plan)
VALUES ('Parqueadero Central', 'ABC123XYZ', 'Calle Principal #123', '3001234567', 'info@parqueaderocentral.com', 'premium');

-- Insertar configuración de la empresa
INSERT INTO configuracion_empresa (id_empresa, capacidad_total_carros, capacidad_total_motos, capacidad_total_bicicletas)
VALUES (1, 100, 50, 30);

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (id_empresa, nombre, usuario_login, contraseña, rol)
VALUES (1, 'Administrador', 'admin', '$2a$10$8GB5OFGTizEbMiuu1TSDWeAls/TRzA0l8EjWyahpk6Y6wXDYmTai6', 'admin');
 
-- Tarifas de ejemplo por empresa 1
INSERT INTO tarifas (id_empresa, tipo_vehiculo, valor_hora, valor_minuto, valor_dia_completo, activa)
VALUES
(1, 'auto', 6000.00, 120.00, 30000.00, TRUE),
(1, 'camioneta', 4500.00, 90.00, 22500.00, TRUE),
(1, 'moto', 3000.00, 60.00, 15000.00, TRUE);

-- Habilitar Row Level Security (RLS) para multi-tenancy en Supabase
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tarifas ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_empresa ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (se pueden personalizar según necesidades)
-- Ejemplo: Los usuarios solo pueden ver datos de su empresa
CREATE POLICY "Users can only see their company data" ON vehiculos
    FOR ALL USING (id_empresa = current_setting('app.current_empresa_id')::INTEGER);

CREATE POLICY "Users can only see their company movements" ON movimientos
    FOR ALL USING (id_empresa = current_setting('app.current_empresa_id')::INTEGER);

CREATE POLICY "Users can only see their company payments" ON pagos
    FOR ALL USING (id_empresa = current_setting('app.current_empresa_id')::INTEGER);

-- Comentarios para documentación
COMMENT ON TABLE empresas IS 'Tabla central del sistema multi-empresa';
COMMENT ON TABLE usuarios IS 'Usuarios del sistema con roles por empresa';
COMMENT ON TABLE vehiculos IS 'Vehículos registrados por empresa';
COMMENT ON TABLE movimientos IS 'Registro de ingresos y salidas de vehículos';
COMMENT ON TABLE pagos IS 'Pagos realizados por los servicios de parqueadero';
COMMENT ON TABLE tarifas IS 'Configuración de tarifas por tipo de vehículo y empresa';
COMMENT ON TABLE turnos IS 'Control de turnos de caja por usuario';
