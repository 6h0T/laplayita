import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secret-super-seguro';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { usuario, password } = body;

    if (!usuario || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Usuario y contraseña son requeridos'
        },
        { status: 400 }
      );
    }

    // Buscar usuario
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios')
      .select(`
        *,
        empresas (
          id_empresa,
          nombre,
          numero_cliente,
          email,
          activa,
          estado_suscripcion,
          fecha_expiracion,
          plan
        )
      `)
      .eq('usuario_login', usuario)
      .eq('activo', true)
      .single();

    if (usuarioError || !usuarioData) {
      return NextResponse.json(
        {
          success: false,
          message: 'Usuario o contraseña incorrectos'
        },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, usuarioData.contraseña);

    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: 'Usuario o contraseña incorrectos'
        },
        { status: 401 }
      );
    }

    // Verificar que la empresa esté activa
    const empresa = usuarioData.empresas;
    if (!empresa || !empresa.activa) {
      return NextResponse.json(
        {
          success: false,
          message: 'La empresa no está activa. Contacta al administrador.'
        },
        { status: 403 }
      );
    }

    // Verificar suscripción
    const ahora = new Date();
    const fechaExpiracion = empresa.fecha_expiracion ? new Date(empresa.fecha_expiracion) : null;
    const suscripcionExpirada = fechaExpiracion && ahora > fechaExpiracion;

    // Actualizar último acceso
    await supabase
      .from('usuarios')
      .update({ ultimo_acceso: new Date().toISOString() })
      .eq('id_usuario', usuarioData.id_usuario);

    // Generar token JWT
    const token = jwt.sign(
      {
        id_usuario: usuarioData.id_usuario,
        id_empresa: empresa.id_empresa,
        usuario: usuarioData.usuario_login,
        rol: usuarioData.rol,
        numero_cliente: empresa.numero_cliente
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      token,
      usuario: {
        id_usuario: usuarioData.id_usuario,
        nombre: usuarioData.nombre,
        usuario: usuarioData.usuario_login,
        rol: usuarioData.rol,
        empresa: {
          id_empresa: empresa.id_empresa,
          nombre: empresa.nombre,
          numero_cliente: empresa.numero_cliente,
          email: empresa.email,
          plan: empresa.plan,
          estado_suscripcion: empresa.estado_suscripcion,
          suscripcion_expirada: suscripcionExpirada,
          fecha_expiracion: empresa.fecha_expiracion
        }
      }
    });

  } catch (error: any) {
    console.error('❌ Error en login:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al procesar el login'
      },
      { status: 500 }
    );
  }
}
