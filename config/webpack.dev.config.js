const { marge, default: merge } = require('webpack-merge');

const webpackConfiguration = require('../webpack.config');
const environment = require('./environment');


module.exports = merge(webpackConfiguration, {
    mode: 'development', 

    devtool: 'eval-source-map',

    // Development server  configuration
    devServer: {
        static: {
            directory: environment.paths.output,
            publicPath: '/', 
            watch: true,
        }, 

        client: {
            overlay: true,
        }, 

        open: true, 
        compress: true, 
        hot: false,
        ...environment.server,
    },

    // File watcher options
    watchOptions: {
        aggregateTimeout: 300,
        poll: 300, 
        ignore: /node_modules/,
    }, 

})