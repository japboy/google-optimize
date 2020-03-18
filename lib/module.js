const { existsSync } = require('fs')
const { join, resolve } = require('path')

module.exports = async function module (moduleOptions) {
  const options = Object.assign(
    {
      pushPlugin: true,
      experimentsDir: '~/experiments',
      maxAge: 60 * 60 * 24 * 7, // 1 Week
      plugins: [],
      // https://developers.google.com/optimize/devguides/experiments
      send: ({ experiment }) => {
        if (process.server || !window.ga || !experiment || !experiment.experimentID) {
          return
        }

        const exp = experiment.experimentID + '.' + experiment.$variantIndexes.join('-')

        window.ga('set', 'exp', exp)
      }
    },
    this.options.googleOptimize,
    moduleOptions
  )

  const app = this.options.dir.app || 'app'
  const userOptions = join(this.options.srcDir, app, 'google-optimize', 'options.js')
  const userOptionsExists = existsSync(userOptions)
  const templateOpts = {
    src: userOptionsExists ? userOptions : resolve(__dirname, 'templates', 'options.js'),
    fileName: 'google-optimize/options.js',
    options
  }

  const pluginOpts = {
    src: resolve(__dirname, 'templates', 'plugin.js'),
    fileName: 'google-optimize/plugin.js',
    options
  }

  if (options.pushPlugin) {
    const { dst } = this.addTemplate(templateOpts)
    this.options.plugins.push(resolve(this.options.buildDir, dst))
  } else {
    this.addPlugin(pluginOpts)
  }

  // Extend with plugins
  if (options.plugins) {
    options.plugins.forEach(p => this.options.plugins.push(p))
  }
}
