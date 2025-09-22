// Utilidades para formateo de fechas en zona horaria argentina
// Zona horaria de Buenos Aires
const ARGENTINA_TIMEZONE = 'America/Argentina/Buenos_Aires';

/**
 * Formatea una fecha en zona horaria argentina
 * @param {Date|string} date - Fecha a formatear
 * @param {Object} options - Opciones de formato
 * @returns {string} - Fecha formateada
 */
function formatArgentinaDate(date, options = {}) {
    if (!date) return '';
    
    try {
        const dateObj = new Date(date);
        
        // Opciones por defecto para Argentina
        const defaultOptions = {
            timeZone: ARGENTINA_TIMEZONE,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        
        const finalOptions = { ...defaultOptions, ...options };
        
        return dateObj.toLocaleString('es-AR', finalOptions);
    } catch (error) {
        console.error('Error formateando fecha:', error);
        return '';
    }
}

/**
 * Formatea una fecha solo con hora en zona horaria argentina
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Hora formateada
 */
function formatArgentinaTime(date) {
    return formatArgentinaDate(date, {
        year: undefined,
        month: undefined,
        day: undefined
    });
}

/**
 * Formatea una fecha solo con día en zona horaria argentina
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
function formatArgentinaDateOnly(date) {
    return formatArgentinaDate(date, {
        hour: undefined,
        minute: undefined,
        second: undefined
    });
}

/**
 * Obtiene la fecha/hora actual en zona horaria argentina
 * @returns {string} - Fecha actual formateada
 */
function nowInArgentina() {
    return formatArgentinaDate(new Date());
}

/**
 * Convierte una fecha UTC a zona horaria argentina
 * @param {Date|string} utcDate - Fecha en UTC
 * @returns {Date} - Fecha convertida
 */
function utcToArgentina(utcDate) {
    if (!utcDate) return null;
    
    const date = new Date(utcDate);
    // Ajustar por UTC-3 (Buenos Aires)
    const argentinaOffset = -3 * 60; // -3 horas en minutos
    const utcOffset = date.getTimezoneOffset(); // Offset local en minutos
    const totalOffset = argentinaOffset - utcOffset;
    
    return new Date(date.getTime() + (totalOffset * 60 * 1000));
}

// Función de compatibilidad para reemplazar toLocaleString('es-CO')
function toArgentinaString(date) {
    return formatArgentinaDate(date);
}

// Exportar funciones para uso global
window.formatArgentinaDate = formatArgentinaDate;
window.formatArgentinaTime = formatArgentinaTime;
window.formatArgentinaDateOnly = formatArgentinaDateOnly;
window.nowInArgentina = nowInArgentina;
window.utcToArgentina = utcToArgentina;
window.toArgentinaString = toArgentinaString;
