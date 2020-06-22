
var path = require('path');
var webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = [
    {
        name: 'js',
        mode: 'development',
        resolve: {
            alias: {
                Img: path.resolve(__dirname, 'src/common/img'),
                JS: path.resolve(__dirname, 'src/common/js'),
            }
        },
        entry: {
            home: ['./src/js/home.js'],
            emailform: ['./src/js/emailform.js'],
            data: ['./src/js/data.js']
        },
        devtool: 'inline-source-map',
        plugins: [
//            new CleanWebpackPlugin(),
        ],
        output: {
            filename: './js/[name].min.js',
            chunkFilename: './js/[name].min.js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
        },
        target: 'web',
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    //                   exclude: /(node_modules)/,
                    use: [
                        {
                            loader: 'style-loader'
                        }, {
                            loader: 'css-loader',

                        }, {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () {
                                    return [
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        }, {
                            loader: 'sass-loader',
                        },
                    ]
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        'file-loader',
                    ]
                },
            ]
        },

    },
];
