/**
 * @Author: Fabre Ed
 * @Date:   2017-11-20T17:28:44-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: loggingManager.js
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-11-28T09:54:29-05:00
 */

// This instantiates the winston logger to be used by all other loggers.
const logger = require('winston');

// NPM Requirements. require('winston-electron');
require('winston-daily-rotate-file');
require('winston-loggly-bulk');
require('winston-electron');

// Glabal Variables.
const tsFormat = () => (new Date()).toLocaleTimeString();

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  timestamp: tsFormat,
  colorize: true,
  level: 'silly',
});

logger.add(logger.transports.Loggly, {
  name: 'loggly',
  token: '28e3eabd-f6ea-44a8-b608-5afe4d0c43a5',
  level: 'info',
  subdomain: 'miko',
  tags: ['Fittrac'],
  json: true,
});

const disable = function disable() {
  logger.remove(logger.transports.Console);
  // logger.remove(logger.transports.ElectronConsole);
  logger.remove('file#prod');
  logger.remove('file#dev');
// logger.remove('loggly');
};

module.exports = {
  logger,
  disable,
};
