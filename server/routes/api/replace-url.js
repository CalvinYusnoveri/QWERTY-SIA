const fs = require('fs')
const PDFParser = require("pdf2json")

async function replaceURL(req, res, next) {
  if (req.body.queryResult.action === 'replace-url') {
    console.log('action === replace-url')

    // get the number of inline_keyboard objects
    console.log(req.body.queryResult.fulfillmentMessages[0].payload.telegram.reply_markup.inline_keyboard[0])
    let ikb = await req.body.queryResult.fulfillmentMessages[0].payload.telegram.reply_markup.inline_keyboard[0]
    let params = await req.body.queryResult.parameters
    let iter = await ikb.length
    console.log('there are this many inline_keyboard objects:', iter)

    // for inline_keyboard objects, replace @blah@ with param values (val) in url and text props
    for (var i=0; i < iter; i++) {
      try { for (var key in params) {
        let val = await params[key]
        let rgx = new RegExp(`@${key}@`,"g")

        console.log(`now in inline_keyboard obj ${i}; replacing, ${rgx} with ${val}`)
        ikb[i].text = await ikb[i].text.replace(rgx, val)
        ikb[i].url = await ikb[i].url.replace(rgx, val) }

      } catch (err) {console.log(err); continue}
    }

  next()
  }

  else { console.log('action !== replace-url'); next() }

}

async function pdf2JSON(req, res, next) {
  console.log('in pdf2JSON')
  let pdfParser = new PDFParser()

  let pdfFilePath = "./pdf-to-txt/747-400_amm-chap-32.pdf"

  fs.readFile(pdfFilePath, (err, pdfBuffer) => {
    if (!err) {
      console.log('inside')
      pdfParser.parseBuffer(pdfBuffer);
      fs.writeFile("./pdf-to-txt/747-400_amm-chap-32.json", JSON.stringify(pdfParser.getAllFieldsTypes()))
    }
    else {console.log('error')}
    next()
  })
}

exports.pdf2JSON = pdf2JSON
exports.replaceURL = replaceURL;
