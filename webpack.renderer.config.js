const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  // Put your normal webpack config below here
  plugins: [new MiniCssExtractPlugin()],
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
  },
}
