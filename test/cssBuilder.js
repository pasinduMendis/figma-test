const axios = require('axios')
const figmaApiKey = '242074-a8b56093-5f1d-40e2-b488-5959f301e99d'

const arr = []
var position = []
var index = 1
var css = ''

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
        changeName(item, path)
      })
      position.pop()
    }
  }
}

const cssBuild = (item, name) => {
  if (item.style != null && item.style != undefined) {
    css += `#${name}{\n`
    const styles = Object.entries(item.style)
    styles.map((i, id) => {
      var value = i[1]
      var key = i[0]
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase()
      const checkPx = key.split('-')
      if (checkPx[checkPx.length - 1] == 'px') {
        key = checkPx[0]
        checkPx.map((text, id) => {
          if (id != 0 && id != checkPx.length - 1) {
            key += '-' + text
          }
        })
        value = value + 'px'
      } else if (checkPx[checkPx.length - 1] == 'percent') {
        key = checkPx[0]
        checkPx.map((text, id) => {
          if (id != 0 && id != checkPx.length - 1) {
            key += '-' + text
          }
        })
        value = value + '%'
      } else if (
        checkPx[checkPx.length - 1] == 'vertical' ||
        checkPx[checkPx.length - 1] == 'horizontal'
      ) {
        key = checkPx[0]
        checkPx.map((text, id) => {
          if (id != 0 && id != checkPx.length - 1) {
            key += '-' + text
          }
        })
        value = value.toLowerCase() //vertical-allign
      }

      css += key + ':' + value + ';\n'
    })
    css += '}\n\n'
  }
  if (
    item.absoluteBoundingBox != null &&
    item.absoluteBoundingBox != undefined
  ) {
    css += `#${name}{\n`
    const styles = Object.entries(item.absoluteBoundingBox)
    styles.map((i, id) => {
      if (i[0] != 'x' && i[0] != 'y') {
        css += i[0] + ':' + i[1] + 'px;\n'
      }
    })
    css += '}\n\n'
  }
}
