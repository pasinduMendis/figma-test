const axios = require('axios')
const figmaApiKey = '242074-a8b56093-5f1d-40e2-b488-5959f301e99d'

const arr = []
var position = []
var index = 1

axios
  .get('https://api.figma.com/v1/files/CLzAIDtQbORMXGf1hhjRdd', {
    headers: {
      'X-Figma-Token': figmaApiKey,
    },
  })
  .then((res) => {
    changeName(res.data.document, index)
    console.log(arr)
  })

const changeName = (a, itemPath) => {
  const name = itemPath + ' ' + a.name.replace(/\s+/g, '-').toLowerCase()
  arr.push(name)
  if (a.children != null || a.children != undefined) {
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
