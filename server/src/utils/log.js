import debug from 'debug';

/**
 * @description logs messages for easy debugging
 * @param {string} message message to be logged
 * @returns {string} console message
 */
export default function log(message) {
  return debug('dev')(message);
}
