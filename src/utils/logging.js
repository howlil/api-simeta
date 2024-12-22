const { createLogger, format, transports } = require("winston");
const { combine, prettyPrint, timestamp, colorize, printf } = format;

// Format custom untuk log di terminal
const consoleFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
    format: combine(
        timestamp({ format: "HH:mm:ss" }), // Tambahkan timestamp dengan format jam:menit:detik
        prettyPrint() // Format untuk file log
    ),
    transports: [
        // Log ke file info.log untuk level "info"
        new transports.File({
            filename: "./logs/info.log",
            level: "info",
        }),
        // Log ke file error.log untuk level "error"
        new transports.File({
            filename: "./logs/error.log",
            level: "error",
        }),
        // Tambahkan transport ke terminal
        new transports.Console({
            format: combine(
                colorize(), // Memberi warna pada level log di terminal
                timestamp({ format: "HH:mm:ss" }), // Tambahkan timestamp
                consoleFormat // Gunakan format custom
            ),
        }),
    ],
});

module.exports = { logger };
