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