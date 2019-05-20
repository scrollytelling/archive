const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [{
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              // options...
            }
          }
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.mustache$/,
        use: [
          'mustache-loader'
        ]
      }

      // {
      //   test: / ?\.(sa|sc|c)ss$/,
      //   exclude: /node_modules/,
      //   use: [
      //     devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         importLoaders: 1,
      //       }
      //     },
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         ident: 'postcss',
      //         plugins: () => [
      //           postcssPresetEnv()
      //         ]
      //       }
      //     },
      //     'sass-loader'
      //   ]
      // },
      // {
      //   test: /\.html$/,
      //   use: [
      //     {
      //       loader: 'mustache-loader'
      //     },
      //     {
      //       loader: 'html-loader',
      //       options: {
      //         interpolate: true
      //       }
      //     }
      //   ]
      // }
    ]
  }
}
