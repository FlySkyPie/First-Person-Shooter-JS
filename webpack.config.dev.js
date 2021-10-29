const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, './app.js'),
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.m?js$/,
            include: {
                and: [/node_modules/],
                not: [/core-js/,'/physijs-webpack/']
            },
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', {
                            corejs: 3,
                            //debug: true,
                            targets: "> 0.25%, not dead",
                            useBuiltIns: 'usage',
                        }]],
                        plugins: [
                            // "@babel/plugin-transform-runtime",
                            "@babel/plugin-proposal-class-properties",
                            //"@babel/plugin-proposal-export-default-from"
                            "@babel/plugin-transform-modules-commonjs",
                        ],/** */
                    },
                },
            ],
        }, {
            test: /\.worker\.js$/,
            use: {
                loader: 'worker-loader',
                options: { publicPath: '/workers/' },
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: "public/imgs", to: "imgs" },
                { from: "public/libs", to: "libs" },
                { from: "public/models", to: "models" },
                { from: "public/sounds", to: "sounds" },
                { from: "public/*.js", to: "." },
            ],
            options: {
                concurrency: 100,
            },
        }),
    ],
    devServer: {
        hot: true,
        port: 8080,
    }
}