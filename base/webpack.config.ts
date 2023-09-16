import webpack, { Configuration as WebpackConfig } from 'webpack';
import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { Configuration as DevServerConfig } from 'webpack-dev-server';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import dotenv from 'dotenv';

const DEV_ENV = 'development';
const PROD_ENV = 'production';
const isDevMode = process.env.NODE_ENV !== PROD_ENV;
console.log(isDevMode);


dotenv.config({ path: isDevMode ? '.env.development' : '.env.production' })
const PORT = process.env.PORT;
console.log(PORT)
const SOURCE_DIR = 'src';
const PUBLIC_DIR = 'public';
const OUTPUT_DIR = 'dist';

interface Configuration extends WebpackConfig {
  devServer?: DevServerConfig;
}
const ENV: { [x: string]: string } = {
  NODE_ENV: isDevMode ? DEV_ENV : PROD_ENV,
};
for (const key in process.env) {
  if (key && key.startsWith('REACT_APP_')) {
    ENV[key] = process.env[key] || '';
  }
}


const config: WebpackConfig = {
  name: 'via-frontend',
  mode: isDevMode ? DEV_ENV : PROD_ENV,
  devtool: isDevMode ? 'inline-source-map' : 'hidden-source-map',
  entry: `./${SOURCE_DIR}/index`,
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx',],
    alias: {
      '@': path.resolve(__dirname, SOURCE_DIR),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use:["babel-loader", "ts-loader"],
        // options: {
        //   presets: [
        //     [
        //       '@babel/preset-env',
        //       {
        //         targets: { browsers: ['IE 10'] },
        //         debug: isDevMode,
        //       },
        //     ],
        //     '@babel/preset-react',
        //     '@babel/preset-typescript',
        //   ],
        //    env: {
        //     development: {
        //       plugins: [require.resolve('react-refresh/babel')],
        //     },
        //   },
        // },
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
              publicPath: '/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new webpack.EnvironmentPlugin(ENV),
    new HtmlWebpackPlugin({
      template: `./${PUBLIC_DIR}/index.html`,
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: 'public/images', to: 'images' }],
    }),
  ],
  output: {
    path: path.join(__dirname, OUTPUT_DIR),
    filename: isDevMode ? '[name].js' : '[name].[contenthash].js',
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: true,
    port: PORT,
    // devMiddleware: { publicPath: OUTPUT_DIR },
    // static: { directory: path.resolve(__dirname, PUBLIC_DIR) },
    open: true,
    hot: true,
    allowedHosts: "all",
  },
};
if (isDevMode) {
  if (config.plugins) {
    config.plugins.push(
      new ReactRefreshWebpackPlugin(),
    );
    config.plugins.push(
      new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: false }),
    );
  }
} else {
  if (config.plugins) {
    config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
    config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
  }
}
export default config;