const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Import the plugin

module.exports = {
  mode: "development",
  entry: "./src/index.js", // This now matches your new structure
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html' // Tells webpack to use your HTML as a template
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i, // Tells webpack to use these on .css files
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};