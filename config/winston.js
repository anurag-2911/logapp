var appRoot = require('app-root-path');
var winston = require('winston');
  require('winston-daily-rotate-file');

// define the custom settings for each transport (file, console)
var options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 2000, 
    maxFiles: 50,
    colorize: false,
    // rotationFormat: function(){
    //     logger.info('haan yaar');
    // }
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

var transport = new winston.transports.DailyRotateFile({
    filename: 'application.log',
    datePattern: 'YYYY-MM-DD-HH',
    // zippedArchive: false,
    maxSize: '4k',
    maxFiles: '14'
  });

  transport.on('rotate', function(oldFilename, newFilename) {
    logger.info('file is rotated from ' + oldFilename +' to '+newFilename); 
  });
  transport.on('archive',function(zipFilename){
    logger.info('file is zipped ' + zipFilename);
  });

var transportToFile = new winston.transports.File(options.file);
transportToFile.on('rotate', function(oldFilename, newFilename) {
    logger.info('file1 is rotated from ' + oldFilename +' to '+newFilename); 
  });
  transportToFile.on('archive',function(zipFilename){
    logger.info('file1 is zipped ' + zipFilename);
  });
// instantiate a new Winston Logger with the settings defined above
var logger = new winston.createLogger({
  transports: [
    transport,
    transportToFile,
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;