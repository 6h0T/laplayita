// Utilidades para manejo de zona horaria Argentina
const moment = require('moment-timezone');

// Zona horaria de Buenos Aires
const ARGENTINA_TIMEZONE = 'America/Argentina/Buenos_Aires';

/**
 * Convierte una fecha a la zona horaria de Argentina
 * @param {Date|string} date - Fecha a convertir
 * @returns {string} - Fecha formateada en zona horaria argentina
 */
function toArgentinaTime(date) {
    if (!date) return null;
    return moment(date).tz(ARGENTINA_TIMEZONE).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * Obtiene la fecha/hora actual en zona horaria argentina
 * @returns {string} - Fecha actual en formato ISO con zona horaria
 */
function nowInArgentina() {
    return moment().tz(ARGENTINA_TIMEZONE).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * Convierte una fecha para mostrar en el frontend
 * @param {Date|string} date - Fecha a convertir
 * @returns {string} - Fecha formateada para mostrar
 */
function formatForDisplay(date) {
    if (!date) return '';
    return moment(date).tz(ARGENTINA_TIMEZONE).format('DD/MM/YYYY HH:mm:ss');
}

/**
 * Obtiene el timestamp actual en zona horaria argentina para PostgreSQL
 * @returns {string} - Query SQL para timestamp actual
 */
function getCurrentTimestampSQL() {
    return "NOW() AT TIME ZONE 'America/Argentina/Buenos_Aires'";
}

module.exports = {
    toArgentinaTime,
    nowInArgentina,
    formatForDisplay,
    getCurrentTimestampSQL,
    ARGENTINA_TIMEZONE
};
