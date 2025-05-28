module.exports = function override(config, env) {
    // Override webpack configuration
    if (config.devServer) {
        delete config.devServer.onBeforeSetupMiddleware;
        delete config.devServer.onAfterSetupMiddleware;

        config.devServer.setupMiddlewares = (middlewares, devServer) => {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }
            return middlewares;
        };
    }

    return config;
}