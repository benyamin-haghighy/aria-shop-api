const winston = require('winston')
const path = require('path')
const loggerError = winston.createLogger({
    level:'info',
    format: winston.format.combine(
        winston.format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
        winston.format.errors({stack:true}),
        winston.format.colorize({'colors':"red"}),
    ),
    transports:[
        new winston.transports.File({
            filename:path.join(__dirname, '../', 'log', 'error.log'),
            level:'error',
            format:winston.format.json()
        }),
        new winston.transports.File({
            filename:path.join(__dirname, '../', 'log', 'combined.log'),
            format:winston.format.json()
        })
    ]
})


module.exports = loggerError