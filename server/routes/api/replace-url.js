const express = require('express');
const router = express.Router();

// POST
router.post('/', async (req, res, next) => {
  replaceURL
  res.send(req)
})

async function replaceURL(req, res, next) {
  if (req.body.queryResult.action === 'replace-url') {
    console.log('action === replace-url')

    // get the number of inline_keyboard objects
    let ikb = req.body.queryResult.fulfillmentMessages.telegram.reply_markup.inline_keyboard
    let params = req.body.queryResult.parameters
    let iter = ikb.length
    console.log('there are this many inline_keyboard objects:', iter)

    // for inline_keyboard objects, replace @blah@ with param values (val) in url and text props
    for (var i=0; i < iter; i++) {
      try { for (var key in params) {
        let val = params[key]
        let rgx = new RegExp(`@${key}@`,"g")

        console.log(`now in inline_keyboard obj ${i}; replacing, ${rgx} with ${val}`)
        ikb[i].text = await ikb[i].text.replace(rgx, val)
        ikb[i].url = await ikb[i].url.replace(rgx, val) }

      } catch (err) {console.log(err); continue}
    }
  }

  else { console.log('action !== replace-url') }
}
module.exports = router;
