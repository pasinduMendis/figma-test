const axios = require('axios')
const figmaApiKey = '242074-a8b56093-5f1d-40e2-b488-5959f301e99d'

const arr = []
var position = []
var index = 1
var css = ''
/* var x = [0]
var y = [0]
var xposition = 0
var yposition = 0
var xValue = 0
var yValue = 0 */
const dispMap = 1

axios
  .get('https://api.figma.com/v1/files/CLzAIDtQbORMXGf1hhjRdd', {
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
          /*           x.push(xposition)
          y.push(yposition) */
        }

        /*  if (item.absoluteBoundingBox != undefined) {
          xposition = item.absoluteBoundingBox.x
          yposition = item.absoluteBoundingBox.y
        } */
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
        changeName(item, path)
      })
      position.pop()
      /*   xValue = x[x.length - 1]
      x.pop()
      yValue = x[y.length - 1]
      y.pop() */
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
    item.absoluteBoundingBox != null &&
    item.absoluteBoundingBox != undefined
  ) {
    css += `#${name}{\n`
    css += `width:${item.absoluteBoundingBox.width * dispMap}px;\n`
    css += `height:${item.absoluteBoundingBox.height * dispMap}px;\n`
    css += `position:relative;\n`
    //css += `left:${item.absoluteBoundingBox.x + 500}px;\n`
    css += `top:${item.absoluteBoundingBox.y}px;\n`
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
    /*  css += `height:${item.absoluteBoundingBox.height}px;\n`
    css += `position:relative;\n`
    css += `left:${item.absoluteBoundingBox.x + 500}px;\n`
    css += `top:${item.absoluteBoundingBox.y}px;\n` */
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
