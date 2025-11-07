// Manejo del formulario de registro
document.getElementById('registroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log('🚀 Formulario de registro enviado');

    // Obtener valores del formulario
    const nombre_empresa = document.getElementById('nombre_empresa').value.trim();
    const nombre_contacto = document.getElementById('nombre_contacto').value.trim();
    const email = document.getElementById('email').value.trim();
    const usuario = document.getElementById('usuario').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const password = document.getElementById('password').value;
    const password_confirm = document.getElementById('password_confirm').value;
    
    console.log('📋 Datos del formulario:', {
        nombre_empresa,
        nombre_contacto,
        email,
        usuario,
        telefono,
        password: password ? '***' : 'vacío',
        password_confirm: password_confirm ? '***' : 'vacío'
    });

    // Validar formato de usuario
    const usuarioRegex = /^[a-zA-Z0-9._-]+$/;
    if (!usuarioRegex.test(usuario)) {
        console.log('❌ Validación fallida: formato de usuario inválido');
        mostrarError('El usuario solo puede contener letras, números, puntos, guiones y guiones bajos');
        return;
    }

    if (usuario.length < 3) {
        console.log('❌ Validación fallida: usuario muy corto');
        mostrarError('El usuario debe tener al menos 3 caracteres');
        return;
    }

    // Validar que las contraseñas coincidan
    if (password !== password_confirm) {
        console.log('❌ Validación fallida: contraseñas no coinciden');
        mostrarError('Las contraseñas no coinciden');
        return;
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
        console.log('❌ Validación fallida: contraseña muy corta');
        mostrarError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    console.log('✅ Todas las validaciones pasaron');

    // Mostrar loading
    mostrarLoading(true);
    ocultarMensajes();

    try {
        console.log('📡 Enviando petición al servidor...');
        
        // Hacer request al backend
        const response = await fetch('/api/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre_empresa,
                nombre_contacto,
                email,
                usuario,
                telefono: telefono || null,
                password
            })
        });

        console.log('📥 Respuesta recibida:', response.status, response.statusText);
        
        const data = await response.json();
        console.log('📦 Datos de respuesta:', data);

        if (response.ok && data.success) {
            // Registro exitoso
            console.log('✅ Registro exitoso, mostrando modal');
            mostrarExito(data.data);
            document.getElementById('registroForm').reset();
        } else {
            // Error del servidor
            console.log('❌ Error del servidor:', data.message);
            mostrarError(data.message || 'Error al procesar el registro');
        }

    } catch (error) {
        console.error('❌ Error de conexión:', error);
        mostrarError('Error de conexión. Por favor intenta nuevamente.');
    } finally {
        console.log('🔄 Ocultando loading');
        mostrarLoading(false);
    }
});

// Mostrar mensaje de éxito en modal
function mostrarExito(data) {
    // Llenar datos del modal
    document.getElementById('modalNumeroCliente').textContent = data.numero_cliente;
    document.getElementById('modalUsuario').textContent = data.usuario;
    document.getElementById('modalEmail').textContent = data.email;
    document.getElementById('modalUsuarioLogin').textContent = data.usuario;
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = mensaje;
    errorDiv.classList.remove('d-none');
    
    // Scroll al mensaje
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        errorDiv.classList.add('d-none');
    }, 5000);
}

// Ocultar todos los mensajes
function ocultarMensajes() {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.classList.add('d-none');
    }
}

// Mostrar/ocultar loading en el botón
function mostrarLoading(show) {
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    const btnRegistro = document.getElementById('btnRegistro');

    if (show) {
        btnText.classList.add('d-none');
        btnSpinner.classList.remove('d-none');
        btnRegistro.disabled = true;
    } else {
        btnText.classList.remove('d-none');
        btnSpinner.classList.add('d-none');
        btnRegistro.disabled = false;
    }
}

// Validación en tiempo real de email
document.getElementById('email').addEventListener('blur', function() {
    const email = this.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        this.classList.add('is-invalid');
    } else {
        this.classList.remove('is-invalid');
    }
});

// Validación en tiempo real de usuario
document.getElementById('usuario').addEventListener('input', function() {
    const usuario = this.value.trim();
    const usuarioRegex = /^[a-zA-Z0-9._-]+$/;
    
    if (usuario && !usuarioRegex.test(usuario)) {
        this.classList.add('is-invalid');
    } else {
        this.classList.remove('is-invalid');
    }
});

// Validación en tiempo real de contraseñas
document.getElementById('password_confirm').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    const confirm = this.value;
    
    if (confirm && password !== confirm) {
        this.classList.add('is-invalid');
    } else {
        this.classList.remove('is-invalid');
    }
});
