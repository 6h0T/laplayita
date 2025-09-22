// Generador de números de cliente aleatorios
// Formato: 9 caracteres alfanuméricos (letras mayúsculas y números)

/**
 * Genera un número de cliente aleatorio de 9 caracteres
 * @returns {string} Número de cliente en formato ABC123XYZ
 */
function generateClientNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    for (let i = 0; i < 9; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
}

/**
 * Valida que un número de cliente tenga el formato correcto
 * @param {string} clientNumber - Número de cliente a validar
 * @returns {boolean} True si es válido, false si no
 */
function validateClientNumber(clientNumber) {
    if (!clientNumber || typeof clientNumber !== 'string') {
        return false;
    }
    
    // Debe tener exactamente 9 caracteres
    if (clientNumber.length !== 9) {
        return false;
    }
    
    // Solo debe contener letras mayúsculas y números
    const regex = /^[A-Z0-9]{9}$/;
    return regex.test(clientNumber);
}

/**
 * Genera un número de cliente único verificando contra la base de datos
 * @param {object} pool - Pool de conexiones de la base de datos
 * @returns {Promise<string>} Número de cliente único
 */
async function generateUniqueClientNumber(pool) {
    let clientNumber;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 100;
    
    while (!isUnique && attempts < maxAttempts) {
        clientNumber = generateClientNumber();
        
        try {
            const [existing] = await pool.query(
                'SELECT id_empresa FROM empresas WHERE numero_cliente = ?',
                [clientNumber]
            );
            
            if (existing.length === 0) {
                isUnique = true;
            }
        } catch (error) {
            console.error('Error verificando unicidad del número de cliente:', error);
            throw new Error('Error generando número de cliente único');
        }
        
        attempts++;
    }
    
    if (!isUnique) {
        throw new Error('No se pudo generar un número de cliente único después de múltiples intentos');
    }
    
    return clientNumber;
}

module.exports = {
    generateClientNumber,
    validateClientNumber,
    generateUniqueClientNumber
};
