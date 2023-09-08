const { getPlugins } = require('../../base.rollup.config')
const pkg = require('./package.json')

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      name: pkg.name,
      format: 'cjs',
      file: pkg.main,
      sourcemap: true,
    },
    {
      name: pkg.name,
      format: 'es',
      file: pkg.module,
      sourcemap: true,
    },
    {
      name: pkg.name,
      format: 'umd',
      file: pkg.umd,
      sourcemap: true,
    }
  ],
  plugins: getPlugins({
    enableTerser: true,
  }),
};
