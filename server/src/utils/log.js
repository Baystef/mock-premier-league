import debug from 'debug';

/**
 * @description logs messages for easy debugging
 * @param {string} message log message
 */
export default function log(message) {
  return debug('dev')(message);
}
