const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '../logs');
const logFilePath = path.join(logDirectory, 'exceptions.log');

function logError(error) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ERRO: ${error.stack || error}\n\n`;

    try {
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory);
        }

        fs.appendFileSync(logFilePath, logMessage);

    } catch (err) {
        console.error('Falha CRÍTICA ao gravar o log de erro:', err);
    }
}

module.exports = { logError };