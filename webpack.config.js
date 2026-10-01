import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import svgToMiniDataURI from 'mini-svg-data-uri';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import createMinifier from 'css-loader-minify-class';
import path from 'node:path';

export default (env, argv) => {
    const BUILD_MODE = argv.mode;
    const IS_DEVELOPMENT = BUILD_MODE === 'development';
    const BUILD_DATE = +new Date();
    const BUILD_OUTPUT_PATH_DEV = path.resolve('./build');
    const BUILD_OUTPUT_PATH_PROD = path.resolve('./build');
    const BUILD_OUTPUT_PATH_RESULT = IS_DEVELOPMENT ? BUILD_OUTPUT_PATH_DEV : BUILD_OUTPUT_PATH_PROD;
    const COMMON_STYLES_PATH = './style/generalPagesStyle.scss';

    const config = {
        mode: BUILD_MODE,
        entry: {
            main: [COMMON_STYLES_PATH, './realHtmlPages/index/page.tsx']
        },
        devtool: IS_DEVELOPMENT ? 'source-map' : false,
        cache: IS_DEVELOPMENT ? {
            type: 'filesystem',
            store: 'pack',
        } : false,
        module: {
            rules: [
                // Файлы ts и tsx
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheCompression: false,
                            cacheDirectory: true
                        }
                    }
                },
                {
                    test: /(svg_ico).*\.svg(\?.*)?$/,
                    issuer: /\.[jt]sx?$/,
                    use: { loader: '@svgr/webpack', options: { icon: true } },
                },
                {
                    test: /(svg_component).*\.svg(\?.*)?$/,
                    issuer: /\.[jt]sx?$/,
                    use: { loader: '@svgr/webpack' },
                },
                // Маленькие svg которые будут вставлены непосредственно в код
                {
                    test: /(svg_base64).*\.svg(\?.*)?$/,
                    type: 'asset/inline',
                    generator: {
                        dataUrl(content) {
                            return svgToMiniDataURI(content.toString());
                        }
                    },
                    use: [
                        "svg-transform-loader"
                    ]
                },
                // Большие по размеру svg которые будут помещены в папку сборки и загружаться по url
                {
                    test: /(svg_url).*\.svg/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'svg/[hash][ext][query]'
                    }
                },
                // {
                //     test: /\.json$/,
                //     exclude: /node_modules/,
                //     type: 'asset/resource',
                //     generator: {
                //         filename: 'lottie/[name][ext]',
                //     },
                // },
                // Для стилей scss
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                url: true,
                                importLoaders: 1,
                                modules: {
                                    namedExport: false,
                                    ...(IS_DEVELOPMENT ? {
                                        localIdentName: '[folder]_[name]_[local]__[hash:base64]',
                                    } : {
                                        getLocalIdent: createMinifier(),
                                    }),
                                },
                            }
                        },
                        "svg-transform-loader/encode-query",
                        "sass-loader",
                    ],
                },
                // Для css, просто сжимаем файл и ничего больше не делаем
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },

                // Для всех больших картинок, кладем их в папку сборки
                {
                    test: /(img_url).*\.(png|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'img/[hash][ext][query]'
                    }
                },

                // Для всех маленьких картинок, конвертируем из в base64
                {
                    test: /(img_base64).*\.(png|jpg|jpeg|gif)$/i,
                    type: 'asset/inline',
                },

                // Шрифты
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[hash][ext][query]'
                    }
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new ForkTsCheckerWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: IS_DEVELOPMENT ? `[name]_[contenthash].css?t=${BUILD_DATE}` : '[name]_[contenthash].css',
                ignoreOrder: true
            }),
            new HtmlWebpackPlugin({
                template: './pageTemplate.html',
                favicon: './img/favicon/favicon.ico',
                publicPath: '/',
                chunks: ['main'],
                title: 'Мессенджер',
                filename: path.resolve(`${BUILD_OUTPUT_PATH_RESULT}/index.html`)
            }),
            new webpack.ids.DeterministicModuleIdsPlugin({
                maxLength: 5,
            })
        ],
        output: {
            path: BUILD_OUTPUT_PATH_RESULT,
            filename: IS_DEVELOPMENT ? `[name]_[contenthash].bundle.js?t=${BUILD_DATE}` : '[name]_[contenthash].bundle.js',
        },
        optimization: {
            runtimeChunk: 'single',
            moduleIds: false,
            innerGraph: true,
            removeAvailableModules: !IS_DEVELOPMENT,
            removeEmptyChunks: true,
            mergeDuplicateChunks: true,
            providedExports: true,
            realContentHash: true,
            sideEffects: false,
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'all',
                    }
                }
            },
        },
    };

    if (IS_DEVELOPMENT) {
    console.log("\x1b[33m", `
    ██████╗ ███████╗██╗   ██╗███████╗██╗      █████╗ ██████╗ ███╗   ███╗███████╗███╗  ██╗████████╗
    ██╔══██╗██╔════╝██║   ██║██╔════╝██║     ██╔══██╗██╔══██╗████╗ ████║██╔════╝████╗ ██║╚══██╔══╝
    ██║  ██║█████╗  ╚██╗ ██╔╝█████╗  ██║     ██║  ██║██████╔╝██╔████╔██║█████╗  ██╔██╗██║   ██║   
    ██║  ██║██╔══╝   ╚████╔╝ ██╔══╝  ██║     ██║  ██║██╔═══╝ ██║╚██╔╝██║██╔══╝  ██║╚████║   ██║   
    ██████╔╝███████╗  ╚██╔╝  ███████╗███████╗╚█████╔╝██║     ██║ ╚═╝ ██║███████╗██║ ╚███║   ██║   
    ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚══════╝ ╚════╝ ╚═╝     ╚═╝     ╚═╝╚══════╝╚═╝  ╚══╝   ╚═╝ `);
} else {
    console.log("\x1b[31m", `
    ██████╗ ██████╗  █████╗ ██████╗ ██╗   ██╗ █████╗ ████████╗██╗ █████╗ ███╗  ██╗
    ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██║   ██║██╔══██╗╚══██╔══╝██║██╔══██╗████╗ ██║
    ██████╔╝██████╔╝██║  ██║██║  ██║██║   ██║██║  ╚═╝   ██║   ██║██║  ██║██╔██╗██║
    ██╔═══╝ ██╔══██╗██║  ██║██║  ██║██║   ██║██║  ██╗   ██║   ██║██║  ██║██║╚████║
    ██║     ██║  ██║╚█████╔╝██████╔╝╚██████╔╝╚█████╔╝   ██║   ██║╚█████╔╝██║ ╚███║
    ╚═╝     ╚═╝  ╚═╝ ╚════╝ ╚═════╝  ╚═════╝  ╚════╝    ╚═╝   ╚═╝ ╚════╝ ╚═╝  ╚══╝`);
}
console.log('\x1b[37m', BUILD_DATE);

    return config;
}


//export default config;