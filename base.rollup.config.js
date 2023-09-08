const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const replace = require('@rollup/plugin-replace');
const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');

const getPlugins = ({ values = {}, enableTerser = false }) => {
  const plugins = [
    resolve({ browser: true }),
    commonjs(),
    typescript(),
    babel({
      babelHelpers: 'bundled',
      exclude: /node_modules/,
      presets: [
        [
          "@babel/preset-env",
          {
            "useBuiltIns": "usage",
            "corejs": 3,
            "modules": false,
            "targets": ["> 1%", "ie >= 11"],
            "spec": true,
            "forceAllTransforms": true
          }
        ],
        "@babel/preset-typescript",
        "@babel/preset-react"
      ],
    }),
    replace({
      preventAssignment: true,
      values,
    })
  ];

  if (enableTerser) {
    plugins.push(terser())
  }

  return plugins;
}

module.exports = {
  getPlugins,
}
