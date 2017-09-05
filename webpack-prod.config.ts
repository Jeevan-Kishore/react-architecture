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
        vendor: ['react', 'react-dom', 'whatwg-fetch'],
        app: './app/app.tsx',
    },
    output: {
        filename: 'js/[name].[hash].min.js',
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
                test: /\.(js|jsx)?$/,
                include: [
                    path.resolve(__dirname, 'app')
                ],
                exclude: [
                    path.resolve(__dirname, 'node-modules')
                ],
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react','stage-0']
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
    target: 'web',
    /*externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },*/
    stats: {
        assets: true,
        colors: true,
        errors: true,
        errorDetails: true,
        hash: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index-prod.ejs',
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            '$': 'jquery/dist/jquery.min.js',
            'jQuery': 'jquery/dist/jquery.min.js',
            'window.jquery': 'jquery/dist/jquery.min.js',
            'Popper' : 'popper.js',
            'window.Popper' : 'popper.js',
            'Popper.js' : 'popper.js'
        }),


        new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks
        
        /*new CopyWepackPlugin([{
            'from' :'externals/react-15.6.1/!*.js' ,
            'to' : '' //copy to root folder i.e, dist
        }]),*/

        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'js/vendor.[hash].min.js'
        }),

        new ExtractTextPlugin({
            filename: 'css/style.[hash].min.css',
        }),

        new BundleAnalyzerPlugin(),

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            }
        }), //minify everything

        //new webpack.optimize.UglifyJsPlugin(),

        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0
        }),

        new webpack.optimize.ModuleConcatenationPlugin(),

        new webpack.HashedModuleIdsPlugin({
            hashFunction: 'sha256',
            hashDigest: 'hex',
            hashDigestLength: 20
        })
    ]
};

export default config;