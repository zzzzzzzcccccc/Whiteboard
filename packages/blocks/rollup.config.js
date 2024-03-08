const { getPlugins } = require('../../base.rollup.config')
const pkg = require('./package.json')

const external = [...Object.keys(pkg.devDependencies || {})].filter((pkgName) => ![].includes(pkgName))
const buildList = process.env.BUILD_LIST ? process.env.BUILD_LIST.split(',') : []
const output = buildList.map((format) => {
  const fileMapper = {
    cjs: pkg.main,
    es: pkg.module,
    umd: pkg.umd,
  }
  return {
    name: pkg.name,
    format,
    file: fileMapper[format],
    sourcemap: true,
  }
})

module.exports = {
  input: 'src/index.ts',
  output: output,
  external,
  plugins: getPlugins({
    enableTerser: process.env.ENABLE_TERSER === 'true',
    values: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
  }),
}
