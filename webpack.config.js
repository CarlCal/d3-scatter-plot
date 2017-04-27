
const webpack = require('webpack')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const debug = process.env.NODE_ENV !== "production"
const cssDev = ['style-loader', 'css-loader']
const cssProd = ExtractTextPlugin.extract({
      fallback: "style-loader",
      use: ["css-loader"],
      publicPath: "/build"
    })
const cssConfig = debug ? cssDev : cssProd

module.exports = {
  context: path.join(__dirname, "src"),
  devtool: debug ? "inline-sourcemap" : false,
  entry: "./js/client.js",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { "modules":false }],
          ]
        }
      },
      { 
        test: /\.css$/,
        use: cssConfig
      }
    ]
  },
  output: {
    path: __dirname + "/build/",
    filename: "client.bundle.js",
  },
  devServer: {
    contentBase: path.join(__dirname, "build"),
    compress: true,
    port: 8080,
    stats: "errors-only",
    open: true,
    hot: true
  },
  plugins: debug ? [
    new HtmlWebpackPlugin({
      title: "D3 - Scatter Plot Exercise",
      template: "index.ejs",
      hash: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ] : 
  [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      title: "D3 - Scatter Plot Exercise",
      template: "index.ejs",
      minify: {
        collapseWhitespace: true
      },
      hash: true,
    }),
    new ExtractTextPlugin({
      filename: "main.css",
      disable: false,
      allChunks: true
    }),
  ]
}
