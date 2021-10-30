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
    resolve: {
        alias: {
            webworkify$: 'webworkify-webpack'
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            //exclude: /node_modules/,
            include: /node_modules\/physijs-webpack/,
            /*include: {
                and: [/node_modules/],
                not: [/core-js/]
            },/** */
            use: ['babel-loader', 'eslint-loader'],
        },/** */ /*{
            test: /\.worker\.js$/,
            use: {
                loader: 'worker-loader',
                options: { publicPath: '/workers/' },
            }
        }/** */]
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