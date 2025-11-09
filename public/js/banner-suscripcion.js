/**
 * Banner de Suscripción
 * Muestra días restantes de prueba o estado de suscripción
 * Incluir en todas las páginas del dashboard
 */

(function() {
    // Verificar estado de suscripción al cargar la página
    async function verificarSuscripcion() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('/api/suscripcion/estado', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) return;

            const data = await response.json();
            
            if (data.success && data.data) {
                mostrarBanner(data.data);
            }

        } catch (error) {
            console.error('Error verificando suscripción:', error);
        }
    }

    // Mostrar banner según el estado
    function mostrarBanner(suscripcion) {
        const { estado, diasRestantes, horasRestantes, esTrial, esActiva } = suscripcion;

        // No mostrar nada si está activa (pagada)
        if (esActiva) return;

        // Si está en trial, mostrar días restantes
        if (esTrial && diasRestantes !== null) {
            if (diasRestantes <= 3) {
                // Advertencia urgente (últimos 3 días)
                crearBanner('warning', diasRestantes, horasRestantes);
            } else {
                // Info normal
                crearBanner('info', diasRestantes, horasRestantes);
            }
        }
    }

    // Crear el banner HTML
    function crearBanner(tipo, diasRestantes, horasRestantes) {
        // Verificar si ya existe un banner
        if (document.getElementById('banner-suscripcion')) return;

        const colores = {
            info: {
                bg: 'linear-gradient(90deg, #7986cb 0%, #5c6bc0 100%)',
                icon: '⏰'
            },
            warning: {
                bg: 'linear-gradient(90deg, #7986cb 0%, #5c6bc0 100%)',
                icon: '⚠️'
            }
        };

        const config = colores[tipo];

        const bannerHTML = `
            <div id="banner-suscripcion" style="
                position: fixed;
                top: 0;
                left: 240px;
                right: 0;
                background: ${config.bg};
                color: white;
                padding: 10px 20px;
                text-align: center;
                z-index: 1000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                font-family: 'Poppins', sans-serif;
            ">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span style="font-size: 20px;">${config.icon}</span>
                        <span style="font-size: 14px;">Tiempo restante de prueba:</span>
                        <div id="countdown-timer" style="
                            font-family: 'Courier New', monospace;
                            font-size: 16px;
                            font-weight: bold;
                            background: rgba(255,255,255,0.2);
                            padding: 6px 16px;
                            border-radius: 12px;
                            backdrop-filter: blur(10px);
                        ">
                            <span id="days">0</span>d 
                            <span id="hours">00</span>h 
                            <span id="minutes">00</span>m 
                            <span id="seconds">00</span>s
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <a href="mailto:laplayitaestacionamiento@gmail.com" style="
                            background: rgba(255,255,255,0.2);
                            color: white;
                            padding: 6px 16px;
                            border-radius: 20px;
                            text-decoration: none;
                            font-size: 13px;
                            font-weight: 600;
                            backdrop-filter: blur(10px);
                            transition: all 0.3s;
                        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                            📧 Contactar
                        </a>
                        <button onclick="document.getElementById('banner-suscripcion').style.display='none'; document.querySelector('.main-content').style.paddingTop='20px'; clearInterval(window.countdownInterval);" style="
                            background: transparent;
                            border: none;
                            color: white;
                            font-size: 20px;
                            cursor: pointer;
                            padding: 0 10px;
                            opacity: 0.7;
                        " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                            ×
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Insertar al inicio del body
        document.body.insertAdjacentHTML('afterbegin', bannerHTML);

        // Ajustar padding del contenido principal para que no tape
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.paddingTop = '60px';
        }

        // Iniciar contador en tiempo real
        iniciarContador();
    }

    // Función para actualizar el contador cada segundo
    function iniciarContador() {
        async function obtenerFechaExpiracion() {
            try {
                const token = localStorage.getItem('token');
                if (!token) return null;

                const response = await fetch('/api/suscripcion/estado', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) return null;

                const data = await response.json();
                return data.data?.fechaExpiracion;
            } catch (error) {
                console.error('Error obteniendo fecha de expiración:', error);
                return null;
            }
        }

        obtenerFechaExpiracion().then(fechaExpiracion => {
            if (!fechaExpiracion) return;

            const expiracion = new Date(fechaExpiracion);

            function actualizarContador() {
                const ahora = new Date();
                const diferencia = expiracion - ahora;

                if (diferencia <= 0) {
                    // Expiró, recargar página para que el middleware bloquee
                    clearInterval(window.countdownInterval);
                    window.location.reload();
                    return;
                }

                // Calcular días, horas, minutos y segundos
                const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
                const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
                const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

                // Actualizar elementos del DOM
                const daysEl = document.getElementById('days');
                const hoursEl = document.getElementById('hours');
                const minutesEl = document.getElementById('minutes');
                const secondsEl = document.getElementById('seconds');

                if (daysEl) daysEl.textContent = dias;
                if (hoursEl) hoursEl.textContent = String(horas).padStart(2, '0');
                if (minutesEl) minutesEl.textContent = String(minutos).padStart(2, '0');
                if (secondsEl) secondsEl.textContent = String(segundos).padStart(2, '0');
            }

            // Actualizar inmediatamente
            actualizarContador();

            // Actualizar cada segundo
            window.countdownInterval = setInterval(actualizarContador, 1000);
        });
    }

    // Ejecutar al cargar la página
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', verificarSuscripcion);
    } else {
        verificarSuscripcion();
    }
})();
