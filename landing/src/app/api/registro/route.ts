import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nombre_empresa,
      nombre_contacto,
      email,
      usuario,
      telefono,
      password
    } = body;

    // Validar datos requeridos
    if (!nombre_empresa || !email || !usuario || !password || !nombre_contacto) {
      return NextResponse.json(
        {
          success: false,
          message: 'Faltan datos requeridos'
        },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'El formato del email no es válido'
        },
        { status: 400 }
      );
    }

    // Validar formato de usuario
    const usuarioRegex = /^[a-zA-Z0-9._-]+$/;
    if (!usuarioRegex.test(usuario)) {
      return NextResponse.json(
        {
          success: false,
          message: 'El usuario solo puede contener letras, números, puntos, guiones y guiones bajos'
        },
        { status: 400 }
      );
    }

    if (usuario.length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: 'El usuario debe tener al menos 3 caracteres'
        },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const { data: existenteEmail } = await supabase
      .from('empresas')
      .select('id_empresa')
      .eq('email', email)
      .single();

    if (existenteEmail) {
      return NextResponse.json(
        {
          success: false,
          message: 'El email ya está registrado. Por favor usa otro email.'
        },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const { data: existenteUsuario } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .eq('usuario_login', usuario)
      .single();

    if (existenteUsuario) {
      return NextResponse.json(
        {
          success: false,
          message: 'El usuario ya está registrado. Por favor usa otro usuario.'
        },
        { status: 400 }
      );
    }

    // Generar número de cliente único
    const numero_cliente = 'CLI' + Date.now().toString().slice(-6);

    // Calcular fecha de expiración (7 días desde ahora)
    const fecha_expiracion = new Date();
    fecha_expiracion.setDate(fecha_expiracion.getDate() + 7);

    // Crear empresa
    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .insert({
        nombre: nombre_empresa,
        numero_cliente,
        email,
        telefono: telefono || null,
        plan: 'basico',
        activa: true,
        estado_suscripcion: 'trial',
        fecha_expiracion: fecha_expiracion.toISOString(),
        origen_registro: 'landing'
      })
      .select()
      .single();

    if (empresaError || !empresa) {
      console.error('Error al crear empresa:', empresaError);
      throw new Error('Error al crear la empresa');
    }

    const id_empresa = empresa.id_empresa;

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario admin
    const { error: usuarioError } = await supabase
      .from('usuarios')
      .insert({
        id_empresa,
        nombre: nombre_contacto,
        usuario_login: usuario,
        contraseña: hashedPassword,
        rol: 'admin',
        activo: true
      });

    if (usuarioError) {
      console.error('Error al crear usuario:', usuarioError);
      // Rollback: eliminar empresa
      await supabase.from('empresas').delete().eq('id_empresa', id_empresa);
      throw new Error('Error al crear el usuario');
    }

    // Crear configuración por defecto
    await supabase.from('configuracion_empresa').insert({
      id_empresa,
      capacidad_total_carros: 50,
      capacidad_total_motos: 30,
      capacidad_total_bicicletas: 20,
      zona_horaria: 'America/Argentina/Buenos_Aires',
      moneda: 'ARS'
    });

    // Crear tarifas por defecto
    const tarifas = [
      { tipo: 'auto', minuto: 50, hora: 2000, dia: 16000 },
      { tipo: 'camioneta', minuto: 60, hora: 2500, dia: 18000 },
      { tipo: 'moto', minuto: 30, hora: 1500, dia: 10000 }
    ];

    for (const tarifa of tarifas) {
      await supabase.from('tarifas').insert({
        id_empresa,
        tipo_vehiculo: tarifa.tipo,
        valor_minuto: tarifa.minuto,
        valor_hora: tarifa.hora,
        valor_dia_completo: tarifa.dia,
        activa: true,
        modo_cobro: 'mixto'
      });
    }

    console.log('✅ Nueva empresa registrada:', {
      id_empresa,
      nombre: nombre_empresa,
      email,
      numero_cliente
    });

    return NextResponse.json({
      success: true,
      message: '¡Registro exitoso! Tienes 7 días de prueba gratis.',
      data: {
        numero_cliente,
        usuario,
        email,
        nombre_empresa,
        dias_prueba: 7,
        fecha_expiracion: fecha_expiracion.toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ Error en registro:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al procesar el registro. Por favor intenta nuevamente.'
      },
      { status: 500 }
    );
  }
}
