const path = require("path");

module.exports = {
  entry: {
    app: "./src/web-client/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "static/dist"),
    publicPath: "/dist/",
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "vue-style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.scss$/,
        use: [
          "vue-style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            "scss": [
              "vue-style-loader",
              "css-loader",
              "sass-loader",
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ],
          },
        },
      },
      {
        test: /\.tsx?$/,
        // NOTE: watch https://github.com/s-panferov/awesome-typescript-loader/issues/356
        // loader: "awesome-typescript-loader",
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.(png)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
              publicPath: "static/",
            },
          },
        ],
      }
    ],
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
    extensions: [".js", ".ts", ".vue", ".json"],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
  externals: {
    "vue": "Vue",
    "quasar": "Quasar",
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "static"),
    compress: true,
    port: 9000,
    proxy: {
      // TODO: make server address configurable
      "/socket.io/socket.io.js": "http://localhost:3000/socket.io/socket.io.js",
    },
  },
};
