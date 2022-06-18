const path = require('path');
const fs = require('fs');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const environment = require('./config/environment');

const templateFiles = fs
  .readFileSync(environment.paths.source)
  .filter((file) =>
    [".html", ".ejs"].includes(path.extname(file).toLowerCase())
  )
  .map((filename) => ({
    input: filename,
    output: filename.replace(/\.ejs$/, ".html"),
  }));



module.exports = {
    entry: {
        app: path.resolve(environment.paths.source, 'js', 'index.js'),
    }, 
    output: {
        filename: 'js/[name].js',
        path: environment.paths.output,
    },

    module: {
        rules: [
            {
                test: /\.(s|sc|c)ss$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: ['babel-loader']
            }, 
            {
                test: /\.(png|gif|jpe?g|svg)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: environment.limits.images,
                    },
                }, 
                generator: {
                    filename: 'images/design/[name].[hash:6][ext]',
                },

            }, 

            {
                test: /\.(eot|ttf|woff|woff2)$/,
                type: 'asset', 
                parser: {
                    dataUrlCondition: {
                        maxSize: environment.limits.fonts
                    }
                },
                generator: {
                    filename: 'fonts/[name].[hash:6][ext]',
                }
            }
        ]
    }
};