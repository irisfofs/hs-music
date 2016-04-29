// webpack.config.js
module.exports = {
  entry: './src/main.js',
  output: {
    path: './dist', // This is where images AND js will go
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.json$/, loader: 'json-loader' },
    ]
  }
};
