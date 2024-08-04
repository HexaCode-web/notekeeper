const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    popup: path.resolve("./src/popups/index.js"),
    options: path.resolve("./src/options/options.js"),
    background: path.resolve("./src/background/background.js"),
    content_script: path.resolve("src/content_script.js"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src/manifest.json"),
          to: path.resolve("dist"),
        },
        {
          from: path.resolve("src/assets"),
          to: path.resolve("dist/icons"),
        },
        {
          from: path.resolve("src/Input/CustomInput.jsx"),
          to: path.resolve("dist/Input"),
        },
      ],
    }),
    ...getHtmlPlugins(["popup", "options"]),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  output: {
    filename: "[name].js",
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlPlugin({
        title: "React Extension",
        filename: `${chunk}.html`,
        template: path.resolve(__dirname, `src/template.html`),

        chunks: [chunk],
      })
  );
}
