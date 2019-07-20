async function replaceURL(req, res, next) {
  if (req.body.queryResult.action === 'replace-url') {
    console.log('action === replace-url')

    // do this things

    next()
  }
  else {
    console.log('action !== replace-url')
    next() // go to next thing
  }
}
exports.replaceURL = replaceURL
