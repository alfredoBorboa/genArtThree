const path = require('path');

module.exports = {
  devtool: 'source-map',
  watch: true, //this keeps building the project anytime a change is made to the scoped files
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        },
        {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
        },
        {
            test: /\.js$/i,
            enforce: "pre",
            use: ["source-map-loader"],
        },
        {
            test: /\.hdr$/, 
            use: ["url-loader"],
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
        },
        {
            test: /\.(csv|tsv)$/i,
            use: ['csv-loader'],
        },
        {
            test: /\.xml$/i,
            use: ['xml-loader'],
        },
    ],
},
};