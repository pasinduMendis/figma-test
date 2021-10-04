const axios = require('axios')
const figmaApiKey = '246928-867d7caa-e160-442b-9d28-5e485672830e'

const arr = []
var position = []
var index = 1
var css = ''
var widthArr = []
var width = 1366 //display width
var x = [0]
var y = [0]
var xposition = 0
var yposition = 0

axios
  .get('https://api.figma.com/v1/files/DF6yeqypHUu3cSGeupWzVx', {
    headers: {
      'X-Figma-Token': figmaApiKey,
    },
  })
  .then((res) => {
    changeName(res.data.document, index)
    console.log(css)
  })

const changeName = (a, itemPath) => {
  const name = a.name.replace(/\s+/g, '-').toLowerCase() + '-' + itemPath
  arr.push(name)
  cssBuild(a, name)

  if (a.children != null && a.children != undefined) {
    if (a.children.length > 0) {
      a.children.map((item, id) => {
        if (id == 0) {
          position.push(index)
          x.push(xposition)
          y.push(yposition)
          widthArr.push(width)
        }

        index = id + 1

        var path = ''
        for (let i = 0; i < position.length; i++) {
          if (i == 0) {
            path = position[i]
          } else {
            path = path + '-' + position[i]
          }
        }
        path = path + '-' + index

        if (
          item.absoluteBoundingBox != null &&
          item.absoluteBoundingBox != undefined
        ) {
          width = item.absoluteBoundingBox.width
          xposition = item.absoluteBoundingBox.x
          yposition = item.absoluteBoundingBox.y
          css += `#${
            item.name.replace(/\s+/g, '-').toLowerCase() + '-' + path
          }{\n`
          css += `width:${(width * 100) / widthArr[widthArr.length - 1]}%;\n`
          css += `height:${item.absoluteBoundingBox.height}px;\n`
          css += `position:absolute;\n`
          css += `left:${
            ((xposition - x[x.length - 1]) * 100) /
            widthArr[widthArr.length - 1]
          }%;\n`
          css += `top:${yposition - y[y.length - 1]}px;\n`
          css += '}\n\n'
        } else {
          css += `#${
            item.name.replace(/\s+/g, '-').toLowerCase() + '-' + path
          }{\n`
          css += `width:100%;\n`
          css += `position:absolute;\n`
          css += '}\n\n'
        }

        changeName(item, path)
      })
      position.pop()
      widthArr.pop()
      x.pop()
      y.pop()
    }
  } else {
    if (a.absoluteBoundingBox != null && a.absoluteBoundingBox != undefined) {
      width = a.absoluteBoundingBox.width
      xposition = a.absoluteBoundingBox.x
      yposition = a.absoluteBoundingBox.y
      css += `#${name}{\n`
      css += `width:${(width * 100) / widthArr[widthArr.length - 1]}%;\n`
      css += `height:${a.absoluteBoundingBox.height}px;\n`
      css += `position:absolute;\n`
      css += `left:${
        ((xposition - x[x.length - 1]) * 100) / widthArr[widthArr.length - 1]
      }%;\n`
      css += `top:${yposition - y[y.length - 1]}px;\n`
      css += '}\n\n'
    } else {
      css += `#${name}{\n`
      css += `width:100%;\n`
      css += `position:absolute;\n`
      css += '}\n\n'
    }
  }
}

const cssBuild = (item, name) => {
  //text styles
  if (item.style != null && item.style != undefined) {
    css += `#${name}{\n`
    css += `margin:0\n;`
    css += `font-family:${item.style.fontFamily};\n`
    css += `font-style:${
      item.style.fontPostScriptName ? item.style.fontPostScriptName : 'unset'
    };\n`
    css += `font-weight:${item.style.fontWeight};\n`
    css += `font-size:${item.style.fontSize}px;\n`
    css += `line-height:${item.style.lineHeightPx}px;\n`
    css += `letter-spacing:${item.style.letterSpacing}px;\n`
    css += `vertical-align: text-${item.style.textAlignVertical};\n`
    css += `text-align: ${item.style.textAlignHorizontal.toLowerCase()};\n`
    css += `line-height: ${item.style.lineHeightPx}px;\n`
    css += '}\n\n'
  }

  if (
    item.background != null &&
    item.background != undefined &&
    item.background.length > 0
  ) {
    // console.log(item.background[0].color)
    css += `#${name}{\n`
    css += `background:rgba(${item.background[0].color.r * 255},${
      item.background[0].color.g * 255
    },${item.background[0].color.b * 255},${item.background[0].color.a});\n`
    css += '}\n\n'
  }

  if (
    item.fills != null &&
    item.fills != undefined &&
    item.fills.length > 0 &&
    (item.type != 'RECTANGLE' || item.type != 'FRAME')
  ) {
    // console.log(item.fills[0].color)
    css += `#${name}{\n`
    css += `color:rgba(${item.fills[0].color.r * 255},${
      item.fills[0].color.g * 255
    },${item.fills[0].color.b * 255},${item.fills[0].color.a});\n`
    css += '}\n\n'
  }
  if (
    item.fills != null &&
    item.fills != undefined &&
    item.fills.length > 0 &&
    (item.type == 'RECTANGLE' || item.type == 'FRAME')
  ) {
    // console.log(item.fills[0].color)
    css += `#${name}{\n`
    css += `background:rgba(${item.fills[0].color.r * 255},${
      item.fills[0].color.g * 255
    },${item.fills[0].color.b * 255},${item.fills[0].color.a});\n`
    css += '}\n\n'
  }
}
