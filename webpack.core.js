const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const BABEL_OPTIONS = {
  cacheDirectory: true,
  cacheCompression: false,
  envName: "production",
};

const initEntry = (dist, target, entry, filename) => {
  return {
    entry: entry,
    target: target,
    output: {
      path: path.resolve(__dirname, dist),
      filename: filename,
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: BABEL_OPTIONS,
            },
            {
              loader: "ts-loader",
            },
          ],
        },
        {
          test: /\.js(x?)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: BABEL_OPTIONS,
          },
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
  };
};

const addCSSModules = (object, cssfilename) => {
  object.module.rules.push(
    {
      test: /\.s[ac]ss$/i,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
          },
        },
        "postcss-loader",
        "sass-loader",
      ],
    },
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, "css-loader"],
    }
  );
  object.plugins = [
    new MiniCssExtractPlugin({
      filename: cssfilename,
    }),
  ].filter(Boolean);
  return object;
};

const addHTMLModules = (object, htmlfilename, cssfilename) => {
  object.module.rules.push({
    test: /\.s[ac]ss$/i,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: "css-loader",
        options: {
          importLoaders: 1,
        },
      },
      "postcss-loader",
      "sass-loader",
    ],
  });
  object.plugins = [
    new MiniCssExtractPlugin({
      filename: cssfilename,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, htmlfilename),
      inject: true,
    }),
  ].filter(Boolean);
  return object;
};

module.exports = {
  initEntry: initEntry,
  addCSSModules: addCSSModules,
  addHTMLModules: addHTMLModules,
};
