const path = require('path');
const fs = require('fs');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const environment = require('./config/environment');

const templateFiles = fs
  .readdirSync(environment.paths.source)
  .filter((file) =>
    [".html", ".ejs"].includes(path.extname(file).toLowerCase())
  )
  .map((filename) => ({
    input: filename,
    output: filename.replace(/\.ejs$/, ".html"),
  }));

const htmlPluginEntries = templateFiles.map(
  (template) =>
    new HtmlWebpackPlugin({
      inject: true,
      hash: false,
      filename: template.output,
      template: path.resolve(environment.paths.source, template.input),
      favicon: path.resolve(environment.paths.source, 'images', 'favicon.ico')
    })
);

module.exports = {
    entry: {
        app: path.resolve(environment.paths.source, 'js', 'index.js'),
    }, 
    output: {
        filename: 'js/[name].js',
        path: environment.paths.output,
        clean: true
    },

    module: {
        rules: [
            {
                test: /\.(s|sc|c)ss$/i,
                //style loader inject css into javascript however minicss is make resources in one css file
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
    },

    optimization: {
       
        minimizer: [
            '...',
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                         // Lossless optimization with custom option
                        // Feel free to experiment with options for better result for you
                        plugins: [
                            ['gifsicle', { interlaced: true }],
                            ['jpegtran', { progressive: true }],
                            ['optipng', { optimizationLevel: 5 }], 
                            // Svgo configuration here https://github.com/svg/svgo#configuration
                            [
                                'svgo',
                                {
                                    plugins: [
                                        {
                                            name: 'removeViewBox',
                                            active: false
                                        }
                                    ]
                                }
                            ]
                        ]
                    }
                }
            })
        ]
    }, 

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: "[id].css",
            ignoreOrder: false,
        }), 
        new CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json'],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(environment.paths.source, 'images', 'content'),
                    to: path.resolve(environment.paths.output, 'images', 'content'),
                    toType: 'dir',
                    globOptions: {
                        ignore: ['*.DS_Store', 'Thumbs.db'],
                    },
                },
                {
                    from: path.resolve(environment.paths.source, 'videos'),
                    to: path.resolve(environment.paths.output, 'videos'),
                    toType: 'dir',
                    globOptions: {
                      ignore: ['*.DS_Store', 'Thumbs.db'],
                    },
                },
            ]
        })
    ].concat(htmlPluginEntries)
};