
module.exports = function createRebindHost () {
    return function rebindHost (req, res, next) {
        next();
    };
};
