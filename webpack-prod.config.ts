import * as webpack from 'webpack';
import * as path from 'path';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWepackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

declare const __dirname: string;

const config: webpack.Configuration = {
    entry: {
        app: './app/app.ts',
        vendor: ['jquery', 'bootstrap']
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
                test: /\.jsx?$/,
                include: [
                    path.resolve(__dirname, 'app')
                ],
                exclude: [
                    path.resolve(__dirname, 'node-modules')
                ],
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }

            },
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            },
            {
                test: /\.(less|css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                importLoaders: 1,
                                plugins: (loader: any) => [
                                    require('postcss-import')({ root: loader.resourcePath }),
                                    require('autoprefixer'),
                                    require('cssnano')()
                                ]
                            }
                        },
                        'less-loader',
                        'resolve-url-loader'
                    ]
                })
            }
        ]
    },
    target: 'web',
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    stats: {
        assets: true,
        colors: true,
        errors: true,
        errorDetails: true,
        hash: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index-prod.ejs'
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
        new webpack.optimize.UglifyJsPlugin(),
        new CopyWepackPlugin([{
            'from' :'externals/react-15.6.1/*.js' ,
            'to' : '' //copy to root folder i.e, dist
        }]),

        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            chunks: ['vendor-chunk'],
            minChunks: 2
        }),

        new ExtractTextPlugin({
            filename: 'css/style.[hash].min.css',
        })
    ]
};

export default config;