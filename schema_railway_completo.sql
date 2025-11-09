-- Schema PostgreSQL para Railway - Sistema La Playita
-- Incluye todas las columnas necesarias para el registro

-- Crear tipos ENUM
CREATE TYPE plan_type AS ENUM ('basico', 'premium', 'enterprise');
CREATE TYPE rol_type AS ENUM ('admin', 'operador');
CREATE TYPE vehiculo_type AS ENUM ('auto', 'camioneta', 'moto');
CREATE TYPE metodo_pago_type AS ENUM ('efectivo', 'tarjeta', 'QR');
CREATE TYPE modo_cobro_type AS ENUM ('minuto', 'hora', 'dia', 'mixto');
CREATE TYPE estado_suscripcion_type AS ENUM ('trial', 'activa', 'expirada', 'cancelada');
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
    logo_url BYTEA,
    activa BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento TIMESTAMP,
    fecha_expiracion TIMESTAMP,
    plan plan_type NOT NULL,
    estado_suscripcion estado_suscripcion_type DEFAULT 'trial',
    origen_registro VARCHAR(50) DEFAULT 'manual'
);

-- Tabla de Usuarios
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
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE,
    CONSTRAINT uq_usuario_empresa UNIQUE (usuario_login, id_empresa)
);

-- Tabla de Configuración por Empresa
CREATE TABLE configuracion_empresa (
    id_configuracion SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL,
    capacidad_total_carros INTEGER NOT NULL DEFAULT 50,
    capacidad_total_motos INTEGER NOT NULL DEFAULT 30,
    capacidad_total_bicicletas INTEGER NOT NULL DEFAULT 20,
    horario_apertura TIME DEFAULT '06:00:00',
    horario_cierre TIME DEFAULT '22:00:00',
    iva_porcentaje DECIMAL(5,2) DEFAULT 0.00,
    moneda VARCHAR(10) DEFAULT 'ARS',
    zona_horaria VARCHAR(50) DEFAULT 'America/Argentina/Buenos_Aires',
    operacion_24h BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE
);

-- Tabla de Tarifas
CREATE TABLE tarifas (
    id_tarifa SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL,
    tipo_vehiculo vehiculo_type NOT NULL,
    valor_minuto DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    valor_hora DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    valor_dia_completo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    activa BOOLEAN DEFAULT TRUE,
    fecha_vigencia_desde TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vigencia_hasta TIMESTAMP,
    modo_cobro modo_cobro_type DEFAULT 'mixto',
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE
);

-- Tabla de Vehículos
CREATE TABLE vehiculos (
    id_vehiculo SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL,
    placa VARCHAR(20) NOT NULL,
    tipo vehiculo_type NOT NULL,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    color VARCHAR(30),
    propietario_nombre VARCHAR(100),
    propietario_telefono VARCHAR(20),
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE,
    CONSTRAINT uq_placa_empresa UNIQUE (placa, id_empresa)
);

-- Tabla de Movimientos (Ingresos/Salidas)
CREATE TABLE movimientos (
    id_movimiento SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL,
    id_vehiculo INTEGER NOT NULL,
    fecha_ingreso TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_salida TIMESTAMP,
    tiempo_total_minutos INTEGER,
    monto_total DECIMAL(10,2),
    estado estado_movimiento_type DEFAULT 'activo',
    observaciones TEXT,
    usuario_ingreso VARCHAR(50),
    usuario_salida VARCHAR(50),
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE,
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo) ON DELETE CASCADE
);

-- Tabla de Pagos
CREATE TABLE pagos (
    id_pago SERIAL PRIMARY KEY,
    id_movimiento INTEGER NOT NULL,
    id_empresa INTEGER NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago metodo_pago_type NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    referencia VARCHAR(100),
    FOREIGN KEY (id_movimiento) REFERENCES movimientos(id_movimiento) ON DELETE CASCADE,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE
);

-- Tabla de Turnos de Caja
CREATE TABLE turnos (
    id_turno SERIAL PRIMARY KEY,
    id_empresa INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    fecha_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre TIMESTAMP,
    monto_inicial DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    monto_final DECIMAL(10,2),
    total_efectivo DECIMAL(10,2),
    total_tarjeta DECIMAL(10,2),
    total_qr DECIMAL(10,2),
    estado estado_turno_type DEFAULT 'abierto',
    observaciones TEXT,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabla de Intentos de Login
CREATE TABLE login_attempts (
    id_intento SERIAL PRIMARY KEY,
    id_empresa INTEGER,
    usuario_login VARCHAR(50) NOT NULL,
    exitoso BOOLEAN NOT NULL,
    ip_address INET NOT NULL,
    fecha_intento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_vehiculos_placa ON vehiculos(placa);
CREATE INDEX idx_movimientos_estado ON movimientos(estado);
CREATE INDEX idx_movimientos_fecha_ingreso ON movimientos(fecha_ingreso);
CREATE INDEX idx_usuarios_login ON usuarios(usuario_login);
CREATE INDEX idx_empresas_numero_cliente ON empresas(numero_cliente);
CREATE INDEX idx_login_attempts_usuario ON login_attempts(usuario_login);
CREATE INDEX idx_login_attempts_fecha ON login_attempts(fecha_intento);

-- Comentarios
COMMENT ON TABLE empresas IS 'Tabla de empresas/clientes del sistema';
COMMENT ON TABLE usuarios IS 'Usuarios del sistema por empresa';
COMMENT ON TABLE vehiculos IS 'Registro de vehículos';
COMMENT ON TABLE movimientos IS 'Registro de ingresos y salidas de vehículos';
COMMENT ON TABLE tarifas IS 'Tarifas de estacionamiento por tipo de vehículo';
