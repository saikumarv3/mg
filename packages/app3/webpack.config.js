const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  mode: 'development',
  entry: './src/bootstrap.ts',
  devServer: {
    port: 3003,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    compress: true,
    hot: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'angular2-template-loader',
          'ts-loader'
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              esModule: false,
              minimize: false
            }
          }
        ],
        exclude: [/node_modules/, /public/],
      },
      {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'app3',
      filename: 'remoteEntry.js',
      exposes: {
        './DashboardPage': './src/app/dashboard/dashboard.component',
      },
      // shared: omitted - Angular app runs in iframe with its own Angular instance,
      // so it doesn't share dependencies with React host app to avoid conflicts
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
};

