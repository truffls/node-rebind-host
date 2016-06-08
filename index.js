
/**
 * @param   {String}   forceHost
 * @returns {Function}
 */
module.exports = function createRebindHost (forceHost) {

    /**
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     */
    return function rebindHost (req, res, next) {
        var host = determineHost(req, forceHost);

        if (!host) {
            return next();
        }

        var getter = function getter () {
            return host;
        };

        Object.defineProperty(req, 'host', {
            configurable: true,
            enumerable: true,
            get: getter
        });

        next();
    };
};

/**
 * @param   {Object} req
 * @param   {String} [forceHost]
 * @returns {String}
 */
function determineHost (req, forceHost) {
    var trust = req.app.get('trust proxy fn');
    var host = req.get('X-Forwarded-Host');

    if (!host || !trust(req.connection.remoteAddress, 0)) {
        host = req.get('Host');
    }

    if (!!forceHost) {
        host = forceHost;
    }

    return host;
}
