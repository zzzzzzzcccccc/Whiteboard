const path = require("path")
const webpack = require("webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const pathResolve = (target = '') => path.resolve(__dirname, target)

module.exports = (_, { mode }) => {
  const isDev = mode !== "production"

  const config = {
    mode,
    target: isDev ? 'web' : 'browserslist',
    entry: {
      main: pathResolve("src/index.tsx")
    },
    output: {
      publicPath: isDev ? '/' : './',
      path: pathResolve("dist"),
      filename: '[name].[contenthash:8].js',
    },
    devtool: isDev ? 'eval-source-map' : 'source-map',
    module: {
      rules: [
        {
          test: /\.(jpg|jpeg|png|webp|gif)$/,
          exclude: /node_modules/,
          use: ['url-loader', 'file-loader']
        },
        {
          test: /.(css|less)$/,
          exclude: /node_modules/,
          use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json']
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.ProvidePlugin({
        process: 'process/browser'
      }),
      new HtmlWebpackPlugin({
        template: pathResolve("public/index.html"),
      })
    ],
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
    devServer: {
      allowedHosts: 'all',
      open: false,
      port: 9999,
      static: {
        directory: pathResolve('public'),
        publicPath: '/'
      },
      client: {
        overlay: {
          errors: true,
          warnings: false,
          runtimeErrors: true
        }
      },
      hot: true
    }
  }

  if (!isDev) {
    config.optimization.minimize = true
    config.optimization.minimizer = [
      new CssMinimizerPlugin(), new TerserPlugin()
    ]
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css'
      })
    )
  }

  return config
}
