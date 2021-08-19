const modoDev = process.env.NODE_ENV !== 'production';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: modoDev ? 'development' : 'production',
  entry: {
    index: './src/assets/ts/index.ts',
    // main: './src/assets/js/main.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: "node_modules/bootstrap/dist/js/bootstrap.min.js",
          to: "vendors/bootstrap"
        }
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/views/index.html',
      inject: 'head',
      scriptLoading: 'defer',
    }),
    new HtmlWebpackPlugin({
      filename: 'landingPage.html',
      template: 'src/views/landingPage.html',
      inject: 'head',
      scriptLoading: 'defer',
    }),
    // new MiniCssExtractPlugin({
    //   filename: modoDev ? "[name].css" : "[name].[contenthash].css" 
    // })
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // MiniCssExtractPlugin.loader,
          {
            // inject CSS to page
            loader: 'style-loader',
          }, 
          {
            // translates CSS into CommonJS modules
            loader: 'css-loader'
          }, 
          {
            // Run postcss actions
            loader: 'postcss-loader',
            options: {
              // `postcssOptions` is needed for postcss 8.x;
              // if you use postcss 7.x skip the key
              postcssOptions: {
                // postcss plugins, can be exported to postcss.config.js
                plugins: function () {
                  return [
                    require('autoprefixer')
                  ];
                }
              }
            }
          }, 
          {
            // compiles Sass to CSS
            loader: 'sass-loader'
          }
        ],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
