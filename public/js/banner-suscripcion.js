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
                bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                icon: '⏰'
            },
            warning: {
                bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                icon: '⚠️'
            }
        };

        const config = colores[tipo];
        
        let mensaje = '';
        if (diasRestantes > 1) {
            mensaje = `Te quedan <strong>${diasRestantes} días</strong> de prueba gratis`;
        } else if (diasRestantes === 1) {
            mensaje = `Te queda <strong>1 día</strong> de prueba gratis`;
        } else if (horasRestantes > 0) {
            mensaje = `Te quedan <strong>${horasRestantes} horas</strong> de prueba gratis`;
        }

        const bannerHTML = `
            <div id="banner-suscripcion" style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: ${config.bg};
                color: white;
                padding: 12px 20px;
                text-align: center;
                z-index: 9999;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                font-family: 'Poppins', sans-serif;
            ">
                <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 24px;">${config.icon}</span>
                        <span style="font-size: 15px;">${mensaje}</span>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <a href="mailto:laplayitaestacionamiento@gmail.com" style="
                            background: rgba(255,255,255,0.2);
                            color: white;
                            padding: 8px 20px;
                            border-radius: 20px;
                            text-decoration: none;
                            font-size: 14px;
                            font-weight: 600;
                            backdrop-filter: blur(10px);
                            transition: all 0.3s;
                        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                            📧 Contactar
                        </a>
                        <button onclick="document.getElementById('banner-suscripcion').style.display='none'" style="
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

        // Ajustar padding del body para que no tape contenido
        document.body.style.paddingTop = '60px';
    }

    // Ejecutar al cargar la página
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', verificarSuscripcion);
    } else {
        verificarSuscripcion();
    }
})();
