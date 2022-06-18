const path = require('path');
const fs = require('fs');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const environment = require('./config/environment');


module.exports = {
    entry: {
        app: path.resolve(environment.paths.source, 'js', 'index.js'),
    }, 
    output: {
        filename: 'js/[name].js',
        path: environment.paths.output,
    }
};