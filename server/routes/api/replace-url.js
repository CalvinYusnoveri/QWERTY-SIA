const fs = require('fs')
const PDFParser = require("pdf2json")

async function replaceURL(req, res, next) {
  if (req.body.queryResult.action === 'replace-url') {
    console.log('action === replace-url')

    // get the number of inline_keyboard objects
    let params = await req.body.queryResult.parameters

    // for inline_keyboard objects, replace @blah@ with param values (val) in url and text props
    try { for (var key in params) {
      let val = await params[key]
      let rgx = new RegExp(`@${key}@`,"g")

      console.log(`now replacing, ${rgx} with ${val}`)
      req.body.queryResult.fulfillmentMessages = await JSON.parse(JSON.stringify(req.body.queryResult.fulfillmentMessages).replace(rgx, val))
      console.log('result:', JSON.stringify(req.body.queryResult.fulfillmentMessages)) }

    } catch (err) {console.log(err)}
  next()

  } else { console.log('action !== replace-url'); next() }
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
