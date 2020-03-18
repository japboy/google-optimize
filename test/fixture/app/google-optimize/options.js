export default {
  send: ({ experiment }) => {
    if (process.server || !experiment || !experiment.experimentID) {
      return
    }
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      expId: experiment.experimentID,
      expVar: experiment.$variantIndexes.join('-')
    })
  }
}
