const axios = require('axios')
const figmaApiKey = '246928-867d7caa-e160-442b-9d28-5e485672830e'

const arr = []
var position = []
var HtmlType = []
var index = 1
var prevItem = ''
let htmlTags = `<body >`

axios
  .get('https://api.figma.com/v1/files/DF6yeqypHUu3cSGeupWzVx', {
    headers: {
      'X-Figma-Token': figmaApiKey,
    },
  })
  .then((res) => {
    changeName(res.data.document, index)
    //console.log(arr)
    htmlTags += `</body >`
    console.log(htmlTags)
  })

const changeName = (a, itemPath) => {
  const name = a.name.replace(/\s+/g, '-').toLowerCase() + '-' + itemPath
  arr.push(name)
  if (a.children != null && a.children != undefined) {
    if (a.children.length > 0) {
      a.children.map((item, id) => {
        if (id == 0) {
          position.push(index)
          buildHtml(prevItem, name)
        }
        index = id + 1
        prevItem = item
        var path = ''
        for (let i = 0; i < position.length; i++) {
          if (i == 0) {
            path = position[i]
          } else {
            path = path + '-' + position[i]
          }
        }
        path = path + '-' + index
        changeName(item, path)
      })
      htmlTags += `${HtmlType[HtmlType.length - 1]}`
      HtmlType.pop()
      position.pop()
    }
  } else {
    buildHtml(a, name)
    htmlTags += `${HtmlType[HtmlType.length - 1]}`
    HtmlType.pop()
  }
}

const buildHtml = (item, name) => {
  if (item.name == 'NAV' && item.type == 'FRAME') {
    htmlTags += `<nav id='${name}'>`
    HtmlType.push('</nav>')
  } else if (item.type == 'FRAME') {
    htmlTags += `<div id='${name}'>`
    HtmlType.push('</div>')
  } else if (item.type == 'TEXT') {
    htmlTags += `<p id='${name}'> ${item.characters}`
    HtmlType.push('</p>')
  } else if (item.type == 'RECTANGLE') {
    htmlTags += `<div id='${name}'>`
    HtmlType.push('</div>')
  } else {
    htmlTags += `<div id='${name}'>`
    HtmlType.push('</div>')
  }
}
