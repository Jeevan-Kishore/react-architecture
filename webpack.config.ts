import * as webpack from 'webpack';
import * as path from 'path';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWepackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

declare const __dirname: string;

const config: webpack.Configuration = {
    entry: {
        vendor: ['react', 'react-dom', 'whatwg-fetch', 'pnotify', 'localforage'],
        app: './app/app.tsx'
    },
    output: {
        filename: 'js/[name].[hash].js',
        chunkFilename: 'chunk.[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.jsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                include: [
                    path.resolve(__dirname, 'app')
                ],
                exclude: [
                    path.resolve(__dirname, 'node-modules')
                ],
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react', 'stage-0']
                }

            },
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [path.join(process.cwd(), 'node_modules')]
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            },
            {
                test: /\.(sass|scss|css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                importLoaders: 3,
                                sourceMap: true,
                                plugins: (loader: any) => [
                                    require('postcss-import')({ root: loader.resourcePath }),
                                    require('autoprefixer'),
                                    require('cssnano')()
                                ]
                            }
                        },
                        'resolve-url-loader',
                        'sass-loader?sourceMap',
                    ]
                })
            }
        ]
    },
    devtool: 'inline-source-map',
    target: 'web',
    stats: {
        assets: true,
        colors: true,
        errors: true,
        errorDetails: true,
        hash: true
    },
    devServer: {
        port: 8081,
        contentBase: path.join(__dirname, 'dist/'), // boolean | string | array, static file location
        compress: true, // enable gzip compression
        historyApiFallback: true, // true for index.ejs upon 404, object for multiple paths
        hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
        https: false // true for self-signed, object for cert authority
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index.ejs'
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jquery': 'jquery',
            'Popper' : 'popper.js',
            'window.Popper' : 'popper.js',
            'Popper.js' : 'popper.js'
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'js/vendor.[hash].min.js'
        }),

        new ExtractTextPlugin({
            filename: 'css/style.[hash].min.css',
        }),

        new webpack.optimize.ModuleConcatenationPlugin(),

        new webpack.NamedModulesPlugin(),

        //new BundleAnalyzerPlugin(),    //Uncomment to view analysis of the bundle.

    ]
};

export default config;