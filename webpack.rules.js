const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = [
  {
    test: /\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.tsx?|jsx?$/,
    loader: 'babel-loader',
    options: {
      presets: ['@babel/react', '@babel/typescript'],
    },
  },
  {
    test: /\.css$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
      },
      'css-loader',
    ],
  },
  {
    test: /\.(png|jpg|gif|svg)$/,
    loader: 'file-loader',
    query: {
      name: '[name].[ext]?[hash]',
    },
  },
]
