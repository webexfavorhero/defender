var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        // new winston.transports.File({
        //     level: 'info',
        //     filename: './logs/log',
        //     handleExceptions: true,
        //     json: false,
        //     maxsize: 5242880, //5MB
        //     maxFiles: 20,
        //     colorize: true
        // }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message.slice(0, -1));
    }
};

