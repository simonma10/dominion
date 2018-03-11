'use strict';

const webpack = require('webpack');
const path = require('path');

var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
})

module.exports = {

    entry: {

        app: [
            'babel-polyfill',
            path.resolve(__dirname, 'src/index.js')
        ]
    },

    output: {

        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        filename: 'project.bundle.js'
    },

    devtool: 'source-map',

    module: {

        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                include: path.join(__dirname, 'src')

            }
        ]
    }

};
